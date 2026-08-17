import { api } from '@/lib/api';

export interface Invoice {
  id: string;
  patientName: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface BackendInvoice {
  id: string;
  patient_id: string;
  patient_name: string;
  service: string;
  date: string;
  amount: number;
  status: string;
}

export function mapInvoice(i: BackendInvoice): Invoice {
  return {
    id: i.id,
    patientName: i.patient_name,
    service: i.service,
    date: i.date,
    amount: i.amount,
    status: i.status as Invoice['status']
  };
}

/** admin (all invoices) or patient (their own — server-scoped). */
export function listInvoices() {
  return api.get<BackendInvoice[]>('/billing/invoices');
}

/** Patient only. */
export function payInvoice(id: string) {
  return api.post<BackendInvoice>(`/billing/invoices/${id}/pay`);
}
