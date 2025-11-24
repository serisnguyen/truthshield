
import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Power, Activity, Smartphone, Newspaper, RefreshCw, ExternalLink, Eye, Lock, AlertTriangle, Camera, VideoOff } from 'lucide-react';

interface HomeScreenProps {
  onTriggerAlert: () => void;
}

interface NewsItem {
  id: number;
  title: string;
  source: string;
  date: string;
  description: string;
  url: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTriggerAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // News State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showNews, setShowNews] = useState(false);

  // Handle Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startSurveillance = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Trình duyệt không hỗ trợ Camera");
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: true 
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }
        
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Crucial for iOS/Mobile
          videoRef.current.setAttribute('playsinline', 'true'); 
          await videoRef.current.play().catch(e => console.error("Play error", e));
        }
        setCameraActive(true);
        setIsScanning(true);
      } catch (err: any) {
        if (!isMounted) return;
        console.warn("Camera access error:", err);
        
        let errorMsg = "Không thể mở Camera.";
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg = "Bạn đã từ chối quyền Camera.";
        } else if (err.name === 'NotFoundError') {
            errorMsg = "Không tìm thấy Camera.";
        }
        
        setCameraError(errorMsg);
        setCameraActive(false);
        setIsScanning(true); // Still show scanning UI but in simulation mode
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

  const fetchNews = async () => {
    setLoadingNews(true);
    setShowNews(true);
    // Simulate an API Call
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: 1,
          title: "Cảnh báo chiêu trò lừa đảo giả danh Công an qua Video Call",
          source: "Báo Công An",
          date: "Vừa xong",
          description: "Các đối tượng sử dụng Deepfake để giả mạo khuôn mặt và giọng nói.",
          url: "https://cand.com.vn/Canh-bao/"
        },
        {
          id: 2,
          title: "Giả mạo nhân viên ngân hàng nâng hạn mức thẻ tín dụng",
          source: "VnExpress",
          date: "2 giờ trước",
          description: "Tuyệt đối không cung cấp mã OTP cho bất kỳ ai.",
          url: "https://vnexpress.net/phap-luat"
        },
      ];
      setNews(mockNews);
      setLoadingNews(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
      
      {/* --- DISCLAIMER BANNER (DEMO MODE) --- */}
      <div className="fixed top-16 left-0 right-0 md:top-0 md:left-20 lg:left-72 z-40 bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2 text-amber-900 text-xs md:text-sm font-bold shadow-sm">
        <AlertTriangle size={16} />
        <span>CHẾ ĐỘ MÔ PHỎNG: Ứng dụng Demo giáo dục.</span>
      </div>

      {/* --- REAL-TIME CAMERA BACKGROUND --- */}
      <div className="absolute inset-0 z-0 h-screen fixed">
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
                <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center p-4">
                   <VideoOff size={64} className="text-slate-400 mb-4" />
                   <div className="text-slate-500 text-xl font-bold text-center">
                      {cameraError || "CHẾ ĐỘ MÔ PHỎNG (CAMERA TẮT)"}
                   </div>
                   <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">
                      Không thể truy cập camera. Ứng dụng đang chạy bằng dữ liệu giả lập.
                   </p>
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/40 to-white/95"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white"></div>
        )}
      </div>

      {/* --- MAIN UI LAYER --- */}
      {/* Increased pt from pt-36 to pt-44 to prevent overlap with simulation banner on mobile */}
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 pt-44 md:pt-24 pb-20">
        
        {/* Top Indicators (Active State) */}
        {permissionGranted && (
          <div className="flex justify-between items-center animate-in fade-in duration-1000 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
             <div className="flex items-center gap-2 md:gap-3 text-green-700">
                <span className="relative flex h-3 w-3 md:h-4 md:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-green-600"></span>
                </span>
                <span className="text-sm md:text-base font-black uppercase tracking-wide">
                  {cameraActive ? "Đang Quét" : "Mô Phỏng"}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] md:text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">VIDEO: {cameraActive ? "OK" : "OFF"}</span>
             </div>
          </div>
        )}

        {/* CENTER INTERFACE */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {permissionGranted ? (
            /* --- STATE: ACTIVE SCANNING --- */
            <div className="flex flex-col items-center w-full max-w-md">
               
               <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8">
                 <div className="absolute inset-0 border-8 border-blue-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-blue-600 border-r-transparent border-b-blue-600 border-l-transparent rounded-full animate-[spin_4s_linear_infinite]"></div>
                 
                 <div className="text-center z-10 bg-white shadow-xl p-6 rounded-full border-4 border-blue-50 w-48 h-48 md:w-56 md:h-56 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-green-600 mx-auto mb-2" />
                    <div className="text-xl md:text-2xl font-black text-slate-800">AN TOÀN</div>
                 </div>
               </div>

               <div className="w-full bg-white shadow-lg border border-slate-200 rounded-3xl p-4 space-y-4 animate-in slide-in-from-bottom-4">
                  <button 
                    onClick={onTriggerAlert}
                    className="w-full h-16 md:h-20 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 rounded-2xl font-bold text-lg md:text-xl uppercase tracking-wide transition-all flex items-center justify-center gap-3 group shadow-sm touch-target active:scale-95"
                  >
                    <Smartphone size={28} className="group-hover:animate-shake text-red-600" />
                    Giả Lập Cảnh Báo
                  </button>
               </div>

               <button 
                 onClick={() => setPermissionGranted(false)}
                 className="mt-6 px-6 py-3 bg-white border-2 border-slate-300 text-slate-600 rounded-full text-base font-bold hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2 transition-colors shadow-sm"
               >
                 <Power size={20} /> Tắt bảo vệ
               </button>
            </div>

          ) : (
            /* --- STATE: INACTIVE / GRANT PERMISSION --- */
            <div className="w-full max-w-md text-center space-y-8 px-2 animate-in zoom-in duration-500">
              
              <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 flex items-center justify-center group cursor-pointer" onClick={() => setPermissionGranted(true)}>
                 <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl group-hover:bg-blue-200 transition-all duration-500 opacity-70"></div>
                 <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-white border-8 border-slate-100 flex items-center justify-center shadow-2xl group-hover:border-blue-200 transition-all duration-300 group-hover:scale-105 active:scale-95">
                    <Power className="w-20 h-20 md:w-24 md:h-24 text-slate-300 group-hover:text-blue-600 transition-colors duration-300" strokeWidth={3} />
                 </div>
                 <div className="absolute -bottom-4 bg-blue-600 text-white text-base md:text-lg font-bold px-6 py-2 rounded-full shadow-lg animate-bounce">
                   BẤM ĐỂ BẬT
                 </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800">Kích Hoạt Bảo Vệ</h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium px-4">
                  Bấm nút trên để bật "Khiên Xanh" bảo vệ gia đình.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <Lock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm md:text-base text-slate-900 font-bold">Riêng Tư</div>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm md:text-base text-slate-900 font-bold">Tức Thì</div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* --- NEWS SECTION --- */}
        <div className="w-full max-w-md mx-auto mt-10">
          {!showNews ? (
            <button 
              onClick={fetchNews}
              className="w-full h-14 bg-white hover:bg-blue-50 border border-slate-200 text-blue-700 rounded-2xl font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Newspaper size={20} />
              Xem tin tức lừa đảo
            </button>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Newspaper size={20} className="text-blue-600" /> 
                  Tin Tức
                </h3>
                <button 
                  onClick={fetchNews}
                  className="p-2 hover:bg-white rounded-full transition-colors" 
                  disabled={loadingNews}
                >
                  <RefreshCw size={18} className={`text-slate-600 ${loadingNews ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {loadingNews ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  news.map((item) => (
                    <div key={item.id} className="group pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">{item.source}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.date}</span>
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block font-bold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors leading-snug"
                      >
                        {item.title}
                        <ExternalLink size={14} className="inline-block ml-1 text-slate-400" />
                      </a>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomeScreen;
