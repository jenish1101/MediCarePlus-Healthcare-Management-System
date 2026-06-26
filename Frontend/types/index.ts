export type UserRole = 'patient' | 'doctor' | 'admin' | 'receptionist' | 'pharmacist' | 'lab_tech' | 'nurse' | 'supplier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Patient extends User {
  bloodGroup?: string;
  allergies?: string[];
  emergencyContact?: string;
  insuranceInfo?: string;
  medicalHistory?: string[];
}

export interface Doctor extends User {
  specialization: string;
  experience: number;
  fees: number;
  rating: number;
  reviews: number;
  availability: string[];
  location: string;
  qualifications: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reason: string;
  type: 'in-person' | 'video' | 'chat';
  fees: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  status: 'pending' | 'completed';
  results?: string;
  doctorNotes?: string;
}

export interface Order {
  id: string;
  patientId: string;
  medicines: OrderMedicine[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
}

export interface OrderMedicine {
  name: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'upi' | 'wallet' | 'cash';
  description: string;
}

export interface Bed {
  id: string;
  roomNumber: string;
  type: 'ICU' | 'General' | 'Private';
  status: 'available' | 'occupied' | 'maintenance';
  patientId?: string;
}

export interface Inventory {
  id: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  supplier: string;
  price: number;
}
