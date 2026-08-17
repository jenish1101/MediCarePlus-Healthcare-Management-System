import { api } from '@/lib/api';

export interface BackendNotification {
  id: string;
  icon: string;
  color: string;
  title: string;
  message: string;
  time_label: string;
  unread: boolean;
  category?: string;
}

/** Any authenticated role. */
export function listNotifications() {
  return api.get<BackendNotification[]>('/notifications');
}

export function markNotificationRead(id: string) {
  return api.post(`/notifications/${id}/read`);
}

export function markAllNotificationsRead() {
  return api.post('/notifications/read-all');
}
