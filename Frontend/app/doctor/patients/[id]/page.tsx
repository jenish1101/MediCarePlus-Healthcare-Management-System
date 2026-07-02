'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  FileText,
  HeartPulse,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  MessageSquare,
  Share2,
  ClipboardList
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PatientDetail {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  condition: string;
  lastVisit: string;
  status: 'active' | 'follow-up' | 'new';
  history: { date: string; event: string; doctor: string }[];
  notes: { date: string; title: string; content: string }[];
  vitals: { date: string; bp: string; pulse: string; temp: string; spo2: string }[];
}

const patients: Record<string, PatientDetail> = {
  p1: {
    id: 'p1',
    name: 'John Patient',
    age: 34,
    gender: 'Male',
    phone: '+1 555-0101',
    email: 'john@demo.com',
    condition: 'Hypertension',
    lastVisit: '2024-02-12',
    status: 'active',
    history: [
      { date: '2024-02-12', event: 'Regular checkup — BP stable on medication', doctor: 'Dr. Wilson' },
      { date: '2024-01-15', event: 'ECG normal, continued Amlodipine', doctor: 'Dr. Wilson' },
      { date: '2023-12-10', event: 'Initial hypertension diagnosis', doctor: 'Dr. Wilson' }
    ],
    notes: [
      { date: '2024-02-12', title: 'Follow-up visit', content: 'Patient reports good compliance. BP 128/82. Continue current regimen.' },
      { date: '2024-01-15', title: 'ECG review', content: 'No arrhythmia detected. Lifestyle counseling provided.' }
    ],
    vitals: [
      { date: '2024-02-12', bp: '128/82', pulse: '72', temp: '98.4°F', spo2: '98%' },
      { date: '2024-01-15', bp: '132/84', pulse: '74', temp: '98.2°F', spo2: '97%' }
    ]
  },
  p2: {
    id: 'p2',
    name: 'Emma Thompson',
    age: 28,
    gender: 'Female',
    phone: '+1 555-0102',
    email: 'emma@demo.com',
    condition: 'Arrhythmia',
    lastVisit: '2024-02-08',
    status: 'follow-up',
    history: [
      { date: '2024-02-08', event: 'Holter monitor results reviewed — occasional PVCs', doctor: 'Dr. Wilson' },
      { date: '2024-01-20', event: 'Started Metoprolol 25mg', doctor: 'Dr. Wilson' }
    ],
    notes: [
      { date: '2024-02-08', title: 'Arrhythmia follow-up', content: 'Symptoms improved. PVCs infrequent. Continue beta-blocker.' }
    ],
    vitals: [
      { date: '2024-02-08', bp: '118/76', pulse: '68', temp: '98.6°F', spo2: '99%' }
    ]
  },
  p3: {
    id: 'p3',
    name: 'Michael Brown',
    age: 45,
    gender: 'Male',
    phone: '+1 555-0103',
    email: 'michael@demo.com',
    condition: 'Coronary check',
    lastVisit: '2024-02-14',
    status: 'new',
    history: [
      { date: '2024-02-14', event: 'Chest pain evaluation — stress test ordered', doctor: 'Dr. Wilson' }
    ],
    notes: [
      { date: '2024-02-14', title: 'Initial evaluation', content: 'Atypical chest pain. No acute ECG changes. Stress test scheduled.' }
    ],
    vitals: [
      { date: '2024-02-14', bp: '142/88', pulse: '82', temp: '98.8°F', spo2: '96%' }
    ]
  },
  p4: {
    id: 'p4',
    name: 'Sophia Davis',
    age: 52,
    gender: 'Female',
    phone: '+1 555-0104',
    email: 'sophia@demo.com',
    condition: 'High cholesterol',
    lastVisit: '2024-01-30',
    status: 'follow-up',
    history: [
      { date: '2024-01-30', event: 'Lipid panel — LDL 145, started statin', doctor: 'Dr. Wilson' },
      { date: '2023-11-05', event: 'Diet and exercise counseling', doctor: 'Dr. Wilson' }
    ],
    notes: [
      { date: '2024-01-30', title: 'Cholesterol management', content: 'Started Atorvastatin 10mg. Recheck lipids in 3 months.' }
    ],
    vitals: [
      { date: '2024-01-30', bp: '124/80', pulse: '70', temp: '98.4°F', spo2: '98%' }
    ]
  },
  p5: {
    id: 'p5',
    name: 'James Wilson',
    age: 61,
    gender: 'Male',
    phone: '+1 555-0105',
    email: 'james@demo.com',
    condition: 'Post bypass',
    lastVisit: '2024-02-12',
    status: 'active',
    history: [
      { date: '2024-02-12', event: '6-month post-CABG follow-up — excellent recovery', doctor: 'Dr. Wilson' },
      { date: '2023-08-20', event: 'CABG surgery completed', doctor: 'Dr. Chen' }
    ],
    notes: [
      { date: '2024-02-12', title: 'Post-surgery review', content: 'Wound healed. Exercise tolerance improving. Continue cardiac rehab.' }
    ],
    vitals: [
      { date: '2024-02-12', bp: '122/78', pulse: '66', temp: '98.2°F', spo2: '97%' }
    ]
  },
  p6: {
    id: 'p6',
    name: 'Olivia Martin',
    age: 39,
    gender: 'Female',
    phone: '+1 555-0106',
    email: 'olivia@demo.com',
    condition: 'Palpitations',
    lastVisit: '2024-02-10',
    status: 'active',
    history: [
      { date: '2024-02-10', event: 'Palpitations workup — thyroid normal, echo pending', doctor: 'Dr. Wilson' },
      { date: '2024-01-25', event: 'Initial complaint of intermittent palpitations', doctor: 'Dr. Wilson' }
    ],
    notes: [
      { date: '2024-02-10', title: 'Palpitation assessment', content: 'TSH normal. Echocardiogram ordered. Avoid caffeine.' }
    ],
    vitals: [
      { date: '2024-02-10', bp: '116/74', pulse: '88', temp: '98.6°F', spo2: '99%' }
    ]
  }
};

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    'follow-up': 'bg-yellow-100 text-yellow-700',
    new: 'bg-blue-100 text-blue-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const DoctorPatientDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const patient = patients[patientId];
  const [activeTab, setActiveTab] = useState<'history' | 'notes' | 'vitals'>('history');

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DashboardLayout role="doctor">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient not found</h3>
            <p className="text-gray-600 mb-6">No record exists for ID &quot;{patientId}&quot;.</p>
            <button
              onClick={() => router.push('/doctor/patients')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Patients
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const tabs = [
    { id: 'history' as const, label: 'History', icon: Calendar },
    { id: 'notes' as const, label: 'Notes', icon: FileText },
    { id: 'vitals' as const, label: 'Vitals', icon: HeartPulse }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => router.push('/doctor/patients')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Patients
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                  alt={patient.name}
                  className="w-20 h-20 rounded-full bg-gray-100"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-lg font-bold text-gray-900">{patient.name}</h1>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{patient.age} yrs · {patient.gender} · {patient.condition}</p>
                  <div className="flex flex-wrap gap-6 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{patient.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{patient.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Last visit: {patient.lastVisit}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button
                    onClick={() => router.push('/doctor/notes')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    <ClipboardList className="w-4 h-4" /> Add Note
                  </button>
                  <button
                    onClick={() => router.push('/doctor/referrals')}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                  >
                    <Share2 className="w-4 h-4" /> Refer
                  </button>
                  <button
                    onClick={() => router.push('/doctor/messages')}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-gray-200">
              <div className="flex space-x-6 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'history' && (
                <div className="space-y-6">
                  {patient.history.map((item, i) => (
                    <div key={i} className="flex gap-6 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.event}</p>
                        <p className="text-sm text-gray-500">{item.date} · {item.doctor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {patient.notes.map((note, i) => (
                    <div key={i} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{note.title}</h4>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 border-b">
                      <tr>
                        <th className="py-3 pr-4 font-medium">Date</th>
                        <th className="py-3 pr-4 font-medium">Blood Pressure</th>
                        <th className="py-3 pr-4 font-medium">Pulse</th>
                        <th className="py-3 pr-4 font-medium">Temperature</th>
                        <th className="py-3 font-medium">SpO₂</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patient.vitals.map((v, j) => (
                        <tr key={j}>
                          <td className="py-3 pr-4 text-gray-900">{v.date}</td>
                          <td className="py-3 pr-4">{v.bp}</td>
                          <td className="py-3 pr-4">{v.pulse} bpm</td>
                          <td className="py-3 pr-4">{v.temp}</td>
                          <td className="py-3">{v.spo2}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorPatientDetail;
