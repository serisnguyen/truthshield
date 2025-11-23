
import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Power, Activity, Smartphone, Newspaper, RefreshCw, ExternalLink, Eye, Lock, AlertTriangle } from 'lucide-react';

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

  // News State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [showNews, setShowNews] = useState(false);

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
          description: "Các đối tượng sử dụng Deepfake để giả mạo khuôn mặt và giọng nói của cán bộ công an nhằm yêu cầu chuyển tiền.",
          url: "https://cand.com.vn/Canh-bao/canh-bao-thu-doan-lua-dao-gia-danh-cong-an-goi-video-call-i693245/"
        },
        {
          id: 2,
          title: "Thủ đoạn mới: Giả mạo nhân viên ngân hàng nâng hạn mức thẻ tín dụng",
          source: "VnExpress",
          date: "2 giờ trước",
          description: "Tuyệt đối không cung cấp mã OTP cho bất kỳ ai tự xưng là nhân viên ngân hàng.",
          url: "https://vnexpress.net/thu-doan-gia-mao-nhan-vien-ngan-hang-nang-han-muc-the-tin-dung-4740588.html"
        },
        {
          id: 3,
          title: "Lừa đảo 'Con đang cấp cứu' tái xuất hiện tại TP.HCM",
          source: "Tuổi Trẻ",
          date: "Hôm nay",
          description: "Các phụ huynh cần bình tĩnh và xác minh thông tin trực tiếp với nhà trường hoặc bệnh viện.",
          url: "https://tuoitre.vn/canh-bao-lua-dao-con-dang-cap-cuu-tai-xuat-hien-20240312112545678.htm"
        }
      ];
      setNews(mockNews);
      setLoadingNews(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
      
      {/* --- DISCLAIMER BANNER (DEMO MODE) --- */}
      <div className="fixed top-16 left-0 right-0 md:top-0 md:left-20 lg:left-72 z-40 bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2 text-amber-800 text-xs font-bold shadow-sm">
        <AlertTriangle size={14} />
        <span>CHẾ ĐỘ MÔ PHỎNG: Đây là bản Demo giáo dục. Các tính năng AI Detection hiện tại là giả lập.</span>
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
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                   <div className="text-slate-300 text-4xl md:text-6xl font-black tracking-tighter animate-pulse select-none">
                      MÔ PHỎNG
                   </div>
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/90"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white"></div>
        )}
      </div>

      {/* --- MAIN UI LAYER --- */}
      <div className="relative z-10 flex-1 flex flex-col p-6 pt-28 md:pt-14">
        
        {/* Top Indicators (Active State) */}
        {permissionGranted && (
          <div className="flex justify-between items-start animate-in fade-in duration-1000 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
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
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
          
          {permissionGranted ? (
            /* --- STATE: ACTIVE SCANNING --- */
            <div className="flex flex-col items-center w-full max-w-md">
               
               <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                 <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-[spin_10s_linear_infinite]"></div>
                 <div className="absolute inset-4 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-[spin_4s_linear_infinite]"></div>
                 <div className="absolute inset-0 rounded-full border-2 border-blue-200 scale-110 animate-pulse"></div>
                 
                 <div className="text-center z-10 bg-white shadow-lg p-8 rounded-full border border-blue-100">
                    <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-slate-800">AN TOÀN</div>
                    <div className="text-xs font-bold text-slate-400">CHƯA PHÁT HIỆN LỪA ĐẢO</div>
                 </div>
               </div>

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

        {/* --- NEWS SECTION --- */}
        <div className="w-full max-w-md mx-auto mt-12 mb-20">
          {!showNews ? (
            <button 
              onClick={fetchNews}
              className="w-full py-4 bg-white hover:bg-blue-50 border border-slate-200 text-blue-700 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Newspaper size={20} />
              Cập nhật tin tức lừa đảo mới nhất
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper size={18} className="text-blue-600" /> 
                  Tin Tức Cảnh Báo
                </h3>
                <button 
                  onClick={fetchNews}
                  className="p-2 hover:bg-white rounded-full transition-colors" 
                  disabled={loadingNews}
                >
                  <RefreshCw size={16} className={`text-slate-500 ${loadingNews ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {loadingNews ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  news.map((item) => (
                    <div key={item.id} className="group pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.source}</span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors flex items-start gap-1 cursor-pointer hover:underline"
                      >
                        {item.title}
                        <ExternalLink size={14} className="flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-blue-500" />
                      </a>
                      <p className="text-xs text-slate-500 leading-relaxed">
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
