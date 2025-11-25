
import React from 'react';
import { User, Users, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoleSelectionScreen: React.FC = () => {
  const { setRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4 md:p-6 animate-in fade-in duration-700">
      
      {/* Brand Header */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6 animate-bounce">
            <ShieldCheck className="text-white w-12 h-12" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">TruthShield AI</h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
          Hệ thống bảo vệ gia đình trước lừa đảo công nghệ cao.
          <br className="hidden md:block" />
          Vui lòng chọn giao diện phù hợp với bạn.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-2">
        
        {/* Role: Elder */}
        <button 
          onClick={() => setRole('elder')}
          className="group relative bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-2 hover:scale-105 active:scale-95 hover:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200 hover:bg-gradient-to-b hover:from-white hover:to-amber-50"
        >
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Khuyên dùng</div>
          </div>

          <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-lg">
             <User size={56} className="text-amber-600" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">Người Cao Tuổi</h2>
          <p className="text-slate-500 mb-8 font-medium text-lg">Giao diện đơn giản, chữ to, dễ sử dụng.</p>
          
          <div className="w-full bg-slate-50 rounded-2xl p-5 mb-4 group-hover:bg-white/80 transition-colors">
            <ul className="space-y-3 text-left">
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                  <span className="text-lg">Tự động chặn cuộc gọi xấu</span>
               </li>
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                   <span className="text-lg">Nút SOS khẩn cấp to rõ</span>
               </li>
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-green-600" /></div>
                   <span className="text-lg">Trợ lý ảo hỗ trợ 24/7</span>
               </li>
            </ul>
          </div>
          
          <div className="mt-auto flex items-center gap-2 text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
             Chọn chế độ này <ArrowRight size={20} />
          </div>
        </button>

        {/* Role: Relative */}
        <button 
          onClick={() => setRole('relative')}
          className="group relative bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 hover:scale-105 active:scale-95 hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:bg-gradient-to-b hover:from-white hover:to-blue-50"
        >
           <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-lg">
             <Shield size={56} className="text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">Người Quản Lý</h2>
          <p className="text-slate-500 mb-8 font-medium text-lg">Dành cho con cháu, người chăm sóc.</p>

          <div className="w-full bg-slate-50 rounded-2xl p-5 mb-4 group-hover:bg-white/80 transition-colors">
            <ul className="space-y-3 text-left">
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-blue-600" /></div>
                  <span className="text-base">Quản lý kết nối gia đình</span>
               </li>
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-blue-600" /></div>
                  <span className="text-base">Nhận cảnh báo lừa đảo từ xa</span>
               </li>
               <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full"><CheckCircle2 size={14} className="text-blue-600" /></div>
                  <span className="text-base">Kiểm tra tin nhắn, Link độc hại</span>
               </li>
            </ul>
          </div>

          <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
             Chọn chế độ này <ArrowRight size={20} />
          </div>
        </button>

      </div>

      <div className="mt-12 flex items-center gap-2 text-slate-400 text-sm font-medium">
        <ShieldCheck size={16} />
        <span>Bảo mật dữ liệu riêng tư 100% On-Device</span>
      </div>

    </div>
  );
};

export default RoleSelectionScreen;
