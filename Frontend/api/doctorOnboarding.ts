import { api } from '@/lib/api';

export interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualifications: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BackendPendingDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience?: number;
  qualifications?: string[];
  submitted_at?: string;
  onboarding_status: string;
}

export function mapPendingDoctor(d: BackendPendingDoctor): PendingDoctor {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    specialization: d.specialization,
    experience: d.experience ?? 0,
    qualifications: d.qualifications ?? [],
    submittedAt: d.submitted_at ?? '',
    status: d.onboarding_status as PendingDoctor['status']
  };
}

/** admin only. */
export function listDoctorOnboarding() {
  return api.get<BackendPendingDoctor[]>('/doctor-onboarding');
}

/** NOTE: the backend only exposes approve, no reject — a "reject" action must stay local-only in the UI. */
export function approveDoctorOnboarding(id: string) {
  return api.post(`/doctor-onboarding/${id}/approve`);
}
