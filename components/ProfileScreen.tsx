
import React, { useState, useEffect } from 'react';
import { 
  User, Settings, LogOut, Bell, Shield, 
  ChevronRight, Smartphone, Lock, CreditCard, 
  Eye, EyeOff, Loader2, KeyRound, Mic, FileText, X, CheckCircle2, Server, Save, Accessibility, RefreshCw, AlertOctagon, Phone, MessageSquareText, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoiceSetupModal from './VoiceSetupModal';
import AlertHistoryScreen from './AlertHistoryScreen';
import CallHistoryScreen from './CallHistoryScreen';
import MessageHistoryScreen from './MessageHistoryScreen';

interface ProfileScreenProps {
}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, login, register, logout, updateSecurityQuestions, updateSOSMessage, isSeniorMode, toggleSeniorMode, role, setRole } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [showMessageHistory, setShowMessageHistory] = useState(false);

  // Inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Security Questions (3 Questions)
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  // SOS Message
  const [editingSOS, setEditingSOS] = useState(false);
  const [sosMsg, setSosMsg] = useState('');

  useEffect(() => {
    if (user?.securityQuestions && user.securityQuestions.length >= 1) {
        setQ1(user.securityQuestions[0] || '');
        setQ2(user.securityQuestions[1] || '');
        setQ3(user.securityQuestions[2] || '');
    }
    if (user?.sosMessage) {
        setSosMsg(user.sosMessage);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(phone, password);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(name, phone, password);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSecurity = () => {
      const questions = [q1, q2, q3].filter(q => q.trim() !== '');
      if (questions.length < 1) {
          alert("Vui lòng nhập ít nhất 1 câu hỏi.");
          return;
      }
      updateSecurityQuestions(questions);
      setEditingSecurity(false);
      alert("Đã cập nhật câu hỏi bí mật!");
  };

  const handleUpdateSOS = () => {
      if (sosMsg.trim()) {
          updateSOSMessage(sosMsg);
          setEditingSOS(false);
          alert("Đã cập nhật tin nhắn SOS!");
      }
  };

  // --- SUB-SCREENS ---
  if (showHistory) return <AlertHistoryScreen onBack={() => setShowHistory(false)} />;
  if (showCallHistory) return <CallHistoryScreen onBack={() => setShowCallHistory(false)} />;
  if (showMessageHistory) return <MessageHistoryScreen onBack={() => setShowMessageHistory(false)} />;

  // --- LOGIN / REGISTER VIEW ---
  if (!user) {
    return (
      <div className="p-6 pt-24 md:pt-10 min-h-screen flex flex-col items-center justify-center animate-in fade-in max-w-md mx-auto">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
                <User size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Tài Khoản</h1>
            <p className="text-slate-500">Đăng nhập để đồng bộ dữ liệu gia đình.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl w-full border border-slate-100">
           {/* Tabs */}
           <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
               <button 
                 onClick={() => setAuthMode('login')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
               >
                 Đăng Nhập
               </button>
               <button 
                 onClick={() => setAuthMode('register')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMode === 'register' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
               >
                 Đăng Ký
               </button>
           </div>

           <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {authMode === 'register' && (
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Họ Tên</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Nhập họ tên"
                        required
                      />
                   </div>
                </div>
              )}
              
              <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Số điện thoại</label>
                   <div className="relative">
                      <Smartphone className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="0912..."
                        required
                      />
                   </div>
              </div>

              <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Mật khẩu</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
              </div>

              {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-medium flex items-center gap-2">
                      <AlertOctagon size={16} /> {error}
                  </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
              </button>
           </form>
        </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW ---
  return (
    <div className={`p-4 md:p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-3xl mx-auto animate-in fade-in ${isSeniorMode ? 'text-lg' : ''}`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className={`rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 border-4 border-white shadow-sm ${isSeniorMode ? 'w-24 h-24 text-3xl' : 'w-16 h-16 text-xl'}`}>
                {user.name.charAt(0)}
            </div>
            <div>
                <h1 className={`font-black text-slate-900 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>{user.name}</h1>
                <p className="text-slate-500">{user.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                     <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${role === 'elder' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                         {role === 'elder' ? 'Người Cao Tuổi' : 'Người Quản Lý'}
                     </span>
                </div>
            </div>
        </div>

        {/* Settings Grid */}
        <div className="space-y-6">
            
            {/* 1. Interface Mode */}
            <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3 px-2">Giao diện & Vai trò</h3>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className={`p-4 flex items-center justify-between border-b border-slate-100 ${isSeniorMode ? 'py-6' : ''}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Accessibility size={isSeniorMode ? 28 : 20} /></div>
                            <div>
                                <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Chế độ Người Cao Tuổi</h4>
                                <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>Chữ to, giao diện đơn giản</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={isSeniorMode} onChange={toggleSeniorMode} />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>

                    <div className={`p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer ${isSeniorMode ? 'py-6' : ''}`} onClick={() => setRole(null)}>
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><RefreshCw size={isSeniorMode ? 28 : 20} /></div>
                            <div>
                                <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Đổi Vai Trò Sử Dụng</h4>
                                <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>Chọn lại (Người Cao Tuổi / Quản Lý)</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-400" />
                    </div>
                </div>
            </section>

            {/* 2. Security Setup */}
            <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3 px-2">An Ninh & Bảo Mật</h3>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Voice DNA (Self) */}
                    <button 
                        onClick={() => setShowVoiceModal(true)}
                        className={`w-full text-left p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition-colors ${isSeniorMode ? 'py-6' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Mic size={isSeniorMode ? 28 : 20} /></div>
                            <div>
                                <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Voice DNA (Giọng nói)</h4>
                                <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>
                                    {user.hasVoiceProfile ? 'Đã thiết lập bảo vệ' : 'Chưa thiết lập'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {user.hasVoiceProfile ? <CheckCircle2 size={20} className="text-green-500" /> : <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">Cần làm ngay</span>}
                            <ChevronRight className="text-slate-400" />
                        </div>
                    </button>

                    {/* Voice DNA Người Thân (Family Voice Profiles) */}
                    <div className={`p-4 border-b border-slate-100 ${isSeniorMode ? 'py-6' : ''}`}>
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users size={isSeniorMode ? 28 : 20} /></div>
                                <div>
                                    <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Voice DNA Người Thân</h4>
                                    <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>Mẫu giọng nói đã đăng ký</p>
                                </div>
                             </div>
                             <button onClick={() => setShowVoiceModal(true)} className="text-blue-600 font-bold text-sm">
                                 Thêm/Sửa
                             </button>
                         </div>
                         
                         <div className="pl-12 mt-1">
                             <div className="space-y-2">
                                 {user.familyVoiceProfiles && user.familyVoiceProfiles.length > 0 ? (
                                     user.familyVoiceProfiles.map((p, i) => (
                                         <div key={i} className="flex items-center justify-between bg-purple-50 text-purple-800 text-sm px-3 py-2 rounded-lg border border-purple-100">
                                            <span>{p.name} ({p.relationship})</span>
                                            <CheckCircle2 size={16} className="text-green-500"/>
                                         </div>
                                     ))
                                 ) : (
                                     <span className="text-slate-400 text-sm italic">Chưa có hồ sơ giọng nói Người thân.</span>
                                 )}
                             </div>
                         </div>
                    </div>

                    {/* Challenge Questions */}
                    <div className={`p-4 border-b border-slate-100 ${isSeniorMode ? 'py-6' : ''}`}>
                         <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><KeyRound size={isSeniorMode ? 28 : 20} /></div>
                                <div>
                                    <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Câu Hỏi Bí Mật</h4>
                                    <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>Dùng để hỏi người gọi đáng ngờ</p>
                                </div>
                             </div>
                             <button onClick={() => setEditingSecurity(!editingSecurity)} className="text-blue-600 font-bold text-sm">
                                 {editingSecurity ? 'Hủy' : 'Sửa'}
                             </button>
                         </div>
                         
                         {editingSecurity ? (
                             <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                                 <input value={q1} onChange={e=>setQ1(e.target.value)} placeholder="Câu hỏi 1 (VD: Món ăn yêu thích?)" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                                 <input value={q2} onChange={e=>setQ2(e.target.value)} placeholder="Câu hỏi 2" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                                 <input value={q3} onChange={e=>setQ3(e.target.value)} placeholder="Câu hỏi 3" className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                                 <button onClick={handleUpdateSecurity} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm mt-2">Lưu Câu Hỏi</button>
                             </div>
                         ) : (
                             <div className="pl-12 mt-1">
                                 <div className="flex flex-wrap gap-2">
                                     {user.securityQuestions && user.securityQuestions.length > 0 ? (
                                         user.securityQuestions.map((q, i) => (
                                             <span key={i} className="bg-amber-50 text-amber-800 text-xs px-2 py-1 rounded border border-amber-100">{q}</span>
                                         ))
                                     ) : (
                                         <span className="text-slate-400 text-sm italic">Chưa có câu hỏi nào.</span>
                                     )}
                                 </div>
                             </div>
                         )}
                    </div>

                    {/* SOS Message Config */}
                    <div className={`p-4 ${isSeniorMode ? 'py-6' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertOctagon size={isSeniorMode ? 28 : 20} /></div>
                                <div>
                                    <h4 className={`font-bold text-slate-800 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Tin Nhắn Khẩn Cấp (SOS)</h4>
                                    <p className={`text-slate-500 ${isSeniorMode ? 'text-base' : 'text-xs'}`}>Nội dung gửi khi bấm nút SOS</p>
                                </div>
                             </div>
                             <button onClick={() => setEditingSOS(!editingSOS)} className="text-blue-600 font-bold text-sm">
                                 {editingSOS ? 'Hủy' : 'Sửa'}
                             </button>
                         </div>
                         {editingSOS ? (
                             <div className="mt-3 animate-in slide-in-from-top-2">
                                 <textarea 
                                    value={sosMsg} 
                                    onChange={e=>setSosMsg(e.target.value)} 
                                    className="w-full p-3 border rounded-lg text-sm bg-slate-50 min-h-[80px]"
                                    placeholder="Nhập nội dung tin nhắn khẩn cấp..."
                                 />
                                 <button onClick={handleUpdateSOS} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm mt-2 flex items-center justify-center gap-2">
                                     <Save size={16} /> Lưu Thay Đổi
                                 </button>
                             </div>
                         ) : (
                             <p className="pl-12 text-slate-700 italic text-sm border-l-2 border-slate-200 ml-4 pl-3 py-1">
                                 "{user.sosMessage || 'Cha/Mẹ đang gặp nguy hiểm! Cần giúp đỡ ngay!'}"
                             </p>
                         )}
                    </div>
                </div>
            </section>

            {/* 3. Activity Logs */}
            <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-3 px-2">Hoạt động & Nhật ký</h3>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Message History Button */}
                    <button 
                        onClick={() => setShowMessageHistory(true)}
                        className={`w-full text-left p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition-colors ${isSeniorMode ? 'py-6' : ''}`}
                    >
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><MessageSquareText size={isSeniorMode ? 28 : 20} /></div>
                            <span className={`font-bold text-slate-700 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Lịch sử Kiểm tra Tin nhắn</span>
                         </div>
                         <ChevronRight className="text-slate-400" />
                    </button>

                    <button 
                        onClick={() => setShowHistory(true)}
                        className={`w-full text-left p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition-colors ${isSeniorMode ? 'py-6' : ''}`}
                    >
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Bell size={isSeniorMode ? 28 : 20} /></div>
                            <span className={`font-bold text-slate-700 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Lịch sử Cảnh báo</span>
                         </div>
                         <ChevronRight className="text-slate-400" />
                    </button>
                    
                    <button 
                        onClick={() => setShowCallHistory(true)}
                        className={`w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${isSeniorMode ? 'py-6' : ''}`}
                    >
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Phone size={isSeniorMode ? 28 : 20} /></div>
                            <span className={`font-bold text-slate-700 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>Nhật ký Cuộc gọi</span>
                         </div>
                         <ChevronRight className="text-slate-400" />
                    </button>
                </div>
            </section>

            <button 
                onClick={logout}
                className={`w-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors ${isSeniorMode ? 'py-6 text-xl' : 'py-4'}`}
            >
                <LogOut size={isSeniorMode ? 24 : 20} /> Đăng Xuất
            </button>
            
            <div className="text-center text-xs text-slate-300 font-mono pb-4">
                Version 2.5.0 (Beta) • ID: {user.id.slice(-6)}
            </div>
        </div>

        {showVoiceModal && (
            <VoiceSetupModal onClose={() => setShowVoiceModal(false)} />
        )}
    </div>
  );
};

export default ProfileScreen;
