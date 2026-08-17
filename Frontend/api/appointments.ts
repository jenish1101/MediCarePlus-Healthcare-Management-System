import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { mapAppointment, BackendAppointment } from '@/lib/mappers';

export type { BackendAppointment };
export { mapAppointment };

/** Scoped server-side to the caller's own appointments for patient/doctor; all appointments for staff roles. */
export function listAppointments() {
  return api.get<BackendAppointment[]>('/appointments');
}

export function getAppointment(id: string) {
  return api.get<BackendAppointment>(`/appointments/${id}`);
}

export interface CreateAppointmentInput {
  doctor_id: string;
  date: string;
  time: string;
  reason: string;
  appointment_type?: Appointment['type'];
  /** Omit when a patient is booking for themselves; required when staff books on a patient's behalf. */
  patient_id?: string;
}

export function createAppointment(body: CreateAppointmentInput) {
  return api.post<BackendAppointment>('/appointments', body);
}

export interface UpdateAppointmentInput {
  date?: string;
  time?: string;
  status?: Appointment['status'];
  reason?: string;
  appointment_type?: Appointment['type'];
}

export function updateAppointment(id: string, updates: UpdateAppointmentInput) {
  return api.patch<BackendAppointment>(`/appointments/${id}`, updates);
}

export function cancelAppointment(id: string) {
  return api.delete(`/appointments/${id}`);
}
