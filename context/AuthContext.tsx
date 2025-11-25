
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  EmergencyContact, 
  AlertHistoryItem, 
  MessageAnalysisLog, 
  FamilyVoiceProfile, 
  CallLogItem 
} from '../types';
import { useUserProfile } from '../hooks/useUserProfile';

// Re-export types so other components don't break
export * from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  incomingSOS: boolean;
  setIncomingSOS: (status: boolean) => void;
  isSeniorMode: boolean;
  login: (phone: string, pass: string) => Promise<void>;
  register: (name: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  toggleSeniorMode: () => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  addFamilyVoiceProfile: (profile: Omit<FamilyVoiceProfile, 'id' | 'timestamp'>) => void;
  addAlertToHistory: (alert: Omit<AlertHistoryItem, 'id' | 'timestamp'>) => void;
  clearAlertHistory: () => void;
  addMessageAnalysis: (log: Omit<MessageAnalysisLog, 'id' | 'timestamp'>) => void;
  clearMessageHistory: () => void;
  updateMessageHistoryItem: (id: string, result: 'safe' | 'suspicious' | 'scam', explanation: string) => void;
  updateSecurityQuestions: (questions: string[]) => void;
  setVoiceProfileStatus: (status: boolean) => void;
  regenerateFamilyId: () => void;
  updateSOSMessage: (message: string) => void;
  updateCallHistoryItem: (callId: string, analysis: CallLogItem['aiAnalysis']) => void;
  isOnline: boolean;
  lastOnlineTime: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const simpleHash = (str: string): string => {
  try {
    const utf8Bytes = encodeURIComponent(str + "_salt_v1").replace(/%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8Bytes).split('').reverse().join('');
  } catch (e) {
    console.error("Hashing error", e);
    return "HASH_ERROR_FALLBACK_9999";
  }
};

// Mock Call History Data (Same as before)
const mockCallHistory: CallLogItem[] = [
  { 
    id: '1', 
    phoneNumber: '0901234567', 
    contactName: 'Con trai (Hùng)', 
    timestamp: Date.now() - 3600000, 
    direction: 'incoming', 
    duration: 120, 
    riskStatus: 'safe',
    aiAnalysis: {
        riskScore: 5,
        explanation: "Hệ thống đã quét thời gian thực: Giọng nói khớp với Voice DNA. An toàn.",
        timestamp: Date.now() - 3600000
    }
  },
  { 
    id: '2', 
    phoneNumber: '0988888888', 
    contactName: undefined, 
    timestamp: Date.now() - 86400000, 
    direction: 'incoming', 
    duration: 45, 
    riskStatus: 'scam',
    aiAnalysis: {
        riskScore: 88,
        explanation: "Phát hiện trong cuộc gọi: Từ khóa 'chuyển khoản', giọng nói AI giả mạo.",
        timestamp: Date.now() - 86400000
    }
  },
  { 
    id: '3', 
    phoneNumber: '0912345678', 
    contactName: 'Cháu Lan', 
    timestamp: Date.now() - 172800000, 
    direction: 'outgoing', 
    duration: 300, 
    riskStatus: 'safe',
    aiAnalysis: {
        riskScore: 2,
        explanation: "Cuộc gọi đi tới số người thân đã xác thực an toàn.",
        timestamp: Date.now() - 172800000
    }
  },
  { 
    id: '4', 
    phoneNumber: '0247777777', 
    contactName: undefined, 
    timestamp: Date.now() - 200000000, 
    direction: 'incoming', 
    duration: 5, 
    riskStatus: 'suspicious',
    aiAnalysis: {
        riskScore: 45,
        explanation: "Cảnh báo: Cuộc gọi nháy máy từ số rác (Spam).",
        timestamp: Date.now() - 200000000
    }
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [incomingSOS, setIncomingSOS] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now());

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        setLastOnlineTime(Date.now());
    };
    const handleOffline = () => {
        setIsOnline(false);
        setLastOnlineTime(Date.now());
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('truthshield_token');
    const savedRole = localStorage.getItem('truthshield_role') as UserRole;
    
    if (savedRole) {
        setRoleState(savedRole);
        if (savedRole === 'elder') setIsSeniorMode(true);
        else setIsSeniorMode(false);
    }

    if (token) {
      try {
        const storedProfile = localStorage.getItem('truthshield_profile_cache');
        if (storedProfile) {
          const parsedUser = JSON.parse(storedProfile);
          // Migration & Defaults
          if (!parsedUser.familyCodeTimestamp) parsedUser.familyCodeTimestamp = Date.now();
          if (!parsedUser.alertHistory) parsedUser.alertHistory = [];
          if (!parsedUser.messageHistory) parsedUser.messageHistory = [];
          if (!parsedUser.securityQuestions) parsedUser.securityQuestions = [];
          if (!parsedUser.familyVoiceProfiles) parsedUser.familyVoiceProfiles = [];
          
          if (!parsedUser.callHistory || parsedUser.callHistory.length === 0 || !parsedUser.callHistory[0].aiAnalysis) {
              parsedUser.callHistory = mockCallHistory;
          }
          
          if (!parsedUser.sosMessage) parsedUser.sosMessage = "Cha/Mẹ đang gặp nguy hiểm! Cần giúp đỡ ngay!";
          if (!parsedUser.role) parsedUser.role = savedRole || 'relative';
          
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Profile load error");
        localStorage.removeItem('truthshield_token');
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('truthshield_profile_cache', JSON.stringify(userData));
  };

  const setRole = (newRole: UserRole) => {
      setRoleState(newRole);
      
      if (newRole) {
          localStorage.setItem('truthshield_role', newRole);
          if (newRole === 'elder') setIsSeniorMode(true);
          else setIsSeniorMode(false);
          
          if (user) {
              persistUser({ ...user, role: newRole });
          }
      } else {
          localStorage.removeItem('truthshield_role');
      }
  };

  const toggleSeniorMode = () => {
    const newMode = !isSeniorMode;
    setIsSeniorMode(newMode);
  };

  const generateFamilyCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Import logic from custom hook
  const userActions = useUserProfile({ user, persistUser });

  const login = async (phone: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (phone.length > 0 && pass.length > 0) {
          const storedProfile = localStorage.getItem('truthshield_profile_cache');
          let finalUser: User | null = null;

          if (storedProfile) {
             const u = JSON.parse(storedProfile);
             if (u.phone === phone) {
                 if (u.passwordHash && u.passwordHash !== simpleHash(pass)) {
                     reject("Mật khẩu không đúng");
                     return;
                 }
                 finalUser = u;
             }
          }

          if (!finalUser) {
            finalUser = {
              name: "Người dùng mới",
              phone: phone,
              id: Date.now().toString(),
              role: role,
              familyId: generateFamilyCode(),
              familyCodeTimestamp: Date.now(),
              hasVoiceProfile: false,
              familyVoiceProfiles: [],
              emergencyContacts: [],
              alertHistory: [],
              messageHistory: [],
              callHistory: mockCallHistory,
              sosMessage: "Cha/Mẹ đang gặp nguy hiểm! Cần giúp đỡ ngay!",
              securityQuestions: [],
              passwordHash: simpleHash(pass)
            };
          } else {
              finalUser.role = role;
              if (!finalUser.callHistory || finalUser.callHistory.length === 0) finalUser.callHistory = mockCallHistory;
              if (!finalUser.messageHistory) finalUser.messageHistory = [];
              if (!finalUser.sosMessage) finalUser.sosMessage = "Cha/Mẹ đang gặp nguy hiểm! Cần giúp đỡ ngay!";
          }
            
          persistUser(finalUser);
          localStorage.setItem('truthshield_token', 'mock_jwt_' + Date.now());
          resolve();
          
        } else {
          reject("Thông tin đăng nhập không hợp lệ");
        }
      }, 800);
    });
  };

  const register = async (name: string, phone: string, pass: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          name: name,
          phone: phone,
          id: Date.now().toString(),
          role: role,
          familyId: generateFamilyCode(),
          familyCodeTimestamp: Date.now(),
          hasVoiceProfile: false,
          familyVoiceProfiles: [],
          emergencyContacts: [],
          alertHistory: [],
          messageHistory: [],
          callHistory: mockCallHistory,
          sosMessage: "Cha/Mẹ đang gặp nguy hiểm! Cần giúp đỡ ngay!",
          securityQuestions: [],
          passwordHash: simpleHash(pass)
        };
        persistUser(newUser);
        localStorage.setItem('truthshield_token', 'mock_jwt_' + Date.now());
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truthshield_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, role, setRole, login, register, logout, isLoading, isSeniorMode, toggleSeniorMode,
      incomingSOS, setIncomingSOS,
      ...userActions,
      regenerateFamilyId: () => userActions.regenerateFamilyId(generateFamilyCode),
      isOnline,
      lastOnlineTime
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
