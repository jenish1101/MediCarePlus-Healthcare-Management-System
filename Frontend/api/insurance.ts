import { api } from '@/lib/api';

export interface CoverageItem {
  category: string;
  covered: string;
  copay: string;
  limit: string;
  status: 'active' | 'limited';
}

export interface InsurancePlan {
  planName: string;
  policyNumber: string;
  groupNumber: string;
  memberId: string;
  provider: string;
  effectiveDate: string;
  deductible: number;
  deductibleMet: number;
  outOfPocketMax: number;
  outOfPocketUsed: number;
  memberServicesPhone: string;
  coverageItems: CoverageItem[];
}

export interface BackendInsurance {
  id: string;
  plan_name: string;
  policy_number: string;
  group_number: string;
  member_id: string;
  provider: string;
  effective_date: string;
  deductible: number;
  deductible_met: number;
  out_of_pocket_max: number;
  out_of_pocket_used: number;
  member_services_phone: string;
  coverage_items: CoverageItem[];
}

export function mapInsurance(i: BackendInsurance): InsurancePlan {
  return {
    planName: i.plan_name,
    policyNumber: i.policy_number,
    groupNumber: i.group_number,
    memberId: i.member_id,
    provider: i.provider,
    effectiveDate: i.effective_date,
    deductible: i.deductible,
    deductibleMet: i.deductible_met,
    outOfPocketMax: i.out_of_pocket_max,
    outOfPocketUsed: i.out_of_pocket_used,
    memberServicesPhone: i.member_services_phone,
    coverageItems: i.coverage_items
  };
}

/** Patient only. Returns null if the patient has no policy on file. */
export function getMyInsurance() {
  return api.get<BackendInsurance | null>('/insurance');
}
