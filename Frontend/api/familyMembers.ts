import { api } from '@/lib/api';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  phone: string;
  bloodGroup: string;
}

export interface BackendFamilyMember {
  id: string;
  patient_id: string;
  name: string;
  relationship: string;
  date_of_birth: string;
  phone: string;
  blood_group: string;
}

export function mapFamilyMember(m: BackendFamilyMember): FamilyMember {
  return {
    id: m.id,
    name: m.name,
    relationship: m.relationship,
    dateOfBirth: m.date_of_birth,
    phone: m.phone,
    bloodGroup: m.blood_group
  };
}

/** Patient only — their own family members. */
export function listFamilyMembers() {
  return api.get<BackendFamilyMember[]>('/family-members');
}

export interface AddFamilyMemberInput {
  name: string;
  relationship: string;
  date_of_birth: string;
  phone: string;
  blood_group: string;
}

export function addFamilyMember(body: AddFamilyMemberInput) {
  return api.post<BackendFamilyMember>('/family-members', body);
}

export function removeFamilyMember(id: string) {
  return api.delete(`/family-members/${id}`);
}
