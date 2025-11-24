
import React, { useState } from 'react';
import { X, Play, Shield, Smartphone, MessageSquareText, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [activeVideo, setActiveVideo] = useState(0);

  const tutorials = [
    { id: 0, title: "1. Làm quen với ứng dụng", desc: "Cách bật bảo vệ và thiết lập ban đầu.", icon: <Shield size={20} /> },
    { id: 1, title: "2. Quét tin nhắn rác", desc: "Phát hiện tin nhắn lừa đảo bằng AI.", icon: <MessageSquareText size={20} /> },
    { id: 2, title: "3. Hỏi đáp với Trợ lý", desc: "Cách chat với AI để nhận lời khuyên.", icon: <Smartphone size={20} /> },
    { id: 3, title: "4. Xử lý khi có Cảnh báo", desc: "Phải làm gì khi màn hình đỏ hiện lên?", icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in duration-300">
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
               <Play size={24} className="text-blue-600 fill-blue-600 ml-1" />
             </div>
             <div>
               <h2 className="text-slate-900 font-bold text-2xl">Hướng Dẫn Sử Dụng</h2>
               <p className="text-slate-500 text-base">Xem video để biết cách bảo vệ bản thân</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 p-3 rounded-full touch-target">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Video Player Area */}
            <div className="flex-1 bg-slate-900 p-6 flex items-center justify-center relative">
                <div className="aspect-video w-full bg-black rounded-2xl shadow-lg relative group overflow-hidden border-4 border-slate-700">
                    {/* Video Placeholder Background - Changes based on active selection */}
                    <div className={`absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-500 ${
                        activeVideo === 0 ? "bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800')]" :
                        activeVideo === 1 ? "bg-[url('https://images.unsplash.com/photo-1555421689-492a1880562a?w=800')]" :
                        activeVideo === 2 ? "bg-[url('https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800')]" :
                        "bg-[url('https://images.unsplash.com/photo-1510511459019-5dda7724fd82?w=800')]"
                    }`}></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white group-hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-white/30">
                            <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Đang xem</span>
                        <h3 className="text-xl font-bold">{tutorials[activeVideo].title}</h3>
                    </div>
                </div>
            </div>

            {/* Sidebar List */}
            <div className="w-full md:w-80 bg-white border-l border-slate-200 overflow-y-auto p-4 space-y-3">
                <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2 px-2">Danh sách bài học</h3>
                {tutorials.map((t, idx) => (
                    <button 
                        key={t.id}
                        onClick={() => setActiveVideo(idx)}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3 border-2 ${
                            activeVideo === idx 
                            ? 'bg-blue-50 border-blue-500 shadow-sm' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        <div className={`mt-1 ${activeVideo === idx ? 'text-blue-600' : 'text-slate-400'}`}>
                            {activeVideo === idx ? <Play size={20} fill="currentColor" /> : t.icon}
                        </div>
                        <div>
                            <h4 className={`font-bold text-base ${activeVideo === idx ? 'text-blue-900' : 'text-slate-700'}`}>
                                {t.title}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1 leading-tight">{t.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 text-lg touch-target"
           >
             Đã Hiểu & Bắt Đầu <ArrowRight size={24} />
           </button>
        </div>

      </div>
    </div>
  );
};

export default TutorialModal;
