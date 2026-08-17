'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  MessageSquare,
  Share2,
  ClipboardList,
  Pill,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listPatients } from '@/api/users';
import { listMedicalNotes } from '@/api/medicalNotes';
import { listPrescriptions, mapPrescription } from '@/api/prescriptions';
import { Prescription } from '@/types';

interface PatientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  lastVisit?: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  vitals?: Record<string, unknown> | null;
}

const DoctorPatientDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'notes' | 'vitals'>('prescriptions');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [patients, notesData, prescriptionsData] = await Promise.all([
        listPatients(),
        listMedicalNotes(patientId),
        listPrescriptions()
      ]);

      const found = patients.find((p) => p.id === patientId);
      setPatient(
        found
          ? {
              id: found.id,
              name: found.name,
              email: found.email,
              phone: found.phone || '—',
              dateOfBirth: found.date_of_birth ?? undefined,
              bloodGroup: found.blood_group ?? undefined,
              lastVisit: found.last_visit ?? undefined
            }
          : null
      );

      setNotes(
        notesData
          .map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            createdAt: n.created_at,
            vitals: n.vitals
          }))
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      );

      setPrescriptions(
        prescriptionsData
          .filter((p) => p.patient_id === patientId)
          .map(mapPrescription)
          .sort((a, b) => (a.date < b.date ? 1 : -1))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load patient details.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DashboardLayout role="doctor">
          <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading patient...
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && !patient) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DashboardLayout role="doctor">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Could not load patient</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
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

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DashboardLayout role="doctor">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Patient not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">No record exists for ID &quot;{patientId}&quot;.</p>
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

  const vitalsEntries = notes.filter((n) => n.vitals && Object.keys(n.vitals).length > 0);

  const tabs = [
    { id: 'prescriptions' as const, label: 'Prescriptions', icon: Pill },
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
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Patients
            </button>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                  alt={patient.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{patient.name}</h1>
                    {patient.bloodGroup && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {patient.bloodGroup}
                      </span>
                    )}
                  </div>
                  {patient.dateOfBirth && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">DOB: {patient.dateOfBirth}</p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-x-4 sm:gap-y-1 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4 shrink-0" />{patient.phone}</span>
                    <span className="flex items-center gap-1 truncate"><Mail className="w-4 h-4 shrink-0" />{patient.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 shrink-0" />Last visit: {patient.lastVisit || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => router.push('/doctor/notes')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    <ClipboardList className="w-4 h-4" /> Add Note
                  </button>
                  <button
                    onClick={() => router.push('/doctor/referrals')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Share2 className="w-4 h-4" /> Refer
                  </button>
                  <button
                    onClick={() => router.push('/doctor/messages')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max sm:min-w-0 space-x-4 sm:space-x-6 px-4 sm:px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'prescriptions' && (
                <div className="space-y-6">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {rx.diagnosis}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{rx.date}</span>
                      </div>
                      <div className="space-y-1">
                        {rx.medicines.map((m, j) => (
                          <p key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Pill className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            {m.name} — {m.dosage}, {m.frequency}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No prescriptions on record.</p>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {notes.map((note) => (
                    <div key={note.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{note.title}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{note.createdAt}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{note.content}</p>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No notes on record.</p>
                  )}
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="space-y-4">
                  {vitalsEntries.map((note) => (
                    <div key={note.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 space-y-2 text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{note.createdAt}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600 dark:text-gray-400">
                        {Object.entries(note.vitals || {}).map(([key, value]) => (
                          <p key={key} className="capitalize">
                            {key}: <span className="font-medium text-gray-900 dark:text-gray-100">{String(value)}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {vitalsEntries.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No vitals on record.</p>
                  )}
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
