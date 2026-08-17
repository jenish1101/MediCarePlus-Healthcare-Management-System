import { api } from '@/lib/api';
import { mapBed, BackendBed } from '@/lib/mappers';
import { Bed } from '@/types';

export type { BackendBed };
export { mapBed };

/** admin/receptionist/nurse. "Rooms" in the reception UI are the same resource. */
export function listBeds() {
  return api.get<BackendBed[]>('/beds');
}

export interface UpdateBedInput {
  status?: Bed['status'];
  patient_id?: string | null;
  patient_name?: string | null;
}

/** admin/receptionist. */
export function updateBed(id: string, updates: UpdateBedInput) {
  return api.patch<BackendBed>(`/beds/${id}`, updates);
}
