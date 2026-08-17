import { api } from '@/lib/api';

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  beds: number;
  status: 'active' | 'inactive';
}

export interface BackendDepartment {
  id: string;
  name: string;
  head: string;
  staff_count: number;
  beds: number;
  status: string;
}

export function mapDepartment(d: BackendDepartment): Department {
  return {
    id: d.id,
    name: d.name,
    head: d.head,
    staffCount: d.staff_count,
    beds: d.beds,
    status: d.status as Department['status']
  };
}

/** admin only. */
export function listDepartments() {
  return api.get<BackendDepartment[]>('/departments');
}

export interface CreateDepartmentInput {
  name: string;
  head: string;
  staff_count?: number;
  beds?: number;
  status?: Department['status'];
}

export function createDepartment(body: CreateDepartmentInput) {
  return api.post<BackendDepartment>('/departments', body);
}

/** NOTE: the backend has no PATCH endpoint for departments — there's no update function here by design; edits must stay local-only in the UI. */

export function deleteDepartment(id: string) {
  return api.delete(`/departments/${id}`);
}
