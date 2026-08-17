import { api } from '@/lib/api';
import { User, UserRole } from '@/types';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface BackendUserPublic {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  is_active: boolean;
}

export function mapCurrentUser(u: BackendUserPublic): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
  };
}

export function login(email: string, password: string, role: UserRole) {
  return api.post<TokenResponse>('/auth/login', { email, password, role });
}

export function signup(data: { name: string; email: string; password: string; phone?: string }) {
  return api.post<TokenResponse>('/auth/signup', data);
}

export function refresh(refreshToken: string) {
  return api.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken });
}

export function getMe() {
  return api.get<BackendUserPublic>('/auth/me');
}

export function logout() {
  return api.post('/auth/logout');
}
