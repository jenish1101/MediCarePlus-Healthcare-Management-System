'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { getAccessToken, setTokens, clearTokens } from '@/lib/authToken';
import * as authApi from '@/api/auth';
import * as usersApi from '@/api/users';
import { mapCurrentUser } from '@/api/auth';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!getAccessToken());

  // On mount, if we have a stored access token, validate it against the API
  // and hydrate the current user. Tokens (not the user object) are the
  // source of truth for persisted auth state across reloads.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    authApi
      .getMe()
      .then((me) => setUser(mapCurrentUser(me)))
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const tokens = await authApi.login(email, password, role);
    setTokens(tokens.access_token, tokens.refresh_token);
    const me = await authApi.getMe();
    setUser(mapCurrentUser(me));
  };

  const signup = async (data: SignupData) => {
    const tokens = await authApi.signup(data);
    setTokens(tokens.access_token, tokens.refresh_token);
    const me = await authApi.getMe();
    setUser(mapCurrentUser(me));
  };

  const logout = () => {
    authApi.logout().catch(() => {
      // best-effort — the backend doesn't invalidate tokens server-side anyway
    });
    clearTokens();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) => {
    const me = await usersApi.updateMyProfile(updates);
    setUser(mapCurrentUser(me));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isAuthenticated: !!user, isLoading }}>
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
