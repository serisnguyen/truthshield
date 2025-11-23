
import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldAlert, MessageSquareWarning, LocateFixed, Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AlertHistoryScreenProps {
  onBack: () => void;
}

const AlertHistoryScreen: React.FC<AlertHistoryScreenProps> = ({ onBack }) => {
  const { user, clearAlertHistory } = useAuth();

  const getIcon = (type: string) => {
    switch (type) {
      case 'deepfake':
        return <ShieldAlert size={24} className="text-red-600" />;
      case 'scam_msg':
        return <MessageSquareWarning size={24} className="text-amber-600" />;
      case 'sos':
        return <LocateFixed size={24} className="text-blue-600" />;
      default:
        return <AlertTriangle size={24} className="text-slate-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  return (
    <div className="p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-2xl mx-auto animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
                <ArrowLeft size={24} className="text-slate-700" />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Lịch Sử Cảnh Báo</h2>
                <p className="text-slate-500 text-sm">Nhật ký các sự kiện an ninh</p>
            </div>
            <div className="ml-auto">
                <button 
                    onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?")) {
                            clearAlertHistory();
                        }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Xóa lịch sử"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>

        {/* List */}
        <div className="space-y-4">
            {user?.alertHistory && user.alertHistory.length > 0 ? (
                user.alertHistory.map((alert) => (
                    <div key={alert.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            alert.type === 'deepfake' ? 'bg-red-100' :
                            alert.type === 'scam_msg' ? 'bg-amber-100' :
                            'bg-blue-100'
                        }`}>
                            {getIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-800 text-base uppercase">
                                    {alert.type === 'deepfake' ? 'Cảnh Báo Deepfake' :
                                     alert.type === 'scam_msg' ? 'Tin Nhắn Rác' :
                                     'Tín Hiệu SOS'}
                                </h3>
                                <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Clock size={10} />
                                    {formatTime(alert.timestamp)}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm mt-1">{alert.details}</p>
                            
                            {alert.riskScore > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                alert.riskScore > 80 ? 'bg-red-500' :
                                                alert.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${alert.riskScore}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-bold ${
                                        alert.riskScore > 80 ? 'text-red-600' :
                                        alert.riskScore > 50 ? 'text-amber-600' : 'text-green-600'
                                    }`}>
                                        {alert.riskScore}% Rủi ro
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-500 font-bold">Chưa có cảnh báo nào</h3>
                    <p className="text-slate-400 text-sm mt-2">Hệ thống an ninh của bạn đang hoạt động tốt.</p>
                </div>
            )}
        </div>

    </div>
  );
};

export default AlertHistoryScreen;
