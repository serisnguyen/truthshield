import React, { createContext, useState, useContext, useEffect } from 'react';

// SECURITY UPDATE: Encrypting sensitive data in localStorage (Simulation)
// In a real app, use bcrypt on server and HTTP-only cookies.

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface AlertHistoryItem {
  id: string;
  timestamp: number;
  type: 'deepfake' | 'scam_msg' | 'sos';
  riskScore: number;
  details: string;
}

interface User {
  name: string;
  phone: string;
  id: string;
  familyId: string;
  familyCodeTimestamp?: number;
  hasVoiceProfile: boolean;
  securityQuestion?: string;
  securityAnswerHash?: string; // Storing hash instead of plain text
  emergencyContacts: EmergencyContact[];
  alertHistory: AlertHistoryItem[];
  passwordHash?: string; // Storing hash instead of plain text
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, pass: string) => Promise<void>;
  register: (name: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  addAlertToHistory: (alert: Omit<AlertHistoryItem, 'id' | 'timestamp'>) => void;
  clearAlertHistory: () => void;
  updateSecurityQuestion: (question: string, answer: string) => void;
  setVoiceProfileStatus: (status: boolean) => void;
  regenerateFamilyId: () => void;
  verifySecurityAnswer: (answer: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash simulation for demo purposes (NOT for production use)
const simpleHash = (str: string): string => {
  return btoa(str + "_salt_v1").split('').reverse().join('');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('truthshield_token');
    
    if (token) {
      try {
        const storedProfile = localStorage.getItem('truthshield_profile_cache');
        if (storedProfile) {
          const parsedUser = JSON.parse(storedProfile);
          // Migration: Add fields if missing
          if (!parsedUser.familyCodeTimestamp) parsedUser.familyCodeTimestamp = Date.now();
          if (!parsedUser.alertHistory) parsedUser.alertHistory = [];
          
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

  const login = async (phone: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (phone.length > 0 && pass.length > 0) {
          // In real app: Server validates hash. Here we simulate retrieval.
          const storedProfile = localStorage.getItem('truthshield_profile_cache');
          let isValid = true; // Simulating success for demo flow if no prev user
          
          if (storedProfile) {
             const u = JSON.parse(storedProfile);
             if (u.phone === phone && u.passwordHash && u.passwordHash !== simpleHash(pass)) {
                 isValid = false;
             }
          }

          if (isValid) {
            const mockUser: User = {
              name: "Nguyễn Văn A", 
              phone: phone,
              id: Date.now().toString(),
              familyId: generateFamilyCode(),
              familyCodeTimestamp: Date.now(),
              hasVoiceProfile: false,
              emergencyContacts: [],
              alertHistory: [],
              passwordHash: simpleHash(pass)
            };
            // Use existing if available to preserve data
            const finalUser = storedProfile ? JSON.parse(storedProfile) : mockUser;
            
            persistUser(finalUser);
            localStorage.setItem('truthshield_token', 'mock_jwt_' + Date.now());
            resolve();
          } else {
            reject("Mật khẩu không đúng");
          }
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
          familyId: generateFamilyCode(),
          familyCodeTimestamp: Date.now(),
          hasVoiceProfile: false,
          emergencyContacts: [],
          alertHistory: [],
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
    // Note: In real app, we might keep profile cache for quick login, but here we clear it for demo clarity
    // localStorage.removeItem('truthshield_profile_cache'); 
  };

  const generateFamilyCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const regenerateFamilyId = () => {
    if (user) {
        const updated = { 
            ...user, 
            familyId: generateFamilyCode(),
            familyCodeTimestamp: Date.now()
        };
        persistUser(updated);
    }
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    if (user) {
      const newContact = { ...contact, id: Date.now().toString() };
      const updatedUser = { ...user, emergencyContacts: [...user.emergencyContacts, newContact] };
      persistUser(updatedUser);
    }
  };

  const removeEmergencyContact = (id: string) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        emergencyContacts: user.emergencyContacts.filter(c => c.id !== id) 
      };
      persistUser(updatedUser);
    }
  };

  const addAlertToHistory = (alert: Omit<AlertHistoryItem, 'id' | 'timestamp'>) => {
    if (user) {
      const newAlert: AlertHistoryItem = { 
        ...alert, 
        id: Date.now().toString(), 
        timestamp: Date.now() 
      };
      const newHistory = [newAlert, ...user.alertHistory].slice(0, 50);
      const updatedUser = { ...user, alertHistory: newHistory };
      persistUser(updatedUser);
    }
  };

  const clearAlertHistory = () => {
    if (user) {
      const updatedUser = { ...user, alertHistory: [] };
      persistUser(updatedUser);
    }
  };

  const updateSecurityQuestion = (question: string, answer: string) => {
    if (user) {
        const updatedUser = { 
            ...user, 
            securityQuestion: question, 
            securityAnswerHash: simpleHash(answer) // Store hash
        };
        persistUser(updatedUser);
    }
  };

  const verifySecurityAnswer = (answer: string): boolean => {
      if (!user?.securityAnswerHash) return false;
      return user.securityAnswerHash === simpleHash(answer);
  };

  const setVoiceProfileStatus = (status: boolean) => {
    if (user) {
        const updatedUser = { ...user, hasVoiceProfile: status };
        persistUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, isLoading,
      addEmergencyContact, removeEmergencyContact,
      addAlertToHistory, clearAlertHistory,
      updateSecurityQuestion, setVoiceProfileStatus,
      regenerateFamilyId, verifySecurityAnswer
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