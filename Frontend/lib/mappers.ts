// Maps backend (snake_case, /api/v1) response shapes onto the frontend's
// existing camelCase types in `types/index.ts`, so the ~20 pages already
// written against those types keep working unchanged once wired to the API.

import { Appointment, Doctor, Prescription, LabReport, Order, Inventory, Bed } from '@/types';

export interface BackendAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialization: string;
  date: string;
  time: string;
  status: string;
  reason: string;
  appointment_type: string;
  fees: number;
}

export function mapAppointment(a: BackendAppointment): Appointment {
  return {
    id: a.id,
    patientId: a.patient_id,
    patientName: a.patient_name,
    doctorId: a.doctor_id,
    doctorName: a.doctor_name,
    doctorSpecialization: a.doctor_specialization,
    date: a.date,
    time: a.time,
    status: a.status as Appointment['status'],
    reason: a.reason,
    type: a.appointment_type as Appointment['type'],
    fees: a.fees
  };
}

export interface BackendDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  fees: number;
  rating: number;
  reviews: number;
  availability_days: string[];
  location: string;
  qualifications: string[];
  avatar?: string;
  phone?: string;
}

export function mapDoctor(d: BackendDoctor): Doctor {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    role: 'doctor',
    avatar: d.avatar,
    phone: d.phone,
    specialization: d.specialization,
    experience: d.experience,
    fees: d.fees,
    rating: d.rating,
    reviews: d.reviews,
    availability: d.availability_days,
    location: d.location,
    qualifications: d.qualifications
  };
}

export interface BackendPrescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  medicines: Prescription['medicines'];
  diagnosis: string;
  notes?: string;
}

export function mapPrescription(p: BackendPrescription): Prescription {
  return {
    id: p.id,
    patientId: p.patient_id,
    doctorId: p.doctor_id,
    date: p.date,
    medicines: p.medicines,
    diagnosis: p.diagnosis,
    notes: p.notes
  };
}

export interface BackendLabReport {
  id: string;
  patient_id: string;
  test_name: string;
  date: string;
  status: string;
  results_summary?: string;
  doctor_notes?: string;
}

export function mapLabReport(r: BackendLabReport): LabReport {
  return {
    id: r.id,
    patientId: r.patient_id,
    testName: r.test_name,
    date: r.date,
    status: r.status as LabReport['status'],
    results: r.results_summary,
    doctorNotes: r.doctor_notes
  };
}

export interface BackendOrder {
  id: string;
  patient_id: string;
  medicines: Order['medicines'];
  total: number;
  status: string;
  date: string;
  address: string;
}

export function mapOrder(o: BackendOrder): Order {
  return {
    id: o.id,
    patientId: o.patient_id,
    medicines: o.medicines,
    total: o.total,
    status: o.status as Order['status'],
    date: o.date,
    address: o.address
  };
}

export interface BackendInventory {
  id: string;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  supplier: string;
  price: number;
}

export function mapInventory(i: BackendInventory): Inventory {
  return {
    id: i.id,
    medicineName: i.medicine_name,
    batchNumber: i.batch_number,
    quantity: i.quantity,
    expiryDate: i.expiry_date,
    supplier: i.supplier,
    price: i.price
  };
}

export interface BackendBed {
  id: string;
  room_number: string;
  bed_type: string;
  status: string;
  patient_id?: string;
  patient_name?: string;
}

export function mapBed(b: BackendBed): Bed {
  return {
    id: b.id,
    roomNumber: b.room_number,
    type: b.bed_type as Bed['type'],
    status: b.status as Bed['status'],
    patientId: b.patient_id
  };
}
