
import React, { useState } from 'react';
import { 
  User, Settings, LogOut, Bell, Shield, 
  ChevronRight, Smartphone, Lock, CreditCard, 
  Eye, EyeOff, Loader2, KeyRound, Mic, FileText, X, CheckCircle2, Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VoiceSetupModal from './VoiceSetupModal';
import AlertHistoryScreen from './AlertHistoryScreen';

interface ProfileScreenProps {
}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, login, register, logout, updateSecurityQuestion } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showPrivacyLog, setShowPrivacyLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Security Question
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [secQuestion, setSecQuestion] = useState('');
  const [secAnswer, setSecAnswer] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (authMode === 'login') {
        await login(phone, password);
      } else {
        await register(name, phone, password);
      }
    } catch (err) {
      setError('Thông tin không hợp lệ hoặc lỗi hệ thống.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveSecurityQuestion = () => {
    if (secQuestion && secAnswer) {
        updateSecurityQuestion(secQuestion, secAnswer);
        setEditingSecurity(false);
        alert("Đã lưu câu hỏi bí mật!");
    }
  };

  // --- PRIVACY LOG MODAL ---
  const PrivacyLogModal = () => (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Shield size={20} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800">Nhật Ký Riêng Tư</h3>
                <p className="text-xs text-slate-500">Minh bạch xử lý dữ liệu</p>
             </div>
          </div>
          <button onClick={() => setShowPrivacyLog(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
           {/* Privacy Stats */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <div className="text-xs text-slate-500 font-bold uppercase mb-1">Dữ liệu đã quét</div>
                 <div className="text-2xl font-black text-slate-800">128 MB</div>
                 <div className="text-xs text-slate-400 mt-1">Audio & Video</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                 <div className="text-xs text-blue-500 font-bold uppercase mb-1">Gửi lên máy chủ</div>
                 <div className="text-2xl font-black text-blue-600">0 KB</div>
                 <div className="text-xs text-blue-400 mt-1">Xử lý cục bộ 100%</div>
              </div>
           </div>

           {/* Processing Flow */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Quy trình xử lý dữ liệu</h4>
              
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 border-2 border-green-200 z-10">
                        <Smartphone size={14} />
                    </div>
                    <div className="w-0.5 h-full bg-slate-200 -my-1"></div>
                 </div>
                 <div className="pb-6">
                    <h5 className="font-bold text-slate-700 text-sm">Thu thập dữ liệu</h5>
                    <p className="text-xs text-slate-500">Dữ liệu video/audio từ cuộc gọi được thu thập tạm thời vào bộ nhớ RAM.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-blue-200 z-10">
                        <Loader2 size={14} className="animate-spin" />
                    </div>
                    <div className="w-0.5 h-full bg-slate-200 -my-1"></div>
                 </div>
                 <div className="pb-6">
                    <h5 className="font-bold text-slate-700 text-sm">Phân tích cục bộ</h5>
                    <p className="text-xs text-slate-500">AI Engine chạy trực tiếp trên thiết bị (On-Device) để so khớp khuôn mặt và giọng nói.</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-200 z-10">
                        <Server size={14} />
                    </div>
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-400 text-sm line-through">Gửi lên Cloud</h5>
                    <p className="text-xs text-slate-400 italic">Bị chặn. Không có dữ liệu nào rời khỏi thiết bị.</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-800 font-medium">Chứng chỉ bảo mật: Ứng dụng tuân thủ tiêu chuẩn mã hóa AES-256 cho dữ liệu Voice DNA.</p>
           </div>
        </div>
      </div>
    </div>
  );

  // --- SHOW HISTORY SUB-SCREEN ---
  if (showHistory) {
    return <AlertHistoryScreen onBack={() => setShowHistory(false)} />;
  }

  // --- LOGGED IN VIEW ---
  if (user) {
    return (
      <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-2xl mx-auto animate-in fade-in duration-300">
        
        {showVoiceModal && <VoiceSetupModal onClose={() => setShowVoiceModal(false)} />}
        {showPrivacyLog && <PrivacyLogModal />}

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 font-medium">{user.phone}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              <Shield size={12} fill="currentColor" /> Đã bảo vệ
            </span>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-6">
          
          {/* Account Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Tài Khoản</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <SettingItem icon={<User size={20} />} label="Thông tin cá nhân" />
              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<CreditCard size={20} />} label="Gói đăng ký" value="Miễn phí" />
            </div>
          </section>

          {/* Security Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Bảo Mật Cao Cấp</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Voice DNA */}
              <div 
                onClick={() => setShowVoiceModal(true)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                    <div className="text-purple-600"><Mic size={20} /></div>
                    <span className="text-slate-700 font-medium">Voice DNA (Giọng nói)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${user.hasVoiceProfile ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.hasVoiceProfile ? 'Đã thiết lập' : 'Chưa thiết lập'}
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="border-t border-slate-100"></div>

              {/* Security Question */}
              {editingSecurity ? (
                  <div className="p-4 bg-slate-50">
                      <h4 className="font-bold text-sm mb-2 text-slate-700">Thiết lập câu hỏi bí mật</h4>
                      <input 
                        className="w-full p-2 border border-slate-300 rounded mb-2 text-sm"
                        placeholder="Câu hỏi (VD: Tên cún cưng?)"
                        value={secQuestion}
                        onChange={e => setSecQuestion(e.target.value)}
                      />
                      <input 
                        className="w-full p-2 border border-slate-300 rounded mb-2 text-sm"
                        placeholder="Câu trả lời (Bí mật)"
                        value={secAnswer}
                        onChange={e => setSecAnswer(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingSecurity(false)} className="text-sm text-slate-500">Hủy</button>
                          <button onClick={saveSecurityQuestion} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Lưu</button>
                      </div>
                  </div>
              ) : (
                <div 
                    onClick={() => setEditingSecurity(true)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600"><KeyRound size={20} /></div>
                        <span className="text-slate-700 font-medium">Câu hỏi bí mật gia đình</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">{user.securityQuestion ? 'Đã đặt' : 'Chưa đặt'}</span>
                        <ChevronRight size={16} className="text-slate-300" />
                    </div>
                </div>
              )}

              <div className="border-t border-slate-100"></div>
              
              {/* Privacy Log Button */}
              <div 
                onClick={() => setShowPrivacyLog(true)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                 <div className="flex items-center gap-3">
                    <div className="text-green-600"><Shield size={20} /></div>
                    <span className="text-slate-700 font-medium">Nhật Ký Riêng Tư (Audit)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Xem báo cáo</span>
                    <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<Smartphone size={20} />} label="Mã Gia Đình" value={user.familyId.substring(0,4)+"..."} />
            </div>
          </section>

           {/* App Info Section */}
           <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Ứng Dụng</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <SettingItem 
                icon={<FileText size={20} />} 
                label="Lịch sử cảnh báo" 
                onClick={() => setShowHistory(true)}
              /> 
              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<Settings size={20} />} label="Phiên bản" value="1.0.3 (Secure)" />
            </div>
          </section>

          {/* Logout Button */}
          <button 
            onClick={logout}
            className="w-full py-4 mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 border border-red-100"
          >
            <LogOut size={20} /> Đăng Xuất
          </button>

        </div>
      </div>
    );
  }

  // --- LOGGED OUT VIEW (Login/Register) ---
  return (
    <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen flex flex-col items-center justify-center max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Shield className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">TruthShield AI</h2>
          <p className="text-slate-500 mt-1">
            {authMode === 'login' ? 'Đăng nhập để quản lý bảo mật' : 'Tạo tài khoản bảo vệ gia đình'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-medium text-center">
              {error}
            </div>
          )}

          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text"
                  required
                  placeholder="Nhập họ tên..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Số điện thoại</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="tel"
                required
                placeholder="09xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 size={20} className="animate-spin" />}
            {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
          </button>

        </form>

        {/* Toggle Auth Mode */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {authMode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-center gap-3">
      <div className="text-slate-400">
        {icon}
      </div>
      <span className="text-slate-700 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-slate-400">{value}</span>}
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  </div>
);

export default ProfileScreen;
