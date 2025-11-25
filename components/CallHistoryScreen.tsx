
import React, { useState, useEffect } from 'react';
import { ArrowLeft, PhoneIncoming, PhoneOutgoing, ShieldCheck, ShieldAlert, AlertTriangle, Sparkles, Loader2, RefreshCw, Radio } from 'lucide-react';
import { useAuth, CallLogItem } from '../context/AuthContext';
import { analyzeCallRisk } from '../services/aiService';

interface CallHistoryScreenProps {
  onBack: () => void;
}

const CallHistoryScreen: React.FC<CallHistoryScreenProps> = ({ onBack }) => {
  const { user, isSeniorMode, updateCallHistoryItem } = useAuth();
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}p ${sec}s`;
  };

  // Automatic "Real-time" Scan Logic
  useEffect(() => {
    const autoScanCalls = async () => {
        if (!user?.callHistory) return;
        
        // Find calls that have no analysis yet
        const unanalyzedCalls = user.callHistory.filter(c => !c.aiAnalysis && !analyzingIds.includes(c.id));
        
        if (unanalyzedCalls.length === 0) return;

        // Mark them as analyzing visually
        setAnalyzingIds(prev => [...prev, ...unanalyzedCalls.map(c => c.id)]);

        for (const call of unanalyzedCalls) {
            try {
                // Simulate real-time processing delay
                await new Promise(r => setTimeout(r, 800));
                
                const analysis = await analyzeCallRisk(call);
                updateCallHistoryItem(call.id, {
                    riskScore: analysis.riskScore,
                    explanation: analysis.explanation,
                    timestamp: Date.now()
                });
                
                // Remove from local loading state
                setAnalyzingIds(prev => prev.filter(id => id !== call.id));
            } catch (e) {
                console.error(e);
            }
        }
    };

    autoScanCalls();
  }, [user?.callHistory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data fetch
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getRiskColor = (score: number) => {
      if (score >= 70) return 'text-red-600 bg-red-50 border-red-200';
      if (score >= 30) return 'text-amber-600 bg-amber-50 border-amber-200';
      return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskLabel = (score: number) => {
      if (score >= 70) return 'Nguy Hiểm';
      if (score >= 30) return 'Cảnh Giác';
      return 'An Toàn';
  };

  return (
    <div className={`p-4 md:p-6 pt-20 md:pt-10 pb-32 min-h-screen max-w-2xl mx-auto animate-in fade-in duration-300 ${isSeniorMode ? 'text-lg' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h2 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-3xl' : 'text-2xl'}`}>Nhật Ký Cuộc Gọi</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all active:scale-95 ${isRefreshing ? 'animate-spin text-blue-600 border-blue-200' : ''}`}
                title="Làm mới"
             >
                <RefreshCw size={20} />
             </button>

             <div className={`flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 ${isSeniorMode ? 'text-base' : ''}`}>
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                 </span>
                 AI Đang bảo vệ 24/7
             </div>
          </div>
      </div>

      <div className="space-y-4">
        {user?.callHistory && user.callHistory.length > 0 ? (
          user.callHistory.map(call => (
            <div key={call.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${isSeniorMode ? 'p-6' : 'p-4'}`}>
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      call.direction === 'incoming' ? 'bg-blue-50' : 'bg-green-50'
                    }`}>
                      {call.direction === 'incoming' ? <PhoneIncoming className="text-blue-600" size={20} /> : <PhoneOutgoing className="text-green-600" size={20} />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-slate-900 ${isSeniorMode ? 'text-xl' : 'text-base'}`}>
                        {call.contactName || call.phoneNumber}
                      </h3>
                      {!call.contactName && <span className="text-xs text-slate-400">Số lạ</span>}
                    </div>
                  </div>
                  <div className="text-right">
                       <div className="text-slate-500 text-sm font-medium">{formatTime(call.timestamp)}</div>
                       <div className="text-slate-400 text-xs">{formatDuration(call.duration)}</div>
                  </div>
              </div>

              {/* AI Analysis Section */}
              {call.aiAnalysis ? (
                   <div className={`mt-3 p-3 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${getRiskColor(call.aiAnalysis.riskScore)}`}>
                       <div className="mt-0.5">
                           {call.aiAnalysis.riskScore >= 70 ? <ShieldAlert size={20} /> : 
                            call.aiAnalysis.riskScore >= 30 ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                       </div>
                       <div className="flex-1">
                           <div className="flex justify-between items-center mb-1">
                               <span className="font-black uppercase text-sm flex items-center gap-1">
                                  {getRiskLabel(call.aiAnalysis.riskScore)} ({call.aiAnalysis.riskScore}%)
                               </span>
                               <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                                   Đã phân tích
                               </span>
                           </div>
                           <div className="w-full bg-black/10 h-1.5 rounded-full mb-2">
                               <div 
                                    className="h-full rounded-full bg-current transition-all duration-1000" 
                                    style={{ width: `${call.aiAnalysis.riskScore}%` }}
                               ></div>
                           </div>
                           <p className="text-sm font-medium leading-tight">
                               AI: {call.aiAnalysis.explanation}
                           </p>
                       </div>
                   </div>
              ) : analyzingIds.includes(call.id) ? (
                  <div className="mt-3 p-3 rounded-xl border border-blue-100 bg-blue-50 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="text-blue-600 animate-spin" />
                      <span className="text-blue-700 font-bold text-sm">Đang phân tích thời gian thực...</span>
                  </div>
              ) : (
                  <div className="mt-3 p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center gap-2 opacity-60">
                      <Loader2 size={16} className="text-slate-400 animate-spin" />
                      <span className="text-slate-500 font-bold text-sm">Đang chờ dữ liệu cuộc gọi...</span>
                  </div>
              )}
            </div>
          ))
        ) : (
           <p className="text-center text-slate-500 mt-10">Chưa có cuộc gọi nào được ghi lại.</p>
        )}
      </div>
    </div>
  );
};

export default CallHistoryScreen;
