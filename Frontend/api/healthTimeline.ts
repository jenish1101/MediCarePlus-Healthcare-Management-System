import { api } from '@/lib/api';

export interface BackendTimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  status?: string;
}

/** Patient only — their own combined appointments/prescriptions/lab-reports feed. */
export function getMyHealthTimeline() {
  return api.get<BackendTimelineEvent[]>('/health-timeline');
}
