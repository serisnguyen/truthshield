
import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Power, Smartphone, Newspaper, RefreshCw, ExternalLink, Eye, Lock, AlertOctagon, Phone, User, Activity, AlertTriangle, Mic, BookOpen, MessageSquareText, Wifi, WifiOff, X, Battery, MapPin, Scan, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoiceSetupModal from './VoiceSetupModal';
import { Tab } from '../App';

interface HomeScreenProps {
  onTriggerAlert: () => void;
  onNavigate?: (tab: Tab) => void;
}

const MOCK_DEVICES = [
  { 
    id: 1, 
    name: "Điện thoại của Ba", 
    owner: "Ba", 
    avatar: "👴",
    status: "safe", 
    battery: 84, 
    lastActive: "Đang hoạt động", 
    lastScan: "10 phút trước",
    issues: 0
  },
  { 
    id: 2, 
    name: "Điện thoại của Mẹ", 
    owner: "Mẹ", 
    avatar: "👵",
    status: "warning", 
    battery: 45, 
    lastActive: "Mất kết nối 2 giờ trước", 
    lastScan: "Hôm qua",
    issues: 1
  }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onTriggerAlert, onNavigate }) => {
  const { role, user, setIncomingSOS, isOnline } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<typeof MOCK_DEVICES[0] | null>(null);
  
  // Action States for Guardian Dashboard
  const [isScanningAction, setIsScanningAction] = useState(false);
  const [isLocatingAction, setIsLocatingAction] = useState(false);
  
  // Result Modals
  const [resultModal, setResultModal] = useState<{
      type: 'scan' | 'locate';
      data: any;
  } | null>(null);

  // Reset actions when modal closes
  useEffect(() => {
    if (!selectedDevice) {
        setIsScanningAction(false);
        setIsLocatingAction(false);
        setResultModal(null);
    }
  }, [selectedDevice]);

  // Handle Camera Stream (Only logic for Elder/Demo)
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
          videoRef.current.setAttribute('playsinline', 'true'); 
          await videoRef.current.play().catch(e => console.error("Play error", e));
        }
        setCameraActive(true);
        setIsScanning(true);
      } catch (err: any) {
        if (!isMounted) return;
        setCameraError("Không thể mở Camera.");
        setCameraActive(false);
        setIsScanning(false); // ✅ FIX: Set scanning to false on error to update UI correctly
      }
    };

    if (permissionGranted) {
      startSurveillance();
    } else {
      setIsScanning(false);
      setCameraActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [permissionGranted]);

  const handleScanDevice = () => {
    setIsScanningAction(true);
    setTimeout(() => {
      setIsScanningAction(false);
      setResultModal({
          type: 'scan',
          data: {
              deviceName: selectedDevice?.name,
              safe: true
          }
      });
    }, 2500);
  };

  const handleLocateDevice = () => {
    setIsLocatingAction(true);
    
    // Use Real GPS if available (simulating proximity or just for demo)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocatingAction(false);
                setResultModal({
                    type: 'locate',
                    data: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        address: `Vị trí GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                    }
                });
            },
            (error) => {
                // Fallback / Mock
                console.warn("GPS Error", error);
                setIsLocatingAction(false);
                setResultModal({
                    type: 'locate',
                    data: {
                        lat: 10.762622,
                        lng: 106.660172,
                        address: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM (Mô phỏng)"
                    }
                });
            }
        );
    } else {
        setIsLocatingAction(false);
        setResultModal({
            type: 'locate',
            data: {
                lat: 10.762622,
                lng: 106.660172,
                address: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM (Mô phỏng)"
            }
        });
    }
  };

  // --- UI FOR ELDER (SENIOR MODE) ---
  if (role === 'elder') {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-4 pt-6 pb-32 animate-in fade-in duration-500">
            {/* Greeting & Status */}
            <div className="mb-6 px-2 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Chào {user ? user.name : "Bác/Cô/Chú"},</h1>
                    <p className="text-xl text-slate-600 font-medium">Bác cần giúp gì hôm nay?</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                    {isOnline ? 'Online' : 'Offline'}
                </div>
            </div>

            {/* SECURITY QUESTION REMINDER */}
             {(!user?.securityQuestions || user.securityQuestions.length === 0) && (
              <div 
                onClick={() => onNavigate && onNavigate('profile')}
                className="bg-white border-4 border-amber-400 p-6 rounded-3xl mb-4 shadow-md flex items-center gap-4 cursor-pointer active:scale-95 transition-transform group"
              >
                 <div className="bg-amber-100 p-4 rounded-full text-amber-600 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    <Lock size={32} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-xl uppercase">Cài Câu Hỏi Bí Mật</h3>
                    <p className="text-slate-600 text-lg font-medium leading-tight mt-1">Để kiểm tra người lạ khi họ gọi đến.</p>
                 </div>
                 <ExternalLink size={24} className="text-amber-400" />
              </div>
            )}

            {/* REMINDER BANNER - VOICE DNA */}
            {!user?.hasVoiceProfile && (
              <div 
                onClick={() => setShowVoiceModal(true)}
                className="bg-white border-4 border-purple-500 p-6 rounded-3xl mb-8 shadow-md flex items-center gap-4 cursor-pointer active:scale-95 transition-transform group"
              >
                 <div className="bg-purple-100 p-4 rounded-full text-purple-600 border-2 border-purple-200 group-hover:scale-110 transition-transform">
                    <Mic size={32} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-xl uppercase">Đăng ký Giọng Nói</h3>
                    <p className="text-slate-600 text-lg font-medium leading-tight mt-1">Để máy nhận ra giọng bác, tránh bị giả mạo.</p>
                 </div>
                 <ExternalLink size={24} className="text-purple-400" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 flex-1">
                {/* 1. EMERGENCY BUTTON (SOS) */}
                <button 
                   onClick={onTriggerAlert}
                   className="w-full bg-red-600 hover:bg-red-700 text-white rounded-3xl p-8 shadow-xl shadow-red-200 active:scale-95 transition-transform flex items-center justify-between border-b-8 border-r-4 border-red-900 active:border-0 active:translate-y-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                    <div className="flex flex-col items-start z-10">
                        <span className="text-4xl font-black uppercase tracking-wider mb-2 drop-shadow-md">SOS KHẨN CẤP</span>
                        <span className="text-xl opacity-100 font-bold bg-red-800/50 px-3 py-1 rounded-lg">Bấm khi gặp nguy hiểm</span>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm z-10 border-2 border-white/40">
                        <AlertOctagon size={48} className="animate-pulse" strokeWidth={3} />
                    </div>
                </button>

                {/* 2. CHECK MESSAGE (NEW) */}
                <button 
                   onClick={() => onNavigate && onNavigate('message')}
                   className="w-full bg-white hover:bg-pink-50 text-slate-900 rounded-3xl p-8 shadow-xl border-4 border-b-8 border-pink-300 active:border-b-4 active:scale-95 transition-transform flex items-center justify-between"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-3xl font-black uppercase tracking-wider mb-2">KIỂM TRA TIN NHẮN</span>
                        <span className="text-xl text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg">Copy tin nhắn dán vào đây</span>
                    </div>
                    <div className="bg-pink-100 p-4 rounded-full border-2 border-pink-200">
                        <MessageSquareText size={48} strokeWidth={3} className="text-pink-600" />
                    </div>
                </button>

                {/* 3. SCANNER TOGGLE */}
                <button 
                   onClick={() => setPermissionGranted(!permissionGranted)}
                   className={`w-full rounded-3xl p-8 shadow-xl active:scale-95 transition-transform flex items-center justify-between border-b-8 border-r-4 active:border-0 active:translate-y-2 ${
                       permissionGranted 
                       ? 'bg-green-600 border-green-900 text-white' 
                       : 'bg-white border-slate-300 text-slate-800'
                   }`}
                >
                    <div className="flex flex-col items-start">
                        <span className="text-3xl font-black uppercase tracking-wider mb-2">
                            {permissionGranted ? "ĐANG BẢO VỆ" : "BẬT BẢO VỆ"}
                        </span>
                        <span className={`text-xl font-bold px-3 py-1 rounded-lg ${permissionGranted ? 'bg-green-700/50 opacity-100' : 'bg-slate-100 text-slate-500'}`}>
                            {permissionGranted ? "Máy đang canh chừng" : "Bấm để bắt đầu"}
                        </span>
                    </div>
                    <div className={`p-4 rounded-full border-2 ${permissionGranted ? 'bg-white/20 border-white/40' : 'bg-slate-100 border-slate-200'}`}>
                        <ShieldCheck size={48} strokeWidth={3} className={permissionGranted ? "text-white" : "text-slate-400"} />
                    </div>
                </button>

                {/* 4. CALL FAMILY */}
                <a 
                   href={user?.emergencyContacts[0] ? `tel:${user.emergencyContacts[0].phone}` : '#'}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-8 shadow-xl shadow-blue-200 active:scale-95 transition-transform flex items-center justify-between border-b-8 border-r-4 border-blue-900 active:border-0 active:translate-y-2"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-3xl font-black uppercase tracking-wider mb-2">GỌI CON CÁI</span>
                        <span className="text-xl opacity-100 font-bold bg-blue-800/50 px-3 py-1 rounded-lg">
                            {user?.emergencyContacts[0] ? `Gọi ${user.emergencyContacts[0].name}` : "Chưa lưu số"}
                        </span>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full border-2 border-white/40">
                        <Phone size={48} strokeWidth={3} />
                    </div>
                </a>

                 {/* 5. LIBRARY LINK */}
                 <button 
                   onClick={() => onNavigate && onNavigate('library')}
                   className="w-full bg-white hover:bg-yellow-50 text-slate-900 rounded-3xl p-8 shadow-xl border-4 border-b-8 border-slate-300 active:border-b-4 active:scale-95 transition-transform flex items-center justify-between"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-3xl font-black uppercase tracking-wider mb-2">XEM CẢNH BÁO</span>
                        <span className="text-xl text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg">Các thủ đoạn mới</span>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-full border-2 border-yellow-200">
                        <BookOpen size={48} strokeWidth={3} className="text-yellow-600" />
                    </div>
                </button>
            </div>

            {/* Hidden Camera Logic for functionality */}
            {permissionGranted && (
                 <div className="fixed bottom-32 right-4 w-32 h-48 bg-black rounded-xl border-4 border-white shadow-2xl overflow-hidden z-40 opacity-80 pointer-events-none">
                     <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale" />
                    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs py-1 text-center font-bold uppercase tracking-wider animate-pulse">ĐANG QUÉT</div>
                 </div>
            )}
            
            {showVoiceModal && (
                <VoiceSetupModal 
                    onClose={() => setShowVoiceModal(false)} 
                    initialTab="self" 
                />
            )}
        </div>
    );
  }

  // --- UI FOR RELATIVE (DASHBOARD) ---
  return (
    <div className="p-4 pt-24 md:pt-10 pb-20 max-w-5xl mx-auto animate-in fade-in duration-500">
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Trung Tâm Chỉ Huy</h1>
            <p className="text-slate-500">Giám sát trạng thái an ninh của người thân.</p>
          </div>
          <button onClick={() => setIncomingSOS(true)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-2">
             <AlertOctagon size={16} /> Giả lập nhận SOS
          </button>
       </div>

       {/* Status Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-green-200 rounded-lg text-green-700"><ShieldCheck size={24} /></div>
                   <h3 className="font-bold text-slate-700">Thiết bị An toàn</h3>
               </div>
               <p className="text-3xl font-black text-slate-900">2<span className="text-lg text-slate-400 font-medium ml-1">/ 2</span></p>
           </div>
           
           <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-blue-200 rounded-lg text-blue-700"><Activity size={24} /></div>
                   <h3 className="font-bold text-slate-700">Đã Quét Hôm Nay</h3>
               </div>
               <p className="text-3xl font-black text-slate-900">14<span className="text-lg text-slate-400 font-medium ml-1"> cuộc gọi</span></p>
           </div>

           <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><User size={24} /></div>
                   <h3 className="font-bold text-slate-700">Người Thân</h3>
               </div>
               <div className="flex -space-x-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold">B</div>
                   <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold">M</div>
                   <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-400">+</div>
               </div>
           </div>
       </div>

       {/* Device List */}
       <h2 className="text-xl font-bold text-slate-900 mb-4">Danh Sách Thiết Bị</h2>
       <div className="grid gap-4">
            {MOCK_DEVICES.map(dev => (
                <div 
                    key={dev.id} 
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
                    onClick={() => setSelectedDevice(dev)}
                >
                    {dev.status === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>}
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">{dev.avatar}</div>
                        <div>
                            <h3 className="font-bold text-slate-900">{dev.name}</h3>
                            <p className={`text-sm flex items-center gap-1 font-bold ${dev.status === 'safe' ? 'text-green-600' : 'text-amber-600'}`}>
                                {dev.status === 'safe' ? (
                                    <><span className="w-2 h-2 bg-green-500 rounded-full"></span> {dev.lastActive} • Pin {dev.battery}%</>
                                ) : (
                                    <><AlertTriangle size={14} /> {dev.lastActive}</>
                                )}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedDevice(dev); }}
                        className={`text-sm px-4 py-2 rounded-lg font-bold transition-colors border ${
                        dev.status === 'safe' 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent' 
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                        }`}
                    >
                        {dev.status === 'safe' ? 'Chi tiết' : 'Kiểm tra'}
                    </button>
                </div>
            ))}
       </div>

       {/* Device Detail Modal */}
       {selectedDevice && (
            <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-lg text-slate-900">Chi tiết thiết bị</h3>
                        <button onClick={() => setSelectedDevice(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm"><X size={20}/></button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 overflow-y-auto">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
                                {selectedDevice.avatar}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{selectedDevice.name}</h2>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold mt-1 ${
                                    selectedDevice.status === 'safe' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {selectedDevice.status === 'safe' ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                                    {selectedDevice.status === 'safe' ? 'An toàn' : 'Cần chú ý'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Battery size={12} /> Pin</div>
                                <div className="text-2xl font-black text-slate-800">{selectedDevice.battery}%</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Activity size={12} /> Hoạt động</div>
                                <div className="text-sm font-bold text-slate-800 leading-tight">{selectedDevice.lastActive}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={handleScanDevice}
                                disabled={isScanningAction || isLocatingAction}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isScanningAction ? <Loader2 size={20} className="animate-spin" /> : <Scan size={20} />} 
                                {isScanningAction ? "Đang Quét Hệ Thống..." : "Quét An Ninh Ngay"}
                            </button>
                            <button 
                                onClick={handleLocateDevice}
                                disabled={isScanningAction || isLocatingAction}
                                className="w-full py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLocatingAction ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />} 
                                {isLocatingAction ? "Đang Lấy Vị Trí..." : "Định Vị Thiết Bị"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
       )}

       {/* Result Modals */}
       {resultModal?.type === 'scan' && (
            <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50 shadow-sm">
                        <ShieldCheck size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-black text-center text-slate-900 mb-2">Thiết bị An Toàn</h3>
                    <p className="text-center text-slate-500 mb-6">Đã quét toàn bộ hệ thống của {resultModal.data.deviceName}. Không phát hiện mối nguy hại nào.</p>
                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-600 flex items-center gap-2"><Scan size={14}/> Ứng dụng độc hại</span>
                            <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> 0</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-600 flex items-center gap-2"><Wifi size={14}/> Mạng kết nối</span>
                            <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> An toàn</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-slate-600 flex items-center gap-2"><Phone size={14}/> Cuộc gọi lừa đảo</span>
                            <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14}/> 0</span>
                        </div>
                    </div>
                    <button onClick={() => setResultModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors">Đóng</button>
                </div>
            </div>
        )}

        {resultModal?.type === 'locate' && (
            <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-50 shadow-sm">
                        <MapPin size={32} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black text-center text-slate-900 mb-2">Đã Tìm Thấy Thiết Bị</h3>
                    <p className="text-center text-slate-500 mb-6 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 break-words">
                        {resultModal.data.address}
                    </p>
                    
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${resultModal.data.lat},${resultModal.data.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 mb-3 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <MapPin size={18} /> Mở Google Maps
                    </a>
                    <button onClick={() => setResultModal(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors">Đóng</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default HomeScreen;
