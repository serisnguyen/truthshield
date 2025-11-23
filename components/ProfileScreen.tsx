import React, { useState } from 'react';
import { 
  User, Settings, LogOut, Bell, Shield, 
  ChevronRight, Smartphone, Lock, CreditCard, 
  Eye, EyeOff, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, login, register, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

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

  // --- LOGGED IN VIEW ---
  if (user) {
    return (
      <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-2xl mx-auto animate-in fade-in duration-300">
        
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
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Bảo Mật & An Ninh</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <SettingItem icon={<Lock size={20} />} label="Đổi mật khẩu" />
              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<Bell size={20} />} label="Cài đặt thông báo" value="Bật" />
              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<Smartphone size={20} />} label="Mã Gia Đình" value={user.familyId} />
            </div>
          </section>

           {/* App Info Section */}
           <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Ứng Dụng</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <SettingItem icon={<Shield size={20} />} label="Điều khoản sử dụng" />
              <div className="border-t border-slate-100"></div>
              <SettingItem icon={<Settings size={20} />} label="Phiên bản" value="1.0.2 (Beta)" />
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
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
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
