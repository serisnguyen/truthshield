import React, { useState } from 'react';
import { MessageSquareText, Sparkles, AlertTriangle, CheckCircle, Copy, Search, ArrowRight, ShieldAlert } from 'lucide-react';
import { analyzeMessageRisk } from '../services/aiService';

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
      // Use the Secure AI Service
      const analysis = await analyzeMessageRisk(input);
      
      setResult(analysis.result);
      setExplanation(analysis.explanation);

    } catch (error) {
      setResult('suspicious');
      setExplanation("Có lỗi xảy ra khi kết nối. Hãy cẩn trọng.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-4 pt-20 md:pt-10 pb-32 min-h-screen flex flex-col max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Kiểm Tra <span className="text-blue-600">Tin Nhắn</span></h2>
        <p className="text-slate-500 text-sm md:text-base">Dán nội dung tin nhắn vào bên dưới để hệ thống AI kiểm tra.</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 md:gap-6">
        
        {/* Input Area */}
        <div className="relative bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"></div>
          <div className="p-4 md:p-6">
            <textarea 
              className="w-full bg-slate-50 text-slate-900 text-base md:text-lg placeholder-slate-400 focus:outline-none resize-none h-32 md:h-40 p-3 md:p-4 rounded-xl border border-slate-200 focus:border-blue-400 transition-colors"
              placeholder="Ví dụ: 'Con đang cấp cứu, chuyển tiền gấp vào số này...'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            
            <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center mt-4 pt-4 border-t border-slate-100">
               <button 
                 onClick={async () => {
                    try {
                        const text = await navigator.clipboard.readText();
                        setInput(text);
                    } catch (e) {
                        alert("Không thể truy cập bộ nhớ tạm. Vui lòng dán thủ công.");
                    }
                 }}
                 className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center justify-center md:justify-start gap-1.5 transition-colors py-2 md:py-0 bg-slate-50 md:bg-transparent rounded-lg md:rounded-none"
               >
                 <Copy size={16} /> Dán từ bộ nhớ
               </button>
               <button 
                 onClick={analyzeMessage}
                 disabled={analyzing || !input}
                 className={`bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-6 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 active:scale-95 ${analyzing ? 'opacity-70' : ''}`}
               >
                 {analyzing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={20} />}
                 {analyzing ? 'Đang kiểm tra...' : 'Phân Tích Ngay'}
               </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className={`rounded-3xl p-5 md:p-6 border-2 animate-in slide-in-from-bottom duration-500 shadow-sm ${
            result === 'safe' ? 'bg-green-50 border-green-200' : 
            result === 'scam' ? 'bg-red-50 border-red-200' : 
            'bg-amber-50 border-amber-200'
          }`}>
             <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className="flex-shrink-0 self-start">
                    {result === 'safe' && <CheckCircle className="text-green-600 fill-green-100" size={32} />}
                    {result === 'scam' && <ShieldAlert className="text-red-600 fill-red-100" size={32} />}
                    {result === 'suspicious' && <Search className="text-amber-600 fill-amber-100" size={32} />}
                </div>
                
                <div>
                    <h3 className={`text-lg md:text-xl font-black uppercase tracking-wide ${
                    result === 'safe' ? 'text-green-700' : 
                    result === 'scam' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                    {result === 'safe' ? 'An Toàn' : result === 'scam' ? 'CẢNH BÁO LỪA ĐẢO' : 'Cần Cảnh Giác'}
                    </h3>
                    <p className="text-slate-700 text-sm md:text-base font-medium mt-1">
                    {explanation}
                    </p>
                </div>
             </div>
          </div>
        )}

        {/* Tips */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MessageSquareText size={18} />
                </div>
                <div>
                    <h4 className="text-slate-900 font-bold text-sm mb-0.5">Tin nhắn ngân hàng giả</h4>
                    <p className="text-xs text-slate-500">Phát hiện tin nhắn mạo danh yêu cầu mật khẩu.</p>
                </div>
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                  <ArrowRight size={18} />
                </div>
                <div>
                    <h4 className="text-slate-900 font-bold text-sm mb-0.5">Đường link lạ</h4>
                    <p className="text-xs text-slate-500">Kiểm tra các đường dẫn đáng ngờ chứa mã độc.</p>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MessageGuard;