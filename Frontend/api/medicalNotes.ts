import { api } from '@/lib/api';

export interface BackendNote {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string | null;
  title: string;
  content: string;
  vitals?: Record<string, unknown> | null;
  created_at: string;
}

/** Doctor/admin/nurse. Pass patientId to scope to one patient's notes. */
export function listMedicalNotes(patientId?: string) {
  return api.get<BackendNote[]>('/medical-notes', patientId ? { patient_id: patientId } : undefined);
}

export interface CreateMedicalNoteInput {
  patient_id: string;
  title: string;
  content: string;
  appointment_id?: string;
  vitals?: Record<string, unknown>;
}

/** Doctor only. */
export function createMedicalNote(body: CreateMedicalNoteInput) {
  return api.post<BackendNote>('/medical-notes', body);
}
