'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, Calendar, FileText, Users, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listPatients, BackendPatientSummary } from '@/api/users';

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  lastVisit?: string;
}

function mapPatient(p: BackendPatientSummary): PatientRecord {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone || '—',
    dateOfBirth: p.date_of_birth ?? undefined,
    bloodGroup: p.blood_group ?? undefined,
    lastVisit: p.last_visit ?? undefined
  };
}

const DoctorPatients: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPatients = useCallback(async (query?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await listPatients(query);
      setPatients(data.map(mapPatient));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load patients.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadPatients(search || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [search, loadPatients]);

  const filtered = patients;

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Patients</h1>
              <p className="text-gray-600 dark:text-gray-400">{patients.length} patients under your care</p>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading patients...
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                      alt={p.name}
                      className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</h4>
                      {p.bloodGroup && <p className="text-sm text-gray-500 dark:text-gray-400">Blood group: {p.bloodGroup}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {p.dateOfBirth && (
                    <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />DOB: {p.dateOfBirth}</p>
                  )}
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />Last visit: {p.lastVisit || 'N/A'}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />{p.phone}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />{p.email}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => router.push(`/doctor/patients/${p.id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Records
                  </button>
                  <button
                    onClick={() => router.push('/doctor/prescriptions')}
                    className="flex-1 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                  >
                    New Rx
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No patients found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorPatients;
