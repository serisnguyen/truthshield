
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Shield, Users, MessageSquareText, 
  ScanFace, Bot, PlayCircle, UserCircle, BookOpen, Loader2, Phone, BellRing, Wifi, WifiOff
} from 'lucide-react';
import AlertOverlay from './components/AlertOverlay';
import TutorialModal from './components/TutorialModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import SOSReceiveModal from './components/SOSReceiveModal';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy Load Components
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const FamilyScreen = lazy(() => import('./components/FamilyScreen'));
const MessageGuard = lazy(() => import('./components/MessageGuard'));
const ChatScreen = lazy(() => import('./components/ChatScreen'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const ScamLibraryScreen = lazy(() => import('./components/ScamLibraryScreen'));
const CallHistoryScreen = lazy(() => import('./components/CallHistoryScreen'));

export type Tab = 'home' | 'message' | 'family' | 'chat' | 'profile' | 'library' | 'history';

const LoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#F8FAFC]">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu an ninh...</p>
  </div>
);

const NetworkStatus = () => {
    const { isOnline, isSeniorMode, lastOnlineTime } = useAuth();
    const [offlineDuration, setOfflineDuration] = useState(0);

    useEffect(() => {
      if (!isOnline) {
        const interval = setInterval(() => {
          setOfflineDuration(Math.floor((Date.now() - lastOnlineTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setOfflineDuration(0);
      }
    }, [isOnline, lastOnlineTime]);

    if (isOnline) return null;
    
    const formatDuration = (seconds: number) => {
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      return `${mins} phút`;
    };
    
    return (
        <div className={`fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300 ${isSeniorMode ? 'h-14 text-lg' : 'h-10 text-sm font-bold'}`}>
            <WifiOff size={isSeniorMode ? 24 : 16} className="animate-pulse" />
            <span>Mất kết nối {formatDuration(offlineDuration)}</span>
            <button 
                onClick={() => window.location.reload()}
                className="ml-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-bold"
            >
                Thử lại
            </button>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { role, isLoading, incomingSOS, isSeniorMode } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showAlert, setShowAlert] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // If loading or no role selected, handle those states
  if (isLoading) return <LoadingFallback />;
  if (!role) return <RoleSelectionScreen />;

  const triggerAlert = () => setShowAlert(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onTriggerAlert={triggerAlert} onNavigate={setActiveTab} />;
      case 'message':
        return <MessageGuard />;
      case 'family':
        return <FamilyScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'library':
        return <ScamLibraryScreen onOpenTutorial={() => setShowTutorial(true)} />;
      case 'history':
        return <CallHistoryScreen onBack={() => setActiveTab('home')} />;
      default:
        return <HomeScreen onTriggerAlert={triggerAlert} onNavigate={setActiveTab} />;
    }
  };

  // --- ELDER INTERFACE (Simplified) ---
  if (role === 'elder') {
      return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col h-screen overflow-hidden">
             <NetworkStatus />
             {/* Simple Top Bar */}
             <div className="h-16 bg-white border-b-4 border-yellow-400 flex items-center justify-between px-4 shrink-0 shadow-sm z-20 mt-safe">
                <div className="flex items-center gap-2">
                    <Shield className="text-blue-600 fill-blue-600" size={28} />
                    <span className="text-xl font-black text-slate-800">TruthShield</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Chế độ Người Cao Tuổi</span>
                </div>
             </div>

             {/* Main Content */}
             <main className="flex-1 overflow-y-auto relative bg-slate-50 pb-28">
                 <Suspense fallback={<LoadingFallback />}>
                    {renderContent()}
                 </Suspense>
             </main>

             {/* BIG BUTTON BOTTOM NAV FOR ELDERS */}
             <div className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t-2 border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex items-stretch z-30">
                 <ElderNavButton 
                    key="home"
                    icon={<ScanFace size={24} />} 
                    label="Trang Chủ" 
                    isActive={activeTab === 'home'} 
                    onClick={() => setActiveTab('home')}
                    color="blue"
                 />
                 <ElderNavButton 
                    key="message"
                    icon={<MessageSquareText size={24} />} 
                    label="Tin Nhắn" 
                    isActive={activeTab === 'message'} 
                    onClick={() => setActiveTab('message')}
                    color="pink"
                 />
                 <ElderNavButton 
                    key="library"
                    icon={<BookOpen size={24} />} 
                    label="Thư Viện" 
                    isActive={activeTab === 'library'} 
                    onClick={() => setActiveTab('library')}
                    color="orange"
                 />
                 <ElderNavButton 
                    key="family"
                    icon={<Users size={24} />} 
                    label="Kết Nối" 
                    isActive={activeTab === 'family'} 
                    onClick={() => setActiveTab('family')}
                    color="green"
                 />
                 <ElderNavButton 
                    key="chat"
                    icon={<Bot size={24} />} 
                    label="Trợ Lý" 
                    isActive={activeTab === 'chat'} 
                    onClick={() => setActiveTab('chat')}
                    color="purple"
                 />
                 <ElderNavButton 
                    key="profile"
                    icon={<UserCircle size={24} />} 
                    label="Cài Đặt" 
                    isActive={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    color="slate"
                 />
             </div>
             
             {/* Global Overlays */}
             {showAlert && <AlertOverlay onClose={() => setShowAlert(false)} />}
             {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
             {incomingSOS && <SOSReceiveModal />}
        </div>
      );
  }

  // --- RELATIVE INTERFACE (Full Features) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex overflow-hidden">
      <NetworkStatus />
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-20 lg:w-72 flex-col border-r border-slate-200 bg-white z-30 transition-all duration-300 shadow-sm mt-safe">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Shield className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <div className="hidden lg:block ml-4">
            <h1 className="font-bold text-xl tracking-wide text-slate-900">TruthShield</h1>
            <p className="text-xs text-slate-500 font-medium">Người Quản Lý</p>
          </div>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-4">
          <NavSideItem icon={<Shield size={isSeniorMode ? 28 : 24} />} label="Tổng Quan" description="Theo dõi thiết bị" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} isSenior={isSeniorMode} />
          <NavSideItem icon={<Users size={isSeniorMode ? 28 : 24} />} label="Gia Đình" description="Quản lý kết nối" isActive={activeTab === 'family'} onClick={() => setActiveTab('family')} isSenior={isSeniorMode} />
          <NavSideItem icon={<MessageSquareText size={isSeniorMode ? 28 : 24} />} label="Kiểm Tra Tin" description="Phân tích lừa đảo" isActive={activeTab === 'message'} onClick={() => setActiveTab('message')} isSenior={isSeniorMode} />
          <NavSideItem icon={<BookOpen size={isSeniorMode ? 28 : 24} />} label="Thư Viện" description="Kiến thức lừa đảo" isActive={activeTab === 'library'} onClick={() => setActiveTab('library')} isSenior={isSeniorMode} />
          <NavSideItem icon={<Bot size={isSeniorMode ? 28 : 24} />} label="Trợ Lý AI" description="Hỏi đáp thông minh" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isSenior={isSeniorMode} />
          <NavSideItem icon={<UserCircle size={isSeniorMode ? 28 : 24} />} label="Cá Nhân" description="Tài khoản" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} isSenior={isSeniorMode} />
          
          <div className="pt-4 border-t border-slate-100 mt-4">
            <NavSideItem icon={<PlayCircle size={isSeniorMode ? 28 : 24} />} label="Hướng Dẫn" isActive={false} onClick={() => setShowTutorial(true)} isSenior={isSeniorMode} />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 bg-white/90 backdrop-blur-sm border-b border-slate-200 absolute top-0 left-0 right-0 z-20 shadow-sm mt-safe">
           <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">Người Quản Lý</span>
           </div>
           <button onClick={() => setShowTutorial(true)} className="p-2 text-slate-500">
              <PlayCircle size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-24 md:pb-0 mt-16 md:mt-0">
          <Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </Suspense>
        </div>

        {/* Mobile Dock for Guardian - Updated with Chat Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pb-6">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl px-2 py-2 shadow-xl shadow-slate-200/50 flex justify-between items-center">
            <NavButton icon={<Shield size={24} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} isSenior={isSeniorMode} />
            <NavButton icon={<Users size={24} />} label="Gia Đình" isActive={activeTab === 'family'} onClick={() => setActiveTab('family')} isSenior={isSeniorMode} />
            <NavButton icon={<Bot size={24} />} label="Chat AI" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isSenior={isSeniorMode} />
            <NavButton icon={<MessageSquareText size={24} />} label="Tin Nhắn" isActive={activeTab === 'message'} onClick={() => setActiveTab('message')} isSenior={isSeniorMode} />
            <NavButton icon={<BookOpen size={24} />} label="Thư Viện" isActive={activeTab === 'library'} onClick={() => setActiveTab('library')} isSenior={isSeniorMode} />
            <NavButton icon={<UserCircle size={24} />} label="Cá Nhân" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} isSenior={isSeniorMode} />
          </div>
        </div>
      </main>

      {showAlert && <AlertOverlay onClose={() => setShowAlert(false)} />}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {incomingSOS && <SOSReceiveModal />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

// --- Components ---

const ElderNavButton = React.memo(({ icon, label, isActive, onClick, color }: any) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        purple: 'text-purple-600 bg-purple-50',
        slate: 'text-slate-600 bg-slate-50',
        orange: 'text-orange-600 bg-orange-50',
        pink: 'text-pink-600 bg-pink-50'
    };
    
    return (
        <button 
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center transition-all ${isActive ? 'bg-slate-100' : 'bg-white'}`}
        >
            <div className={`p-1.5 rounded-xl mb-0.5 ${isActive ? (colorClasses[color as keyof typeof colorClasses] || 'bg-slate-200') : 'text-slate-400'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
        </button>
    )
});

const NavButton = React.memo(({ icon, label, isActive, onClick, isSenior }: any) => (
  <button 
    onClick={onClick}
    className={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 active:scale-90 ${
      isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className={`transition-transform duration-300 p-1.5 rounded-xl ${
      isActive ? 'bg-blue-50 -translate-y-1 scale-105 shadow-sm' : ''
    }`}>
      {icon}
    </div>
    <span className={`${isSenior ? 'text-xs' : 'text-[10px]'} font-bold mt-0.5 transition-opacity duration-300 ${isActive ? 'opacity-100 text-blue-700' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
));

const NavSideItem = React.memo(({ icon, label, description, isActive, onClick, isSenior }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
      isActive 
        ? 'bg-blue-50 text-blue-700 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    } ${isSenior ? 'py-5' : 'py-3'}`}
  >
    {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"></div>}
    <div className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </div>
    <div className="hidden lg:block text-left">
      <span className={`block font-bold ${isSenior ? 'text-lg' : 'text-base'}`}>{label}</span>
      <span className={`block ${isSenior ? 'text-base' : 'text-sm'} ${isActive ? 'text-blue-600/80' : 'text-slate-400'}`}>{description}</span>
    </div>
  </button>
));

export default App;
