
import React, { useState, useEffect } from 'react';
import { X, Mic, CheckCircle, Smartphone, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VoiceSetupModalProps {
  onClose: () => void;
}

const VoiceSetupModal: React.FC<VoiceSetupModalProps> = ({ onClose }) => {
  const { setVoiceProfileStatus } = useAuth();
  const [step, setStep] = useState<'intro' | 'recording' | 'processing' | 'finished'>('intro');
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const RECORDING_DURATION = 30; // 30 seconds for realistic data collection

  const prompts = [
    "Tôi xác nhận đây là giọng nói thật của tôi.",
    "TruthShield AI giúp bảo vệ gia đình tôi khỏi lừa đảo.",
    "Mật khẩu an toàn của tôi là 8829.",
    "Hãy gọi cho con trai tôi nếu có khẩn cấp.",
    "Tôi đồng ý sử dụng Voice DNA để xác thực cuộc gọi.",
    "Hôm nay trời đẹp, tôi đang ở nhà an toàn.",
    "Vui lòng không chuyển tiền nếu chưa xác minh."
  ];

  useEffect(() => {
    let interval: any;
    if (step === 'recording') {
        interval = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= RECORDING_DURATION) { 
                    clearInterval(interval);
                    setStep('processing');
                    return RECORDING_DURATION;
                }
                // Change prompt every 4 seconds
                if (prev % 4 === 0 && prev > 0) {
                    setCurrentPromptIndex(i => (i + 1) % prompts.length);
                }
                return prev + 1;
            });
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
      if (step === 'processing') {
          const timeout = setTimeout(() => {
              setVoiceProfileStatus(true);
              setStep('finished');
          }, 3000); // 3 seconds processing simulation
          return () => clearTimeout(timeout);
      }
  }, [step, setVoiceProfileStatus]);

  const startRecording = () => {
    setStep('recording');
    setRecordingTime(0);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 z-10">
           <X size={24} />
        </button>

        {step === 'intro' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Mic className="text-purple-600" size={32} />
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping opacity-20"></div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thiết lập Voice DNA</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Hệ thống cần ghi âm giọng nói của bạn trong <strong>30 giây</strong> để tạo "chữ ký sinh trắc học" hoàn chỉnh. Dữ liệu càng chi tiết, khả năng phát hiện Deepfake càng chính xác.
                </p>
                <button 
                    onClick={startRecording}
                    className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Mic size={20} /> Bắt đầu ghi âm
                </button>
            </div>
        )}

        {step === 'recording' && (
            <div className="animate-in fade-in duration-300">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse mb-4">
                        ● ĐANG GHI ÂM
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 transition-all min-h-[60px]">
                        "{prompts[currentPromptIndex]}"
                    </h3>
                    
                    {/* Visual Sound Wave */}
                    <div className="flex items-center justify-center gap-1 h-16 mb-4">
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-1.5 bg-purple-500 rounded-full animate-[bounce_1s_infinite]"
                                style={{ 
                                    height: `${Math.random() * 100}%`,
                                    animationDelay: `${i * 0.1}s` 
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                        className="bg-purple-600 h-full transition-all duration-1000 ease-linear" 
                        style={{ width: `${(recordingTime / RECORDING_DURATION) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}</span>
                    <span>00:{RECORDING_DURATION}</span>
                </div>
            </div>
        )}

        {step === 'processing' && (
            <div className="animate-in fade-in duration-300">
                <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <Activity className="text-purple-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Đang mã hóa giọng nói...</h2>
                <p className="text-slate-500 text-sm">
                    Tạo mã hóa sinh trắc học cục bộ. Dữ liệu này sẽ không được gửi lên máy chủ.
                </p>
            </div>
        )}

        {step === 'finished' && (
            <div className="animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle className="text-green-600" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Thành Công!</h2>
                <p className="text-slate-500 mb-8">
                    Voice DNA đã được thiết lập. Ứng dụng bây giờ có thể nhận diện giọng nói thật của bạn để bảo vệ gia đình.
                </p>
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
                >
                    Hoàn tất & Đóng
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default VoiceSetupModal;
