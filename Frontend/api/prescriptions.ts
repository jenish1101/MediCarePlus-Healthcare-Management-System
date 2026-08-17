import { api } from '@/lib/api';
import { mapPrescription, BackendPrescription } from '@/lib/mappers';
import { Medicine } from '@/types';

export type { BackendPrescription };
export { mapPrescription };

/** Scoped server-side: a patient's own, or a doctor's own written prescriptions. */
export function listPrescriptions() {
  return api.get<BackendPrescription[]>('/prescriptions');
}

export interface CreatePrescriptionInput {
  patient_id: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
  date?: string;
}

/** Doctor only. */
export function createPrescription(body: CreatePrescriptionInput) {
  return api.post<BackendPrescription>('/prescriptions', body);
}
