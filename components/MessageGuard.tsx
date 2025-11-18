import React, { useState } from 'react';
import { MessageSquareText, Sparkles, AlertTriangle, CheckCircle, Copy, Search, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const MessageGuard: React.FC = () => {
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<'safe' | 'suspicious' | 'scam' | null>(null);
  const [explanation, setExplanation] = useState('');

  const analyzeMessage = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `Analyze this text message (in Vietnamese) for potential scam indicators. 
          Text: "${input}"
          
          Classify as: SAFE, SUSPICIOUS, or SCAM.
          Then provide a very short (1 sentence) explanation in Vietnamese suitable for elderly people.
          Format: CLASSIFICATION | Explanation` }] }
        ],
      });

      const text = response.text || "";
      const [classification, reason] = text.split('|');
      
      if (classification.trim().includes('SCAM')) setResult('scam');
      else if (classification.trim().includes('SUSPICIOUS')) setResult('suspicious');
      else setResult('safe');
      
      setExplanation(reason || "Không thể phân tích chi tiết.");

    } catch (error) {
      setResult('suspicious');
      setExplanation("Lỗi kết nối AI. Hãy cẩn trọng với tin nhắn này.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 pt-20 pb-32 min-h-screen flex flex-col max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kiểm Tra <span className="text-blue-600">Tin Nhắn</span></h2>
        <p className="text-slate-500 text-base">Dán nội dung tin nhắn vào bên dưới để AI kiểm tra xem có lừa đảo không.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        
        {/* Input Area */}
        <div className="relative bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"></div>
          <div className="p-6">
            <textarea 
              className="w-full bg-slate-50 text-slate-900 text-lg placeholder-slate-400 focus:outline-none resize-none h-40 p-4 rounded-xl border border-slate-200 focus:border-blue-400 transition-colors"
              placeholder="Ví dụ: 'Con đang cấp cứu, chuyển tiền gấp vào số này...'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
               <button className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1.5 transition-colors">
                 <Copy size={16} /> Dán từ bộ nhớ
               </button>
               <button 
                 onClick={analyzeMessage}
                 disabled={analyzing || !input}
                 className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-base font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-200 ${analyzing ? 'opacity-70' : ''}`}
               >
                 {analyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={20} />}
                 {analyzing ? 'Đang kiểm tra...' : 'Phân Tích Ngay'}
               </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className={`rounded-3xl p-6 border-2 animate-in slide-in-from-bottom duration-500 shadow-md ${
            result === 'safe' ? 'bg-green-50 border-green-200' : 
            result === 'scam' ? 'bg-red-50 border-red-200' : 
            'bg-amber-50 border-amber-200'
          }`}>
             <div className="flex items-center gap-4 mb-3">
                {result === 'safe' && <CheckCircle className="text-green-600 fill-green-100" size={40} />}
                {result === 'scam' && <AlertTriangle className="text-red-600 fill-red-100" size={40} />}
                {result === 'suspicious' && <Search className="text-amber-600 fill-amber-100" size={40} />}
                
                <div>
                    <h3 className={`text-xl font-black uppercase tracking-wide ${
                    result === 'safe' ? 'text-green-700' : 
                    result === 'scam' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                    {result === 'safe' ? 'An Toàn' : result === 'scam' ? 'CẢNH BÁO LỪA ĐẢO' : 'Cần Cảnh Giác'}
                    </h3>
                    <p className="text-slate-700 text-base font-medium mt-1">
                    {explanation}
                    </p>
                </div>
             </div>
          </div>
        )}

        {/* Tips */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3 text-blue-600">
                  <MessageSquareText size={20} />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">Tin nhắn ngân hàng giả</h4>
                <p className="text-sm text-slate-500">Phát hiện tin nhắn mạo danh yêu cầu mật khẩu hoặc chuyển tiền.</p>
             </div>
             <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3 text-purple-600">
                  <ArrowRight size={20} />
                </div>
                <h4 className="text-slate-900 font-bold mb-1">Đường link lạ</h4>
                <p className="text-sm text-slate-500">Kiểm tra các đường dẫn đáng ngờ có chứa mã độc.</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MessageGuard;