import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  name: string;
  phone: string;
  id: string;
  familyId: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, pass: string) => Promise<void>;
  register: (name: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage for session
    const storedUser = localStorage.getItem('truthshield_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, pass: string) => {
    // Simulate API Request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (phone.length > 0 && pass.length > 0) {
          const mockUser: User = {
            name: "Nguyễn Văn A", // In a real app, this would come from DB
            phone: phone,
            id: Date.now().toString(),
            familyId: "FAMILY-8829"
          };
          setUser(mockUser);
          localStorage.setItem('truthshield_user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject("Thông tin đăng nhập không hợp lệ");
        }
      }, 800);
    });
  };

  const register = async (name: string, phone: string, pass: string) => {
    // Simulate API Request
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          name: name,
          phone: phone,
          id: Date.now().toString(),
          familyId: "FAMILY-" + Math.floor(1000 + Math.random() * 9000)
        };
        setUser(newUser);
        localStorage.setItem('truthshield_user', JSON.stringify(newUser));
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truthshield_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
