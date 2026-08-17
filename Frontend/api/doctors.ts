import { api } from '@/lib/api';
import { mapDoctor, BackendDoctor } from '@/lib/mappers';

export type { BackendDoctor };
export { mapDoctor };

/** Public directory of doctors. */
export function listDoctors(filters?: { search?: string; specialization?: string }) {
  return api.get<BackendDoctor[]>('/doctors', filters);
}

export interface BackendAvailability {
  availability_days: string[];
  availability_slots: string[];
}

export function getMyAvailability() {
  return api.get<BackendAvailability>('/doctors/me/availability');
}

export function updateMyAvailability(body: BackendAvailability) {
  return api.put<BackendAvailability>('/doctors/me/availability', body);
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
}

export interface EarningsTransaction {
  id: string;
  patient_name: string;
  date: string;
  appointment_type: string;
  amount: number;
}

export interface EarningsSummary {
  total_earnings: number;
  this_month: number;
  pending_payout: number;
  avg_per_consult: number;
  monthly: MonthlyEarning[];
  transactions: EarningsTransaction[];
}

export function getMyEarnings() {
  return api.get<EarningsSummary>('/doctors/me/earnings');
}
