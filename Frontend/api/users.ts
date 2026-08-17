import { api } from '@/lib/api';
import { UserRole } from '@/types';
import { BackendUserPublic } from '@/api/auth';

export type BackendUser = BackendUserPublic & { created_at?: string };

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joined: string;
  phone?: string;
  avatar?: string;
}

export function mapSystemUser(u: BackendUser): SystemUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.is_active ? 'active' : 'inactive',
    joined: u.created_at ? u.created_at.split('T')[0] : '',
    phone: u.phone,
    avatar: u.avatar
  };
}

export interface PatientSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  lastVisit?: string;
}

export interface BackendPatientSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  blood_group?: string | null;
  last_visit?: string | null;
}

export function mapPatientSummary(p: BackendPatientSummary): PatientSummary {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone ?? undefined,
    dateOfBirth: p.date_of_birth ?? undefined,
    bloodGroup: p.blood_group ?? undefined,
    lastVisit: p.last_visit ?? undefined
  };
}

/** Doctor/receptionist/nurse/admin — directory of patients, optionally searched. */
export function listPatients(search?: string) {
  return api.get<BackendPatientSummary[]>('/users/patients', search ? { search } : undefined);
}

/** Admin only. */
export function listUsers(filters?: { role?: string; search?: string }) {
  return api.get<BackendUser[]>('/users', filters);
}

export function createUser(body: { email: string; password: string; name: string; role: UserRole; phone?: string }) {
  return api.post<BackendUser>('/users', body);
}

export function getUser(id: string) {
  return api.get<BackendUser>(`/users/${id}`);
}

export function updateUser(id: string, updates: { name?: string; phone?: string; avatar?: string; is_active?: boolean }) {
  return api.patch<BackendUser>(`/users/${id}`, updates);
}

export function deleteUser(id: string) {
  return api.delete(`/users/${id}`);
}

/** Any authenticated user, updating their own profile. */
export function updateMyProfile(updates: { name?: string; phone?: string; avatar?: string }) {
  return api.patch<BackendUserPublic>('/users/me/profile', updates);
}
