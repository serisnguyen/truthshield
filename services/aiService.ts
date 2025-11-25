
import { GoogleGenAI } from "@google/genai";
import { CallLogItem } from "../context/AuthContext";

// Initialize AI Client
// ⚠️ WARNING: API KEY EXPOSURE RISK
// This is a frontend-only demo. In a production environment, 
// NEVER expose your API key in client-side code.
// You MUST use a Backend Server (Node.js/Python) as a proxy to call Gemini API.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  // In a real scenario, we would throw if no key. 
  // For this demo, we return null to trigger fallback logic gracefully.
  if (!apiKey) {
    console.warn("API Key not found. Using mock/fallback logic.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const sanitizeInput = (input: string): string => {
  // Basic sanitization to prevent simple injection attacks
  return input.replace(/<[^>]*>/g, "");
};

// Helper to create a timeout promise
const timeoutPromise = (ms: number) => new Promise((_, reject) => {
    setTimeout(() => reject(new Error("AI_TIMEOUT")), ms);
});

/**
 * Analyzes text for scam indicators using Gemini with Prompt Defense.
 * Includes a regex fallback if the API fails.
 */
export const analyzeMessageRisk = async (message: string): Promise<{
  result: 'safe' | 'suspicious' | 'scam';
  explanation: string;
}> => {
  const cleanInput = sanitizeInput(message);

  // 1. Regex Fallback (Offline/Error Mode)
  const scamKeywords = /(chuyển tiền|cấp cứu|trúng thưởng|mật khẩu|otp|tài khoản ngân hàng|nâng cấp sim|khóa tài khoản)/i;
  const urgentKeywords = /(gấp|ngay lập tức|trong vòng 24h|khẩn cấp)/i;

  try {
    const ai = getAIClient();
    
    if (!ai) {
        throw new Error("NO_API_KEY");
    }
    
    // Prompt Defense: Wrapping user input in XML tags
    const prompt = `
      System: You are a cybersecurity expert analyzing Vietnamese text messages for scams.
      Task: Analyze the content inside <user_content> tags. Keep explanation under 20 words.
      
      Classify as:
      - SCAM: Clear signs of fraud.
      - SUSPICIOUS: Unusual requests, urgency.
      - SAFE: Normal conversation.

      Output Format: "CLASSIFICATION | Short explanation for elderly person"

      <user_content>
      ${cleanInput}
      </user_content>
    `;

    // Race between API call and 8-second timeout
    const response: any = await Promise.race([
        ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        }),
        timeoutPromise(8000) 
    ]);

    const text = response.text || "";
    const [classification, explanation] = text.split('|');
    
    let result: 'safe' | 'suspicious' | 'scam' = 'safe';
    if (classification?.trim().includes('SCAM')) result = 'scam';
    else if (classification?.trim().includes('SUSPICIOUS')) result = 'suspicious';

    return { result, explanation: explanation?.trim() || "Cần cảnh giác." };

  } catch (error: any) {
    console.warn("AI Service Fallback triggered:", error.message);
    
    // Handle Timeout specifically
    if (error.message === "AI_TIMEOUT") {
        return {
            result: 'suspicious',
            explanation: "Mạng chậm. Hệ thống chưa thể xác minh kỹ, hãy gọi điện lại cho người gửi."
        };
    }
    
    // 2. Fallback Logic execution
    if (scamKeywords.test(cleanInput) || urgentKeywords.test(cleanInput)) {
        return { 
            result: 'suspicious', 
            explanation: "Hệ thống ngoại tuyến: Phát hiện từ khóa nhạy cảm. Vui lòng gọi điện xác minh." 
        };
    }
    
    return {
        result: 'safe',
        explanation: "Không phát hiện từ khóa nguy hiểm (Chế độ Offline)."
    };
  }
};

/**
 * Analyzes a call log entry to determine risk score.
 */
export const analyzeCallRisk = async (call: CallLogItem): Promise<{
    riskScore: number;
    explanation: string;
}> => {
    try {
        const ai = getAIClient();
        if (!ai) throw new Error("NO_API_KEY");

        const prompt = `
        System: You are a security expert analyzing call logs for seniors in Vietnam.
        Data:
        - Number: ${call.phoneNumber}
        - Known Contact Name: ${call.contactName || "Unknown/None"}
        - Duration: ${call.duration} seconds
        - Direction: ${call.direction}

        Heuristics:
        1. Known contact = Very Low Risk (0-10%).
        2. Unknown + Very short duration (<10s) = High Risk (Ping call/Spam) (60-80%).
        3. Unknown + Long duration (>300s) = Potential Scam Risk (Inducing investment/fear) (40-60%).
        4. Unknown + Medium duration = Medium Risk (30-50%).
        
        Task: Provide a risk score (0-100) and a very short explanation (max 15 words) in Vietnamese.
        Format: "SCORE | EXPLANATION"
        Example: "85 | Số lạ gọi nháy máy, có thể là lừa đảo cước phí."
        `;

        const response: any = await Promise.race([
            ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            }),
            timeoutPromise(5000)
        ]);

        const text = response.text || "";
        const [scoreStr, explanation] = text.split('|');
        const score = parseInt(scoreStr.trim()) || 0;

        return {
            riskScore: score,
            explanation: explanation?.trim() || "Đã phân tích."
        };

    } catch (error) {
        console.error("Call Analysis Error", error);
        // Fallback logic
        let fallbackScore = 10;
        let fallbackExp = "An toàn.";
        
        if (!call.contactName) {
            if (call.duration < 10) { 
                // Cuộc gọi dưới 10 giây (Nháy máy/Spam)
                fallbackScore = 75;
                fallbackExp = "Số lạ, gọi quá ngắn (Nháy máy).";
            } else if (call.duration >= 300) { 
                // Cuộc gọi từ 5 phút trở lên (Thời lượng lý tưởng cho lừa đảo)
                fallbackScore = 65;
                fallbackExp = "Số lạ, gọi rất lâu. Cần cảnh giác lừa đảo dàn dựng.";
            } else { 
                // Cuộc gọi có thời lượng trung bình (10s - 300s)
                fallbackScore = 40;
                fallbackExp = "Số lạ, cần xác minh.";
            }
        } else {
            fallbackScore = 5;
            fallbackExp = "Người quen trong danh bạ.";
        }

        return {
            riskScore: fallbackScore,
            explanation: fallbackExp + " (Offline)"
        };
    }
};
