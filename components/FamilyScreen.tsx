
import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldCheck, Wifi, UserPlus, Link, CheckCircle2, Copy, Trash2, PhoneOff, RefreshCw, AlertOctagon, Clock, Loader2, WifiOff, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FamilyMember {
  id: string;
  name: string;
  status: 'safe' | 'pending' | 'disconnected';
  device: string;
  connection: string;
  risk: string;
}

const FamilyScreen: React.FC = () => {
  const { user, addEmergencyContact, removeEmergencyContact, regenerateFamilyId } = useAuth();
  
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  
  // Family Code Timer Logic
  const CODE_DURATION = 300; // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(CODE_DURATION);
  const [progress, setProgress] = useState(100);

  // Remote Disconnect Modal State
  const [disconnectTarget, setDisconnectTarget] = useState<FamilyMember | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectSuccess, setDisconnectSuccess] = useState(false);

  // Simulated Family Data State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: user ? user.name + ' (Tôi)' : 'Tôi', status: 'safe', device: 'iPhone 14', connection: 'Đang online', risk: 'None' },
    { id: '2', name: 'Vợ/Chồng', status: 'safe', device: 'Samsung S24', connection: '5 phút trước', risk: 'None' },
    { id: '3', name: 'Con', status: 'pending', device: 'Chưa kích hoạt', connection: '--', risk: '--' },
  ]);

  useEffect(() => {
    if (!user?.familyCodeTimestamp) return;

    const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - user.familyCodeTimestamp!) / 1000);
        const remaining = Math.max(0, CODE_DURATION - elapsed);
        
        setTimeLeft(remaining);
        setProgress((remaining / CODE_DURATION) * 100);

        // Auto regenerate when expired
        if (remaining === 0) {
            regenerateFamilyId();
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.familyCodeTimestamp, regenerateFamilyId]);

  const handleCopy = async () => {
    try {
      const idToCopy = user ? user.familyId : "FAMILY-INVALID";
      await navigator.clipboard.writeText(idToCopy);
      // Optional: Add a small toast here if needed
    } catch (err) {
      console.warn("Clipboard write failed", err);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if(newContactName && newContactPhone) {
        addEmergencyContact({ name: newContactName, phone: newContactPhone });
        setNewContactName('');
        setNewContactPhone('');
        setShowAddContact(false);
    }
  };

  const triggerDisconnect = () => {
      if (!disconnectTarget) return;
      
      setIsDisconnecting(true);
      
      // Simulate network request
      setTimeout(() => {
          setIsDisconnecting(false);
          setDisconnectSuccess(true);
          
          // Update the member status visually
          setFamilyMembers(prev => prev.map(m => 
            m.id === disconnectTarget.id 
              ? { ...m, status: 'disconnected', connection: 'Đã ngắt kết nối', device: 'Bị khóa tạm thời' } 
              : m
          ));

          // Close modal after showing success
          setTimeout(() => {
              setDisconnectSuccess(false);
              setDisconnectTarget(null);
          }, 1500);
      }, 2000);
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatCode = (code: string) => {
      if (!code) return "LOADING";
      // Split into groups of 3 for readability (e.g. 123 456)
      return code.match(/.{1,3}/g)?.join(' ') || code;
  };

  return (
    <div className="p-4 pt-20 md:pt-10 pb-32 min-h-screen max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Remote Disconnect Modal */}
      {disconnectTarget && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-t-8 border-red-500 animate-[shake_0.3s_ease-out]">
                  
                  {disconnectSuccess ? (
                    <div className="flex flex-col items-center text-center py-4 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">ĐÃ NGẮT KẾT NỐI</h3>
                        <p className="text-slate-500">Thiết bị của {disconnectTarget.name} đã được bảo vệ.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertOctagon size={32} className="text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Cảnh Báo</h3>
                        <p className="text-slate-600 mb-6">
                            Bạn sắp kích hoạt giao thức ngắt kết nối khẩn cấp cho thiết bị của <strong>{disconnectTarget.name}</strong>.
                            <br/><span className="text-xs text-red-500 font-bold mt-2 block">Hành động này sẽ dừng mọi cuộc gọi đang diễn ra.</span>
                        </p>
                        
                        <div className="w-full space-y-3">
                            <button 
                              onClick={triggerDisconnect}
                              disabled={isDisconnecting}
                              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 touch-target"
                            >
                              {isDisconnecting ? <Loader2 className="animate-spin" /> : <PhoneOff />}
                              {isDisconnecting ? 'Đang gửi tín hiệu...' : 'NGẮT KẾT NỐI NGAY'}
                            </button>
                            <button 
                              onClick={() => setDisconnectTarget(null)}
                              disabled={isDisconnecting}
                              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            >
                              Hủy bỏ
                            </button>
                        </div>
                    </div>
                  )}
              </div>
          </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-start mb-6 border-b border-slate-200 pb-4 gap-2">
        <h2 className="text-3xl font-bold text-slate-900">Gia Đình</h2>
        <p className="text-slate-500 text-sm">Trung tâm chỉ huy bảo vệ người thân.</p>
      </div>

      {/* OTP Link Code Section - Redesigned */}
      <div className="mb-8 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
         <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <KeyRound size={24} className="text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Mã Kết Nối (OTP)</h3>
                    <p className="text-slate-400 text-xs">Dùng mã này để liên kết thiết bị khác</p>
                </div>
            </div>
         </div>

         <div className="p-6 flex flex-col items-center gap-6">
            {/* The Code Display */}
            <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-center relative group">
                <div className="text-4xl md:text-5xl font-mono font-black text-slate-800 tracking-wider select-all">
                    {formatCode(user ? user.familyId : "...")}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">Tự động đổi sau mỗi 5 phút</p>
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-200 rounded-b-2xl overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${
                            progress > 50 ? 'bg-green-500' : 
                            progress > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Timer & Actions */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-mono bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Clock size={16} />
                    <span>Hết hạn trong: <span className="font-bold text-slate-800">{formatTime(timeLeft)}</span></span>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={handleCopy}
                        className="flex-1 md:flex-none py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Copy size={18} /> Sao chép
                    </button>
                    <button 
                        onClick={() => regenerateFamilyId()}
                        className="aspect-square py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                        title="Tạo mã mới ngay"
                    >
                        <RefreshCw size={20} className={timeLeft < 5 ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* Connected Devices */}
      <h3 className="text-lg font-bold text-slate-800 mb-3 px-2 flex items-center gap-2">
          <Wifi size={20} className="text-blue-600" /> Thiết bị đã kết nối
      </h3>
      <div className="grid gap-3 mb-8">
        {familyMembers.map((member) => (
          <div key={member.id} className={`bg-white border border-slate-200 p-4 rounded-2xl flex flex-col shadow-sm transition-all gap-4 ${member.status === 'disconnected' ? 'opacity-70 bg-slate-50' : 'hover:shadow-md'}`}>
               <div className="flex items-center gap-4">
                 {/* Avatar */}
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm flex-shrink-0 transition-colors ${
                   member.status === 'safe' 
                   ? 'bg-blue-600 text-white' 
                   : member.status === 'disconnected'
                   ? 'bg-slate-300 text-slate-500'
                   : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300'
                 }`}>
                   {member.status === 'disconnected' ? <WifiOff size={20} /> : member.name.charAt(0)}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <h3 className="text-slate-900 font-bold text-base truncate">{member.name}</h3>
                   <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                     {member.status === 'safe' ? (
                       <>
                        <span className="text-green-700 flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded font-bold border border-green-100">
                          <ShieldCheck size={10} /> AN TOÀN
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 truncate">
                           <Wifi size={10} /> {member.connection}
                        </span>
                       </>
                     ) : member.status === 'disconnected' ? (
                        <span className="text-slate-600 flex items-center gap-1 bg-slate-200 px-1.5 py-0.5 rounded font-bold">
                          <PhoneOff size={10} /> ĐÃ NGẮT
                        </span>
                     ) : (
                       <span className="text-amber-600 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded font-bold border border-amber-100">
                          <Link size={10} /> CHỜ KẾT NỐI
                       </span>
                     )}
                   </div>
                 </div>
               </div>

               {member.status === 'safe' && member.name !== (user ? user.name + ' (Tôi)' : 'Tôi') && (
                  <button 
                      onClick={() => setDisconnectTarget(member)}
                      className="w-full text-sm bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 font-bold transition-colors border border-red-100 active:scale-95"
                  >
                      <PhoneOff size={16} /> Ngắt từ xa
                  </button>
               )}
            </div>
        ))}
      </div>

      {/* Emergency Contacts Section */}
      <div className="mb-8">
         <div className="flex justify-between items-center mb-3 px-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Smartphone size={20} className="text-red-600" /> Danh bạ SOS
            </h3>
            <button 
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors active:scale-95"
            >
                {showAddContact ? 'Đóng' : '+ Thêm số'}
            </button>
         </div>

         {showAddContact && (
            <form onSubmit={handleAddContact} className="bg-white p-4 rounded-2xl mb-4 border border-slate-200 shadow-sm animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 gap-3 mb-3">
                    <input 
                        type="text" placeholder="Tên (VD: Con trai)" 
                        value={newContactName} onChange={e => setNewContactName(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-full text-base" required
                    />
                    <input 
                        type="tel" placeholder="Số điện thoại" 
                        value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-full text-base" required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors active:scale-95">Lưu liên hệ</button>
            </form>
         )}

         <div className="grid gap-3">
            {user?.emergencyContacts.map(contact => (
                <div key={contact.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                            {contact.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 text-base">{contact.name}</div>
                            <div className="text-slate-500 text-sm font-mono">{contact.phone}</div>
                        </div>
                    </div>
                    <button onClick={() => removeEmergencyContact(contact.id)} className="text-slate-400 hover:text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors active:scale-90">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            {(!user?.emergencyContacts || user.emergencyContacts.length === 0) && (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm">
                    Chưa có liên hệ khẩn cấp nào.
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FamilyScreen;
