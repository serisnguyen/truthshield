
import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldCheck, Wifi, UserPlus, Link, CheckCircle2, Copy, Trash2, PhoneOff, RefreshCw, AlertOctagon, Clock, Loader2, WifiOff } from 'lucide-react';
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

        if (remaining === 0) {
            // Auto regenerate or show expired state
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.familyCodeTimestamp]);

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

  return (
    <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-4xl mx-auto animate-in fade-in duration-300">
      
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
                              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                            >
                              {isDisconnecting ? <Loader2 className="animate-spin" /> : <PhoneOff />}
                              {isDisconnecting ? 'Đang gửi tín hiệu...' : 'NGẮT KẾT NỐI NGAY'}
                            </button>
                            <button 
                              onClick={() => setDisconnectTarget(null)}
                              disabled={isDisconnecting}
                              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Gia Đình</h2>
          <p className="text-slate-500 text-base">Trung tâm chỉ huy bảo vệ người thân.</p>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="mb-10 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <Smartphone size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Danh bạ SOS</h3>
                    <p className="text-xs text-slate-500">Người sẽ nhận tin nhắn khi có báo động</p>
                </div>
            </div>
            <button 
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
                {showAddContact ? 'Đóng' : '+ Thêm số'}
            </button>
         </div>

         {showAddContact && (
            <form onSubmit={handleAddContact} className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input 
                        type="text" placeholder="Tên (VD: Con trai)" 
                        value={newContactName} onChange={e => setNewContactName(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required
                    />
                    <input 
                        type="tel" placeholder="Số điện thoại" 
                        value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors">Lưu liên hệ</button>
            </form>
         )}

         <div className="grid gap-3 md:grid-cols-2">
            {user?.emergencyContacts.map(contact => (
                <div key={contact.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {contact.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{contact.name}</div>
                            <div className="text-slate-500 text-xs font-mono">{contact.phone}</div>
                        </div>
                    </div>
                    <button onClick={() => removeEmergencyContact(contact.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
            {(!user?.emergencyContacts || user.emergencyContacts.length === 0) && (
                <div className="col-span-2 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                    Chưa có liên hệ khẩn cấp nào.
                </div>
            )}
         </div>
      </div>

      {/* Connected Devices */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">Thiết bị đã kết nối</h3>
      <div className="grid gap-4 mb-10">
        {familyMembers.map((member) => (
          <div key={member.id} className={`bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm transition-all gap-4 ${member.status === 'disconnected' ? 'opacity-70 bg-slate-50' : 'hover:shadow-md'}`}>
               <div className="flex items-center gap-5 w-full md:w-auto">
                 {/* Avatar */}
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-sm flex-shrink-0 transition-colors ${
                   member.status === 'safe' 
                   ? 'bg-blue-600 text-white' 
                   : member.status === 'disconnected'
                   ? 'bg-slate-300 text-slate-500'
                   : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300'
                 }`}>
                   {member.status === 'disconnected' ? <WifiOff size={24} /> : member.name.charAt(0)}
                 </div>
                 
                 <div className="flex-1">
                   <h3 className="text-slate-900 font-bold text-lg">{member.name}</h3>
                   <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                     {member.status === 'safe' ? (
                       <>
                        <span className="text-green-700 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md font-bold text-xs border border-green-100">
                          <ShieldCheck size={12} /> AN TOÀN
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1">
                           <Wifi size={12} /> {member.connection}
                        </span>
                       </>
                     ) : member.status === 'disconnected' ? (
                        <span className="text-slate-600 flex items-center gap-1 bg-slate-200 px-2 py-0.5 rounded-md font-bold text-xs">
                          <PhoneOff size={12} /> ĐÃ NGẮT KẾT NỐI
                        </span>
                     ) : (
                       <span className="text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-xs border border-amber-100">
                          <Link size={12} /> CHỜ KẾT NỐI
                       </span>
                     )}
                   </div>
                 </div>
               </div>

               {member.status === 'safe' && member.name !== (user ? user.name + ' (Tôi)' : 'Tôi') && (
                  <button 
                      onClick={() => setDisconnectTarget(member)}
                      className="w-full md:w-auto text-sm bg-red-50 text-red-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 font-bold transition-colors border border-red-100"
                  >
                      <PhoneOff size={16} /> Ngắt từ xa
                  </button>
               )}
            </div>
        ))}
      </div>

      {/* OTP Link Code Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
         {/* Background Patterns */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Link size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl">Mã Kết Nối (OTP)</h3>
                </div>
                <p className="text-blue-100 text-sm max-w-xs mx-auto md:mx-0">
                    Cung cấp mã này cho người thân để liên kết thiết bị. Mã sẽ hết hạn sau 5 phút.
                </p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                     {/* Timer Circle */}
                     <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500/30" />
                            <circle 
                                cx="24" cy="24" r="20" 
                                stroke="currentColor" strokeWidth="4" fill="transparent" 
                                className={`text-white transition-all duration-1000 ease-linear ${timeLeft < 60 ? 'text-red-300' : ''}`}
                                strokeDasharray={125.6}
                                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                            />
                        </svg>
                        <span className="absolute text-[10px] font-mono font-bold">{formatTime(timeLeft)}</span>
                     </div>

                     {/* The Code */}
                     <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-3 font-mono text-3xl font-bold tracking-[0.2em] shadow-inner select-all">
                        {user ? user.familyId : "LOADING"}
                     </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors flex items-center gap-2"
                    >
                        <Copy size={14} /> Sao chép
                    </button>
                    <button 
                        onClick={() => regenerateFamilyId()}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={14} /> Tạo mã mới
                    </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FamilyScreen;
