import React, { useEffect, useRef, useState } from 'react';
import { Shield, Power, ShieldCheck, Lock, Eye, Activity, Smartphone } from 'lucide-react';

interface HomeScreenProps {
  onTriggerAlert: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTriggerAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Handle Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startSurveillance = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("MediaDevices interface not available");
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: true 
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }
        
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setIsScanning(true);
      } catch (err) {
        if (!isMounted) return;
        console.warn("Access denied or camera unavailable. Switching to simulation mode.", err);
        setCameraActive(false);
        setIsScanning(true);
      }
    };

    if (permissionGranted) {
      startSurveillance();
    } else {
      setIsScanning(false);
      setCameraActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [permissionGranted]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#F8FAFC]">
      
      {/* --- REAL-TIME CAMERA BACKGROUND --- */}
      {/* We keep the background dark ONLY when camera is active for visibility, but UI is light */}
      <div className="absolute inset-0 z-0">
        {isScanning ? (
          <>
             {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
             ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                   <div className="text-slate-300 text-4xl md:text-6xl font-black tracking-tighter animate-pulse select-none">
                      MÔ PHỎNG
                   </div>
                </div>
             )}
             {/* Overlay Gradient for text readability */}
             <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/90"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white"></div>
        )}
      </div>

      {/* --- MAIN UI LAYER --- */}
      <div className="relative z-10 flex-1 flex flex-col p-6 pt-20 md:pt-6">
        
        {/* Top Indicators (Active State) */}
        {permissionGranted && (
          <div className="flex justify-between items-start animate-in fade-in duration-1000 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-green-600">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold uppercase">
                  {cameraActive ? "Đang Quét Trực Tiếp" : "Chế Độ Mô Phỏng"}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-600">ÂM THANH: {cameraActive ? "ĐANG NGHE..." : "GIẢ LẬP"}</span>
                <span className="text-xs font-bold text-slate-600">VIDEO: {cameraActive ? "ĐANG PHÂN TÍCH..." : "GIẢ LẬP"}</span>
             </div>
          </div>
        )}

        {/* CENTER INTERFACE */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {permissionGranted ? (
            /* --- STATE: ACTIVE SCANNING --- */
            <div className="flex flex-col items-center w-full max-w-md">
               
               {/* Scanner Ring Animation - Clean Look */}
               <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                 <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-[spin_4s_linear_infinite]"></div>
                 <div className="absolute inset-0 rounded-full border-2 border-blue-200 scale-110 animate-pulse"></div>
                 
                 {/* Center Content */}
                 <div className="text-center z-10 bg-white shadow-lg p-8 rounded-full border border-blue-100">
                    <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">AN TOÀN</div>
                    <div className="text-xs font-bold text-slate-400">CHƯA PHÁT HIỆN LỪA ĐẢO</div>
                 </div>
               </div>

               {/* Action Panel */}
               <div className="w-full bg-white shadow-xl border border-slate-200 rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between text-sm text-slate-600 border-b border-slate-100 pb-4">
                    <span className="flex items-center gap-2 font-medium"><Activity size={18} className="text-blue-500" /> Trạng thái hệ thống</span>
                    <span className="text-green-600 font-bold">TỐT</span>
                  </div>
                  
                  <button 
                    onClick={onTriggerAlert}
                    className="w-full py-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 rounded-xl font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 group shadow-sm"
                  >
                    <Smartphone size={20} className="group-hover:animate-shake" />
                    Thử Nghiệm Cảnh Báo
                  </button>
               </div>

               {/* Stop Button */}
               <button 
                 onClick={() => setPermissionGranted(false)}
                 className="mt-6 px-6 py-2 bg-white border border-slate-300 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors shadow-sm"
               >
                 <Power size={16} /> Tắt bảo vệ
               </button>
            </div>

          ) : (
            /* --- STATE: INACTIVE / GRANT PERMISSION --- */
            <div className="w-full max-w-md text-center space-y-8 px-4 animate-in zoom-in duration-500">
              
              <div className="relative mx-auto w-48 h-48 flex items-center justify-center group cursor-pointer" onClick={() => setPermissionGranted(true)}>
                 <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl group-hover:bg-blue-200 transition-all duration-500 opacity-70"></div>
                 <div className="relative w-40 h-40 rounded-full bg-white border-8 border-slate-100 flex items-center justify-center shadow-xl group-hover:border-blue-100 transition-all duration-300 group-hover:scale-105">
                    <Power className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" strokeWidth={2.5} />
                 </div>
                 <div className="absolute bottom-0 translate-y-10 text-base font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
                   BẤM ĐỂ BẬT
                 </div>
              </div>

              <div className="space-y-4 pt-6">
                <h2 className="text-3xl font-extrabold text-slate-800">Kích Hoạt Bảo Vệ</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Cho phép ứng dụng sử dụng <span className="font-bold text-slate-900">Micro & Camera</span> để tự động phát hiện lừa đảo khi có cuộc gọi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <Lock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-sm text-slate-900 font-bold">Bảo Mật 100%</div>
                    <div className="text-xs text-slate-500 mt-1">Chỉ phân tích trên máy bạn</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm text-slate-900 font-bold">Tức Thì</div>
                    <div className="text-xs text-slate-500 mt-1">Phát hiện ngay lập tức</div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;