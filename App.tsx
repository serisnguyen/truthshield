import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Shield, Users, MessageSquareText, 
  ScanFace, Activity, Bot, PlayCircle, UserCircle, BookOpen, Loader2
} from 'lucide-react';
import AlertOverlay from './components/AlertOverlay';
import TutorialModal from './components/TutorialModal';
import { AuthProvider } from './context/AuthContext';

// Lazy Load Components for Performance
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const FamilyScreen = lazy(() => import('./components/FamilyScreen'));
const MessageGuard = lazy(() => import('./components/MessageGuard'));
const ChatScreen = lazy(() => import('./components/ChatScreen'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const ScamLibraryScreen = lazy(() => import('./components/ScamLibraryScreen'));

export type Tab = 'home' | 'message' | 'family' | 'chat' | 'profile' | 'library';

const LoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#F8FAFC]">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu an ninh...</p>
  </div>
);

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showAlert, setShowAlert] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    let timeoutId: any;
    const handleResize = () => {
      // Debounce resize event
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const triggerAlert = () => setShowAlert(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onTriggerAlert={triggerAlert} />;
      case 'message':
        return <MessageGuard />;
      case 'family':
        return <FamilyScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'library':
        return <ScamLibraryScreen />;
      default:
        return <HomeScreen onTriggerAlert={triggerAlert} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex overflow-hidden">
      
      {/* --- SIDEBAR (Desktop/Tablet) --- */}
      <aside className="hidden md:flex w-20 lg:w-72 flex-col border-r border-slate-200 bg-white z-30 transition-all duration-300 shadow-sm">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Shield className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <div className="hidden lg:block ml-4">
            <h1 className="font-bold text-xl tracking-wide text-slate-900">TruthShield</h1>
            <p className="text-xs text-slate-500 font-medium">Bảo Vệ Gia Đình</p>
          </div>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-4">
          <NavSideItem 
            icon={<ScanFace size={24} />} 
            label="Trang Chủ" 
            description="Quét & Giám sát"
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavSideItem 
            icon={<Bot size={24} />} 
            label="Hỏi Đáp AI" 
            description="Trợ lý ảo hỗ trợ"
            isActive={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavSideItem 
            icon={<Users size={24} />} 
            label="Người Thân" 
            description="Kết nối gia đình"
            isActive={activeTab === 'family'} 
            onClick={() => setActiveTab('family')} 
          />
          <NavSideItem 
            icon={<MessageSquareText size={24} />} 
            label="Kiểm Tra Tin Nhắn" 
            description="Phân tích lừa đảo"
            isActive={activeTab === 'message'} 
            onClick={() => setActiveTab('message')} 
          />
          <NavSideItem 
            icon={<BookOpen size={24} />} 
            label="Thư Viện Cảnh Báo" 
            description="Tìm hiểu thủ đoạn mới"
            isActive={activeTab === 'library'} 
            onClick={() => setActiveTab('library')} 
          />
          <NavSideItem 
            icon={<UserCircle size={24} />} 
            label="Cá Nhân" 
            description="Tài khoản & Cài đặt"
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
           <div className="pt-4 border-t border-slate-100 mt-4">
            <NavSideItem 
              icon={<PlayCircle size={24} />} 
              label="Hướng Dẫn Sử Dụng" 
              description="Video hướng dẫn"
              isActive={false} 
              onClick={() => setShowTutorial(true)} 
            />
           </div>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center lg:text-left flex items-center gap-3">
               <div className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </div>
               <div>
                  <span className="block text-sm font-bold text-slate-700">Đang hoạt động</span>
                  <p className="hidden lg:block text-xs text-slate-500">Phiên bản mới nhất</p>
               </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center justify-between px-4 bg-white/90 backdrop-blur-sm border-b border-slate-200 absolute top-0 left-0 right-0 z-20 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-slate-800 tracking-tight">TruthShield</span>
           </div>
           <button 
            onClick={() => setShowTutorial(true)}
            className="px-3 py-2 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-600 active:bg-slate-200 transition-all active:scale-95"
           >
              <PlayCircle size={18} className="text-blue-600" /> Hướng dẫn
           </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-28 md:pb-0">
          <Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </Suspense>
        </div>

        {/* Mobile Bottom Dock (Floating) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pb-6">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl px-2 py-2 shadow-xl shadow-slate-200/50 flex justify-between items-center">
            <NavButton 
              icon={<ScanFace size={26} />} 
              label="Quét" 
              isActive={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <NavButton 
              icon={<Bot size={26} />} 
              label="Hỏi Đáp" 
              isActive={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
            />
            <NavButton 
              icon={<Users size={26} />} 
              label="Gia Đình" 
              isActive={activeTab === 'family'} 
              onClick={() => setActiveTab('family')} 
            />
            <NavButton 
              icon={<MessageSquareText size={26} />} 
              label="Tin Nhắn" 
              isActive={activeTab === 'message'} 
              onClick={() => setActiveTab('message')} 
            />
            <NavButton 
              icon={<BookOpen size={26} />} 
              label="Thư Viện" 
              isActive={activeTab === 'library'} 
              onClick={() => setActiveTab('library')} 
            />
            <NavButton 
              icon={<UserCircle size={26} />} 
              label="Cá Nhân" 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
          </div>
        </div>
      </main>

      {/* Global Overlays */}
      {showAlert && <AlertOverlay onClose={() => setShowAlert(false)} />}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// --- Sub Components ---

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
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
    <span className={`text-[10px] font-bold mt-0.5 transition-opacity duration-300 ${isActive ? 'opacity-100 text-blue-700' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
);

const NavSideItem: React.FC<NavButtonProps> = ({ icon, label, description, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
      isActive 
        ? 'bg-blue-50 text-blue-700 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full"></div>}
    
    <div className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
      {icon}
    </div>
    <div className="hidden lg:block text-left">
      <span className="block font-bold text-base">{label}</span>
      <span className={`block text-sm ${isActive ? 'text-blue-600/80' : 'text-slate-400'}`}>{description}</span>
    </div>
  </button>
);

export default App;