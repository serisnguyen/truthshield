import React from 'react';
import { Smartphone, ShieldCheck, Wifi, UserPlus, Link, CheckCircle2, Copy } from 'lucide-react';

const FamilyScreen: React.FC = () => {
  const familyMembers = [
    { name: 'Mẹ', status: 'safe', device: 'iPhone 14', connection: 'Đang online', risk: 'None' },
    { name: 'Bố', status: 'safe', device: 'Samsung S24', connection: '5 phút trước', risk: 'None' },
    { name: 'Em gái', status: 'pending', device: 'Chưa kích hoạt', connection: '--', risk: '--' },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("FAMILY-8829");
      alert("Đã sao chép mã!");
    } catch (err) {
      console.warn("Clipboard write failed", err);
    }
  };

  return (
    <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-4xl mx-auto">
      
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Gia Đình</h2>
          <p className="text-slate-500 text-base">Quản lý các thiết bị của người thân.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-200">
          <UserPlus size={20} /> <span className="hidden md:inline">Thêm người</span>
        </button>
      </div>

      <div className="grid gap-4">
        {familyMembers.map((member, idx) => (
          <div key={idx} className="group relative">
            <div className="relative bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-5">
                 {/* Avatar */}
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm ${
                   member.status === 'safe' 
                   ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' 
                   : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300'
                 }`}>
                   {member.name.charAt(0)}
                 </div>
                 
                 <div>
                   <h3 className="text-slate-900 font-bold text-xl">{member.name}</h3>
                   <div className="flex items-center gap-3 text-sm mt-1.5">
                     {member.status === 'safe' ? (
                       <>
                        <span className="text-green-700 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
                          <ShieldCheck size={16} /> Đã bảo vệ
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                           <Smartphone size={16} /> {member.device}
                        </span>
                       </>
                     ) : (
                       <span className="text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full font-medium border border-amber-100">
                          <Link size={16} /> Chờ kết nối...
                       </span>
                     )}
                   </div>
                 </div>
               </div>

               <div className="text-right hidden sm:block">
                  {member.status === 'safe' ? (
                    <div className="flex flex-col items-end gap-1">
                       <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                          <Wifi size={18} className={member.connection === 'Đang online' ? 'text-green-500' : 'text-slate-400'} /> 
                          {member.connection}
                       </div>
                       <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> AN TOÀN
                       </div>
                    </div>
                  ) : (
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium underline">
                      Gửi lại lời mời
                    </button>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Link Code Section */}
      <div className="mt-8 p-8 rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 text-center">
         <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
            <Link size={28} />
         </div>
         <h3 className="text-slate-800 font-bold text-xl mb-2">Liên kết thiết bị mới</h3>
         <p className="text-slate-600 text-base mb-6 max-w-md mx-auto">
           Nhờ người thân tải ứng dụng TruthShield và nhập mã số bên dưới để kết nối vào gia đình.
         </p>
         
         <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="bg-white border-2 border-blue-200 rounded-xl px-8 py-4 font-mono text-2xl font-bold tracking-widest text-slate-800 shadow-sm select-all">
              FAMILY-8829
            </div>
            <button 
              onClick={handleCopy}
              className="px-6 py-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 text-slate-700 font-bold transition active:bg-slate-100 shadow-sm flex items-center gap-2"
            >
               <Copy size={20} /> Sao chép
            </button>
         </div>
      </div>
    </div>
  );
};

export default FamilyScreen;