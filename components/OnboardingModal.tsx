import React, { useState } from 'react';
import { Shield, Mic, Zap, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Shield size={64} className="text-blue-600" />,
      title: "Bảo vệ gia đình",
      desc: "TruthShield AI sử dụng công nghệ lõi 3 lớp để phát hiện deepfake video call ngay lập tức."
    },
    {
      icon: <Mic size={64} className="text-purple-600" />,
      title: "Voice DNA",
      desc: "Chỉ cần 30 giây ghi âm, AI sẽ học và nhận diện giọng nói người thân của bạn với độ chính xác 99.5%."
    },
    {
      icon: <Zap size={64} className="text-yellow-500" />,
      title: "Cảnh báo Real-time",
      desc: "Nhận cảnh báo ngay lập tức khi phát hiện dấu hiệu lừa đảo. Con cái có thể can thiệp từ xa."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-50 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 h-64 flex flex-col items-center justify-center">
          <div className="mb-6 bg-slate-50 p-6 rounded-full animate-in zoom-in duration-300">
            {steps[step].icon}
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">{steps[step].title}</h2>
          <p className="text-slate-500 leading-relaxed text-sm">{steps[step].desc}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8 mt-4">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
              }`} 
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          {step === steps.length - 1 ? (
            <>Bắt đầu ngay <CheckCircle size={18} /></>
          ) : 'Tiếp theo'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;