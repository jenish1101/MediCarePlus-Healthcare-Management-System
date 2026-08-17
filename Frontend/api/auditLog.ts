import { api } from '@/lib/api';

export interface AuditEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'user' | 'settings' | 'security' | 'billing';
}

export interface BackendAuditEntry {
  id: string;
  user_name: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  category: string;
}

export function mapAuditEntry(e: BackendAuditEntry): AuditEntry {
  return {
    id: e.id,
    user: e.user_name,
    role: e.role,
    action: e.action,
    target: e.target,
    timestamp: e.timestamp,
    category: e.category as AuditEntry['category']
  };
}

/** admin only. */
export function listAuditLog() {
  return api.get<BackendAuditEntry[]>('/audit-log');
}
