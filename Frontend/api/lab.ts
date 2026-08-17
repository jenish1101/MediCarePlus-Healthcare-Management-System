import { api } from '@/lib/api';

// ---- Reports ----

export type LabReportStatus = 'pending' | 'in-progress' | 'completed';

export interface LabResultRow {
  parameter: string;
  value: string;
  range: string;
  flag?: string;
}

export interface LabReportDetail {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  backendStatus: LabReportStatus;
  status: 'ready' | 'processing';
  summary?: string;
  doctorNotes?: string;
  results?: LabResultRow[];
}

/**
 * `/lab/reports` returns more fields than the shared `mapLabReport` in
 * `lib/mappers` covers (`result_rows`), and no `patient_name` (only
 * `patient_id`) — this local type/mapper is the one to use for lab-role pages.
 */
export interface BackendLabReportDetail {
  id: string;
  patient_id: string;
  test_name: string;
  date: string;
  status: LabReportStatus;
  results_summary?: string | null;
  result_rows?: { parameter: string; value: string; reference: string; flag?: string | null }[];
  doctor_notes?: string | null;
}

export function mapLabReportDetail(r: BackendLabReportDetail): LabReportDetail {
  return {
    id: r.id,
    patientId: r.patient_id,
    testName: r.test_name,
    date: r.date,
    backendStatus: r.status,
    status: r.status === 'completed' ? 'ready' : 'processing',
    summary: r.results_summary ?? undefined,
    doctorNotes: r.doctor_notes ?? undefined,
    results: r.result_rows?.map((row) => ({
      parameter: row.parameter,
      value: row.value,
      range: row.reference,
      flag: row.flag ?? undefined
    }))
  };
}

/** Scoped server-side per caller role. */
export function listLabReports() {
  return api.get<BackendLabReportDetail[]>('/lab/reports');
}

export interface UpdateLabReportInput {
  status?: LabReportStatus;
  results_summary?: string | null;
  result_rows?: { parameter: string; value: string; reference: string; flag?: string }[];
  doctor_notes?: string | null;
}

/** lab_tech/doctor/admin. */
export function updateLabReport(id: string, updates: UpdateLabReportInput) {
  return api.patch<BackendLabReportDetail>(`/lab/reports/${id}`, updates);
}

// ---- Catalog ----

export interface CatalogTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaround: string;
  sampleType: string;
  status: 'available' | 'limited';
}

export interface BackendCatalogTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaround: string;
  sample_type: string;
  status: CatalogTest['status'];
}

export function mapCatalogTest(t: BackendCatalogTest): CatalogTest {
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    price: t.price,
    turnaround: t.turnaround,
    sampleType: t.sample_type,
    status: t.status
  };
}

/** Public. */
export function listLabCatalog(category?: string) {
  return api.get<BackendCatalogTest[]>('/lab/catalog', category ? { category } : undefined);
}

export interface CreateCatalogTestInput {
  name: string;
  category: string;
  price: number;
  turnaround: string;
  sample_type: string;
  status?: CatalogTest['status'];
}

/** lab_tech/admin. */
export function addLabCatalogTest(body: CreateCatalogTestInput) {
  return api.post<BackendCatalogTest>('/lab/catalog', body);
}

// ---- Samples ----

export type SampleStatus = 'collected' | 'in-transit' | 'received' | 'processing' | 'completed';

export interface Sample {
  id: string;
  sampleId: string;
  patientName: string;
  testName: string;
  collectedAt: string;
  status: SampleStatus;
  location: string;
}

export interface BackendSample {
  id: string;
  sample_id: string;
  patient_name: string;
  test_name: string;
  collected_at: string;
  status: SampleStatus;
  location: string;
}

export function mapSample(s: BackendSample): Sample {
  return {
    id: s.id,
    sampleId: s.sample_id,
    patientName: s.patient_name,
    testName: s.test_name,
    collectedAt: s.collected_at,
    status: s.status,
    location: s.location
  };
}

/** lab_tech only. */
export function listLabSamples() {
  return api.get<BackendSample[]>('/lab/samples');
}

/** Advances a sample to its next pipeline stage. */
export function advanceSample(id: string) {
  return api.post<BackendSample>(`/lab/samples/${id}/advance`);
}

/** Advances a sample by scanned barcode instead of its database id. */
export function scanSample(sampleCode: string) {
  return api.post<BackendSample>('/lab/samples/scan', { sample_id: sampleCode });
}

// ---- Equipment ----

export type EquipmentStatus = 'operational' | 'maintenance' | 'qc-pending' | 'offline';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  location: string;
  lastCalibration: string;
  nextCalibration: string;
  status: EquipmentStatus;
  qcScore?: number;
}

export interface BackendEquipment {
  id: string;
  name: string;
  model: string;
  location: string;
  last_calibration: string;
  next_calibration: string;
  status: EquipmentStatus;
  qc_score?: number | null;
}

export function mapEquipment(e: BackendEquipment): Equipment {
  return {
    id: e.id,
    name: e.name,
    model: e.model,
    location: e.location,
    lastCalibration: e.last_calibration,
    nextCalibration: e.next_calibration,
    status: e.status,
    qcScore: e.qc_score ?? undefined
  };
}

/** lab_tech/admin. */
export function listLabEquipment() {
  return api.get<BackendEquipment[]>('/lab/equipment');
}

/** lab_tech only. */
export function runEquipmentQc(id: string) {
  return api.post<BackendEquipment>(`/lab/equipment/${id}/run-qc`);
}

// ---- Collection appointments ----

export interface LabAppointment {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  time: string;
  status: string;
}

export interface BackendLabAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  test_name: string;
  date: string;
  time: string;
  status: string;
}

export function mapLabAppointment(a: BackendLabAppointment): LabAppointment {
  return {
    id: a.id,
    patientName: a.patient_name,
    testName: a.test_name,
    date: a.date,
    time: a.time,
    status: a.status
  };
}

/** lab_tech/receptionist. */
export function listLabAppointments() {
  return api.get<BackendLabAppointment[]>('/lab/appointments');
}

// ---- Test requests queue ----

export type LabTestStatus = 'pending' | 'in-progress' | 'completed';

export interface LabTest {
  id: string;
  testName: string;
  patientName: string;
  requestedBy: string;
  date: string;
  priority: string;
  status: LabTestStatus;
  results?: string;
}

export interface BackendLabTest {
  id: string;
  test_name: string;
  patient_name: string;
  requested_by: string;
  date: string;
  priority: string;
  status: LabTestStatus;
  results?: string | null;
}

export function mapLabTest(t: BackendLabTest): LabTest {
  return {
    id: t.id,
    testName: t.test_name,
    patientName: t.patient_name,
    requestedBy: t.requested_by,
    date: t.date,
    priority: t.priority,
    status: t.status,
    results: t.results ?? undefined
  };
}

/** lab_tech only. */
export function listLabTests(status?: string) {
  return api.get<BackendLabTest[]>('/lab/tests', status && status !== 'all' ? { status } : undefined);
}
