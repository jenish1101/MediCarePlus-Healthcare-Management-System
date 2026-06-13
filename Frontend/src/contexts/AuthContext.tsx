import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  'patient@demo.com': {
    id: 'p1',
    name: 'John Patient',
    email: 'patient@demo.com',
    role: 'patient',
    phone: '+1234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  'doctor@demo.com': {
    id: 'd1',
    name: 'Dr. Sarah Wilson',
    email: 'doctor@demo.com',
    role: 'doctor',
    phone: '+1234567891',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  'admin@demo.com': {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin',
    phone: '+1234567892',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  'pharmacist@demo.com': {
    id: 'ph1',
    name: 'Mike Pharmacist',
    email: 'pharmacist@demo.com',
    role: 'pharmacist',
    phone: '+1234567893',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
  },
  'lab@demo.com': {
    id: 'l1',
    name: 'Lab Technician',
    email: 'lab@demo.com',
    role: 'lab_tech',
    phone: '+1234567894',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lab'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, _password: string, role: UserRole) => {
    // Mock login - in production, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
