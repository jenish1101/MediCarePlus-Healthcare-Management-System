import { api } from '@/lib/api';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetRoles: string[];
  createdAt: string;
  status: 'active' | 'archived';
}

export interface BackendAnnouncement {
  id: string;
  title: string;
  message: string;
  target_roles: string[];
  created_at: string;
  status: string;
}

export function mapAnnouncement(a: BackendAnnouncement): Announcement {
  return {
    id: a.id,
    title: a.title,
    message: a.message,
    targetRoles: a.target_roles,
    createdAt: a.created_at ? a.created_at.split('T')[0] : '',
    status: a.status as Announcement['status']
  };
}

/** Public. */
export function listAnnouncements(role?: string) {
  return api.get<BackendAnnouncement[]>('/announcements', role ? { role } : undefined);
}

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  target_roles: string[];
}

/** admin only. */
export function createAnnouncement(body: CreateAnnouncementInput) {
  return api.post<BackendAnnouncement>('/announcements', body);
}

export function archiveAnnouncement(id: string) {
  return api.patch<BackendAnnouncement>(`/announcements/${id}/archive`);
}
