import { api } from '@/lib/api';

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  specialist: string;
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent';
  status: 'pending' | 'accepted' | 'completed';
  date: string;
}

export interface BackendReferral {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  specialist: string;
  specialty: string;
  reason: string;
  urgency: string;
  status: string;
  date: string;
}

export function mapReferral(r: BackendReferral): Referral {
  return {
    id: r.id,
    patientId: r.patient_id,
    patientName: r.patient_name,
    specialist: r.specialist,
    specialty: r.specialty,
    reason: r.reason,
    urgency: r.urgency as Referral['urgency'],
    status: r.status as Referral['status'],
    date: r.date
  };
}

/** Doctor only — their own referrals. */
export function listReferrals() {
  return api.get<BackendReferral[]>('/referrals');
}

export interface CreateReferralInput {
  patient_id: string;
  patient_name: string;
  specialist: string;
  specialty: string;
  reason: string;
  urgency?: 'routine' | 'urgent';
  date: string;
}

export function createReferral(body: CreateReferralInput) {
  return api.post<BackendReferral>('/referrals', body);
}
