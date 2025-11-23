
import { GoogleGenAI } from "@google/genai";

// Initialize AI Client
// ⚠️ WARNING: API KEY EXPOSURE RISK
// This is a frontend-only demo. In a production environment, 
// NEVER expose your API key in client-side code.
// You MUST use a Backend Server (Node.js/Python) as a proxy to call Gemini API.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please check configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const sanitizeInput = (input: string): string => {
  // Basic sanitization to prevent simple injection attacks
  return input.replace(/<[^>]*>/g, "");
};

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
    
    // Prompt Defense: Wrapping user input in XML tags to separate instructions from data
    const prompt = `
      System: You are a cybersecurity expert analyzing Vietnamese text messages for scams.
      Task: Analyze the content inside <user_content> tags.
      
      Classify as:
      - SCAM: Clear signs of fraud (money request, fake authority, phishing).
      - SUSPICIOUS: Unusual requests, urgency, unverified links.
      - SAFE: Normal conversation.

      Output Format: "CLASSIFICATION | Short explanation for elderly person"

      <user_content>
      ${cleanInput}
      </user_content>
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = response.text || "";
    const [classification, explanation] = text.split('|');
    
    let result: 'safe' | 'suspicious' | 'scam' = 'safe';
    if (classification.trim().includes('SCAM')) result = 'scam';
    else if (classification.trim().includes('SUSPICIOUS')) result = 'suspicious';

    return { result, explanation: explanation?.trim() || "Cần cảnh giác." };

  } catch (error) {
    console.error("AI Service Error:", error);
    
    // 2. Fallback Logic execution
    if (scamKeywords.test(cleanInput) && urgentKeywords.test(cleanInput)) {
        return { 
            result: 'suspicious', 
            explanation: "Hệ thống ngoại tuyến: Phát hiện từ khóa nhạy cảm và hối thúc. Vui lòng gọi điện xác minh." 
        };
    }
    
    return {
        result: 'suspicious',
        explanation: "Lỗi kết nối máy chủ. Hãy cẩn trọng vì không thể phân tích sâu lúc này."
    };
  }
};
