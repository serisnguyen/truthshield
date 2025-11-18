import React from 'react';
import { X, Play, Shield, Smartphone, Fingerprint, ArrowRight } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in duration-300">
      
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
               <Play size={20} className="text-blue-600 fill-blue-600 ml-1" />
             </div>
             <div>
               <h2 className="text-slate-900 font-bold text-xl">Hướng Dẫn Sử Dụng</h2>
               <p className="text-slate-500 text-sm">Cách bảo vệ bản thân khỏi lừa đảo</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 p-2 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* Fake Video Player */}
          <div className="aspect-video w-full bg-slate-900 rounded-2xl shadow-lg relative group overflow-hidden mb-8 cursor-pointer border-4 border-white">
             {/* Video Placeholder Background */}
             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.4),rgba(0,0,0,0.1)),url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-80"></div>
             
             {/* Play Button */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                   <Play size={32} className="text-blue-600 fill-blue-600 ml-1" />
                </div>
             </div>

             {/* Video UI Elements */}
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                   <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block shadow-sm">Video Mẫu</span>
                   <h3 className="text-white font-bold text-lg drop-shadow-md">Cách phát hiện Deepfake</h3>
                </div>
                <span className="text-white font-mono bg-black/50 px-2 py-1 rounded text-xs backdrop-blur-md">02:15</span>
             </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
             <h3 className="text-slate-800 font-bold text-xl border-l-4 border-blue-600 pl-3">3 Bước Đơn Giản</h3>
             
             <div className="grid gap-4 md:grid-cols-3">
                {/* Step 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Smartphone className="text-blue-600" size={24} />
                   </div>
                   <h4 className="text-slate-900 font-bold mb-2 text-lg">1. Bật Bảo Vệ</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      Nhấn nút nguồn lớn ở trang chủ để cấp quyền cho ứng dụng hoạt động.
                   </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Fingerprint className="text-purple-600" size={24} />
                   </div>
                   <h4 className="text-slate-900 font-bold mb-2 text-lg">2. AI Tự Quét</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      Khi có người gọi video, AI sẽ tự động xem xét khuôn mặt và giọng nói.
                   </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                   <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <Shield className="text-red-600" size={24} />
                   </div>
                   <h4 className="text-slate-900 font-bold mb-2 text-lg">3. Cảnh Báo</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      Nếu màn hình đỏ hiện lên, hãy hỏi câu hỏi kiểm tra hoặc tắt máy ngay.
                   </p>
                </div>
             </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-200"
           >
             Đã Hiểu <ArrowRight size={20} />
           </button>
        </div>

      </div>
    </div>
  );
};

export default TutorialModal;