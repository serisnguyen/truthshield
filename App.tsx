import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, MessageSquareText, 
  ScanFace, Activity, Bot, PlayCircle
} from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import FamilyScreen from './components/FamilyScreen';
import MessageGuard from './components/MessageGuard';
import ChatScreen from './components/ChatScreen';
import AlertOverlay from './components/AlertOverlay';
import TutorialModal from './components/TutorialModal';

export type Tab = 'home' | 'message' | 'family' | 'chat';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showAlert, setShowAlert] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        <div className="md:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-slate-200 absolute top-0 left-0 right-0 z-20 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Shield className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-slate-800">TruthShield</span>
           </div>
           <button 
            onClick={() => setShowTutorial(true)}
            className="px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-600 active:bg-slate-200 transition-all"
           >
              <PlayCircle size={16} className="text-blue-600" /> Hướng dẫn
           </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative pb-24 md:pb-0">
          {renderContent()}
        </div>

        {/* Mobile Bottom Dock (Floating) */}
        <div className="md:hidden absolute bottom-6 left-4 right-4 z-30">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl px-2 py-3 shadow-xl shadow-slate-200 flex justify-between items-center">
            <NavButton 
              icon={<ScanFace size={24} />} 
              label="Quét" 
              isActive={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <NavButton 
              icon={<Bot size={24} />} 
              label="Hỏi Đáp" 
              isActive={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
            />
            <NavButton 
              icon={<Users size={24} />} 
              label="Gia Đình" 
              isActive={activeTab === 'family'} 
              onClick={() => setActiveTab('family')} 
            />
             <NavButton 
              icon={<MessageSquareText size={24} />} 
              label="Tin Nhắn" 
              isActive={activeTab === 'message'} 
              onClick={() => setActiveTab('message')} 
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
    className={`relative flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-300 ${
      isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className={`transition-transform duration-300 p-2 rounded-xl ${
      isActive ? 'bg-blue-50 -translate-y-2 scale-110 shadow-md shadow-blue-100' : ''
    }`}>
      {icon}
    </div>
    <span className={`text-[11px] font-bold mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100 text-blue-700' : 'opacity-0 h-0 overflow-hidden'}`}>
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