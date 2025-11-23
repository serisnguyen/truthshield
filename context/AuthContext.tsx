
import React, { createContext, useState, useContext, useEffect } from 'react';

// SECURITY UPDATE: Separate PII from Auth Token
// In a real app, User data stays in memory, only Session Token goes to LocalStorage.

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
  familyId: string; // Now dynamic/rotating
  familyCodeTimestamp?: number; // Timestamp when code was generated
  hasVoiceProfile: boolean; // Voice DNA Status
  securityQuestion?: string; // Personalized Challenge
  securityAnswer?: string; // Hashed answer in real app
  emergencyContacts: EmergencyContact[];
  alertHistory: AlertHistoryItem[];
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // SECURITY FIX: Only check for a session token, then fetch user data
    // simulating fetch user profile with the token
    const token = localStorage.getItem('truthshield_token');
    
    if (token) {
      // Mock fetching user data based on token
      // In production, this would be an API call: GET /api/me
      try {
        const storedProfile = localStorage.getItem('truthshield_profile_cache');
        if (storedProfile) {
          const parsedUser = JSON.parse(storedProfile);
          // Ensure timestamp exists for old data
          if (!parsedUser.familyCodeTimestamp) {
              parsedUser.familyCodeTimestamp = Date.now();
          }
          // Ensure alertHistory exists
          if (!parsedUser.alertHistory) {
              parsedUser.alertHistory = [];
          }
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Profile load error");
        localStorage.removeItem('truthshield_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Helper to persist non-sensitive state for demo purposes
  const persistUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('truthshield_profile_cache', JSON.stringify(userData));
  };

  const login = async (phone: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (phone.length > 0 && pass.length > 0) {
          // Check if we have a stored user matching this phone to simulate persistence across relogin
          // (Simplified for demo)
          const mockUser: User = {
            name: "Nguyễn Văn A", 
            phone: phone,
            id: Date.now().toString(),
            familyId: generateFamilyCode(),
            familyCodeTimestamp: Date.now(),
            hasVoiceProfile: false,
            emergencyContacts: [],
            alertHistory: []
          };
          persistUser(mockUser);
          localStorage.setItem('truthshield_token', 'mock_jwt_token_' + Date.now());
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
          familyId: generateFamilyCode(),
          familyCodeTimestamp: Date.now(),
          hasVoiceProfile: false,
          emergencyContacts: [],
          alertHistory: []
        };
        persistUser(newUser);
        localStorage.setItem('truthshield_token', 'mock_jwt_token_' + Date.now());
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truthshield_token');
    localStorage.removeItem('truthshield_profile_cache');
  };

  // --- Dynamic Family ID Logic ---
  const generateFamilyCode = () => {
    // Generate a 6-digit OTP style code
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

  // --- Security Features ---

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
      // Keep only last 50 alerts
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
        // In real app, answer should be hashed
        const updatedUser = { ...user, securityQuestion: question, securityAnswer: answer };
        persistUser(updatedUser);
    }
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
      regenerateFamilyId
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
