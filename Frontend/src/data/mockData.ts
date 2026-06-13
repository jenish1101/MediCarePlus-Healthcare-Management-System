import { Doctor, Appointment, Prescription, LabReport, Order, Inventory, Bed } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@hospital.com',
    role: 'doctor',
    specialization: 'Cardiology',
    experience: 15,
    fees: 500,
    rating: 4.8,
    reviews: 234,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    location: 'New York, NY',
    qualifications: ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    phone: '+1234567891'
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    specialization: 'Neurology',
    experience: 12,
    fees: 600,
    rating: 4.9,
    reviews: 187,
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    location: 'Los Angeles, CA',
    qualifications: ['MBBS', 'MD Neurology', 'DNB'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    phone: '+1234567895'
  },
  {
    id: 'd3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    role: 'doctor',
    specialization: 'Pediatrics',
    experience: 10,
    fees: 400,
    rating: 4.7,
    reviews: 312,
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'Chicago, IL',
    qualifications: ['MBBS', 'MD Pediatrics'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    phone: '+1234567896'
  },
  {
    id: 'd4',
    name: 'Dr. James Anderson',
    email: 'james.anderson@hospital.com',
    role: 'doctor',
    specialization: 'Orthopedics',
    experience: 20,
    fees: 550,
    rating: 4.9,
    reviews: 421,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    location: 'Houston, TX',
    qualifications: ['MBBS', 'MS Orthopedics', 'Fellowship in Joint Replacement'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    phone: '+1234567897'
  },
  {
    id: 'd5',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@hospital.com',
    role: 'doctor',
    specialization: 'Dermatology',
    experience: 8,
    fees: 450,
    rating: 4.6,
    reviews: 156,
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    location: 'San Francisco, CA',
    qualifications: ['MBBS', 'MD Dermatology'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    phone: '+1234567898'
  },
  {
    id: 'd6',
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@hospital.com',
    role: 'doctor',
    specialization: 'General Medicine',
    experience: 18,
    fees: 350,
    rating: 4.8,
    reviews: 523,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    location: 'Boston, MA',
    qualifications: ['MBBS', 'MD General Medicine'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    phone: '+1234567899'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'p1',
    patientName: 'John Patient',
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Wilson',
    doctorSpecialization: 'Cardiology',
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'Regular checkup',
    type: 'in-person',
    fees: 500
  },
  {
    id: 'apt2',
    patientId: 'p1',
    patientName: 'John Patient',
    doctorId: 'd3',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Pediatrics',
    date: '2024-02-20',
    time: '2:30 PM',
    status: 'scheduled',
    reason: 'Vaccination',
    type: 'video',
    fees: 400
  },
  {
    id: 'apt3',
    patientId: 'p1',
    patientName: 'John Patient',
    doctorId: 'd2',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'Neurology',
    date: '2024-01-28',
    time: '11:00 AM',
    status: 'completed',
    reason: 'Headache consultation',
    type: 'in-person',
    fees: 600
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2024-01-28',
    diagnosis: 'Tension headache',
    medicines: [
      {
        name: 'Ibuprofen 400mg',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals'
      },
      {
        name: 'Vitamin B Complex',
        dosage: '1 capsule',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning'
      }
    ],
    notes: 'Avoid stress and get adequate sleep'
  }
];

export const mockLabReports: LabReport[] = [
  {
    id: 'lab1',
    patientId: 'p1',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-01-25',
    status: 'completed',
    results: 'All values within normal range',
    doctorNotes: 'No concerns, continue regular monitoring'
  },
  {
    id: 'lab2',
    patientId: 'p1',
    testName: 'Lipid Profile',
    date: '2024-02-10',
    status: 'pending'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord1',
    patientId: 'p1',
    medicines: [
      { name: 'Ibuprofen 400mg', quantity: 10, price: 5 },
      { name: 'Vitamin B Complex', quantity: 30, price: 15 }
    ],
    total: 65,
    status: 'delivered',
    date: '2024-01-29',
    address: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ord2',
    patientId: 'p1',
    medicines: [
      { name: 'Paracetamol 500mg', quantity: 20, price: 8 }
    ],
    total: 28,
    status: 'shipped',
    date: '2024-02-12',
    address: '123 Main St, New York, NY 10001'
  }
];

export const mockInventory: Inventory[] = [
  { id: 'inv1', medicineName: 'Paracetamol 500mg', batchNumber: 'PCM001', quantity: 5000, expiryDate: '2025-12-31', supplier: 'PharmaCorp', price: 0.5 },
  { id: 'inv2', medicineName: 'Ibuprofen 400mg', batchNumber: 'IBU001', quantity: 3000, expiryDate: '2025-10-15', supplier: 'MedSupply Inc', price: 0.8 },
  { id: 'inv3', medicineName: 'Amoxicillin 500mg', batchNumber: 'AMX001', quantity: 150, expiryDate: '2024-06-30', supplier: 'PharmaCorp', price: 1.2 },
  { id: 'inv4', medicineName: 'Vitamin B Complex', batchNumber: 'VIT001', quantity: 2500, expiryDate: '2026-03-20', supplier: 'HealthPlus', price: 0.6 },
  { id: 'inv5', medicineName: 'Aspirin 75mg', batchNumber: 'ASP001', quantity: 4000, expiryDate: '2025-08-10', supplier: 'MedSupply Inc', price: 0.3 }
];

export const mockBeds: Bed[] = [
  { id: 'b1', roomNumber: '101', type: 'ICU', status: 'occupied', patientId: 'p2' },
  { id: 'b2', roomNumber: '102', type: 'ICU', status: 'available' },
  { id: 'b3', roomNumber: '103', type: 'ICU', status: 'available' },
  { id: 'b4', roomNumber: '201', type: 'Private', status: 'occupied', patientId: 'p3' },
  { id: 'b5', roomNumber: '202', type: 'Private', status: 'available' },
  { id: 'b6', roomNumber: '203', type: 'Private', status: 'maintenance' },
  { id: 'b7', roomNumber: '301', type: 'General', status: 'available' },
  { id: 'b8', roomNumber: '302', type: 'General', status: 'available' },
  { id: 'b9', roomNumber: '303', type: 'General', status: 'occupied', patientId: 'p4' },
  { id: 'b10', roomNumber: '304', type: 'General', status: 'available' }
];

export const specializations = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Gynecology',
  'Psychiatry',
  'ENT',
  'Ophthalmology'
];
