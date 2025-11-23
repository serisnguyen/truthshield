import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Zap, Banknote, Heart, RefreshCw, AlertTriangle } from 'lucide-react';

interface Scam {
  id: number;
  type: string;
  title: string;
  risk: 'Cao' | 'Trung bình' | 'Thấp';
  description: string;
  keywords: string[];
}

const initialScams: Scam[] = [
  {
    id: 1,
    type: 'Deepfake',
    title: "Giả mạo Con cái gọi Video Khẩn cấp",
    risk: 'Cao',
    description: "Kẻ gian sử dụng AI để giả khuôn mặt và giọng nói của người thân, yêu cầu chuyển tiền gấp để 'cứu mạng'.",
    keywords: ['cấp cứu', 'chuyển gấp', 'khóa tài khoản'],
  },
  {
    id: 2,
    type: 'Giả danh',
    title: "Mạo danh Công an, VKS, Thuế",
    risk: 'Cao',
    description: "Yêu cầu người dùng cài ứng dụng giả mạo hoặc chuyển tiền vào tài khoản 'tạm giữ' để điều tra tội phạm.",
    keywords: ['lệnh bắt', 'tài khoản tạm giữ', 'điều tra', 'công an'],
  },
  {
    id: 3,
    type: 'Đầu tư',
    title: "Kêu gọi Đầu tư tiền ảo, 'Sàn vàng' lợi nhuận cao",
    risk: 'Trung bình',
    description: "Dụ dỗ nạn nhân tham gia các nhóm đầu tư kín với cam kết lợi nhuận gấp nhiều lần, sau đó đánh sập sàn để chiếm đoạt tiền.",
    keywords: ['lợi nhuận x10', 'sàn vàng', 'chuyên gia', 'rút tiền'],
  },
  {
    id: 4,
    type: 'Tình cảm',
    title: "Kẻ lừa tình (Scam Romance) qua mạng xã hội",
    risk: 'Trung bình',
    description: "Xây dựng mối quan hệ tình cảm, sau đó viện cớ gặp khó khăn hoặc cần tiền làm thủ tục hải quan để xin tiền.",
    keywords: ['hải quan', 'gửi quà', 'gặp khó', 'duyên nợ'],
  },
];

const ScamLibraryScreen: React.FC = () => {
  const [scams, setScams] = useState<Scam[]>(initialScams);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString('vi-VN'));

  const fetchNewScams = () => {
    setIsLoading(true);
    // Simulate an AI call (using the same logic as news fetch)
    setTimeout(() => {
      const newScam: Scam = {
        id: Date.now(),
        type: 'Mới',
        title: "Kỹ thuật 'Hack' Camera qua link lạ",
        risk: 'Cao',
        description: "Yêu cầu người dùng nhấp vào link 'kiểm tra đường truyền' để chiếm quyền điều khiển Camera/Mic từ xa.",
        keywords: ['đường truyền', 'kiểm tra bảo mật', 'nhấp vào'],
      };
      setScams([newScam, ...initialScams]);
      setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
      setIsLoading(false);
    }, 1500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deepfake':
        return <ShieldAlert size={20} className="text-red-500" />;
      case 'Giả danh':
        return <Banknote size={20} className="text-blue-500" />;
      case 'Đầu tư':
        return <Zap size={20} className="text-yellow-500" />;
      case 'Tình cảm':
        return <Heart size={20} className="text-pink-500" />;
      default:
        return <AlertTriangle size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-4xl mx-auto bg-[#F8FAFC] animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <BookOpen size={30} className="text-blue-600" /> Thư Viện Cảnh Báo
          </h2>
          <p className="text-slate-500 text-base">Hệ thống AI tổng hợp các thủ đoạn lừa đảo phổ biến và mới nhất.</p>
        </div>
      </div>

      {/* Action Button and Status */}
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-sm text-slate-500 font-medium">
          Cập nhật lần cuối: {lastUpdated}
        </div>
        <button
          onClick={fetchNewScams}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-70 shadow-sm"
        >
          {isLoading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Zap size={16} />
          )}
          {isLoading ? 'Đang tìm...' : 'Tìm Thủ Đoạn Mới'}
        </button>
      </div>

      {/* Scam List */}
      <div className="space-y-4">
        {scams.map((scam) => (
          <div 
            key={scam.id} 
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative"
          >
             <div className={`absolute top-0 right-4 translate-y-[-50%] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase ${
               scam.risk === 'Cao' ? 'bg-red-600' : scam.risk === 'Trung bình' ? 'bg-amber-500' : 'bg-blue-600'
             }`}>
                {scam.risk}
             </div>

            <div className="flex items-start gap-4 mb-3">
              <div className="w-10 h-10 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                {getIcon(scam.type)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{scam.type}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{scam.title}</h3>
              </div>
            </div>
            
            <p className="text-slate-700 leading-relaxed mb-4">
              {scam.description}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-red-600 mr-2 uppercase tracking-wide py-1">Từ khóa:</span>
              {scam.keywords.map((kw, idx) => (
                <span key={idx} className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-md border border-red-100">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScamLibraryScreen;