import { api } from '@/lib/api';

export interface CareTask {
  id: string;
  patient: string;
  room: string;
  type: 'medication' | 'care';
  description: string;
  scheduled: string;
  status: 'pending' | 'completed';
}

export interface BackendNurseTask {
  id: string;
  patient_name: string;
  room: string;
  task_type: CareTask['type'];
  description: string;
  scheduled: string;
  status: CareTask['status'];
}

export function mapNurseTask(t: BackendNurseTask): CareTask {
  return {
    id: t.id,
    patient: t.patient_name,
    room: t.room,
    type: t.task_type,
    description: t.description,
    scheduled: t.scheduled,
    status: t.status
  };
}

/** nurse only. */
export function listNurseTasks() {
  return api.get<BackendNurseTask[]>('/nurse/tasks');
}

export function completeNurseTask(id: string) {
  return api.patch<BackendNurseTask>(`/nurse/tasks/${id}/complete`);
}
