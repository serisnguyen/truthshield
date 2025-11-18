import React, { useState, useEffect } from 'react';
import { PhoneOff, ShieldAlert, HelpCircle, AlertTriangle, Lock, BrainCircuit } from 'lucide-react';

interface AlertOverlayProps {
  onClose: () => void;
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ onClose }) => {
  const [riskScore, setRiskScore] = useState(0);
  const [challengeQuestion, setChallengeQuestion] = useState("");

  const challenges = [
    "Hỏi: 'Hôm qua nhà mình ăn món gì?'",
    "Hỏi: 'Tên con vật nuôi đầu tiên là gì?'",
    "Yêu cầu: 'Quay mặt sang trái rồi sang phải'",
    "Hỏi: 'Sinh nhật của Bà là ngày mấy?'",
    "Yêu cầu: 'Lấy tay che mặt rồi bỏ ra'",
  ];

  useEffect(() => {
    const targetScore = Math.floor(Math.random() * (99 - 88 + 1) + 88);
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(interval);
      }
      setRiskScore(current);
    }, 20);

    setChallengeQuestion(challenges[Math.floor(Math.random() * challenges.length)]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-red-600/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-[shake_0.5s_ease-in-out_infinite] border-4 border-red-500">
        
        {/* Header */}
        <div className="bg-red-600 p-6 text-center border-b border-red-700">
           <div className="flex items-center justify-center gap-3 mb-2">
             <AlertTriangle className="text-white w-10 h-10 animate-bounce" fill="currentColor" />
           </div>
           <h1 className="text-2xl font-black text-white uppercase tracking-wide">CẢNH BÁO LỪA ĐẢO!</h1>
           <p className="text-white/90 font-medium">Phát hiện dấu hiệu Deepfake</p>
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-6 bg-red-50">
           
           {/* Score */}
           <div className="space-y-2">
             <div className="flex items-center justify-center gap-2 text-red-800 font-bold uppercase text-sm tracking-wider">
                <BrainCircuit size={18} /> Độ nguy hiểm
             </div>
             <div className="text-7xl font-black text-red-600 tracking-tighter leading-none">
               {riskScore}%
             </div>
             <p className="text-slate-700 font-medium max-w-[250px] mx-auto">
               Khuôn mặt và giọng nói không khớp.
             </p>
           </div>

           {/* Challenge Box - High Contrast */}
           <div className="w-full bg-white border-2 border-blue-500 rounded-2xl p-5 text-left relative shadow-md">
              <div className="flex items-start gap-4">
                 <HelpCircle className="text-blue-600 w-8 h-8 flex-shrink-0 mt-1" />
                 <div>
                    <span className="block text-sm font-bold text-blue-700 uppercase mb-1">Câu hỏi kiểm tra</span>
                    <p className="text-slate-900 font-bold text-lg leading-snug">
                      {challengeQuestion}
                    </p>
                    <p className="text-slate-500 text-xs mt-2 italic">Nếu họ không trả lời được, hãy tắt máy ngay.</p>
                 </div>
              </div>
           </div>

           {/* Action Buttons */}
           <div className="w-full space-y-3 pt-2">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition-transform active:scale-95 group border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
              >
                 <PhoneOff size={28} className="fill-current group-hover:animate-shake" />
                 <span className="text-xl font-bold uppercase">Tắt Máy Ngay</span>
              </button>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold"
              >
                 <Lock size={18} />
                 Tôi biết người này (An toàn)
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;