import { api } from '@/lib/api';

/**
 * The backend's /analytics/summary is a loosely-typed dict with no fixed
 * schema — consume every field defensively with optional chaining/fallbacks.
 * Known fields as of writing: total_users, total_appointments,
 * bed_occupancy: { occupied, total }, departments.
 */
export interface AnalyticsSummary {
  total_users?: number;
  total_appointments?: number;
  bed_occupancy?: { occupied?: number; total?: number };
  departments?: number;
}

/** admin only. */
export function getAnalyticsSummary() {
  return api.get<Record<string, unknown>>('/analytics/summary');
}
