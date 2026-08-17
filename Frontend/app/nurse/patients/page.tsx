'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, HeartPulse, ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listPatients, mapPatientSummary as mapPatient, PatientSummary as PatientRow } from '@/api/users';

const NursePatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listPatients(debouncedSearch);
      const mapped = data.map(mapPatient);
      setPatients(mapped);
      setExpanded((prev) => prev ?? mapped[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load patients.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Patients</h1>
            <p className="text-gray-600 dark:text-gray-400">Patient directory and records</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading patients...
            </div>
          ) : (
          <div className="space-y-6">
            {patients.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === patient.id ? null : patient.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {expanded === patient.id ? <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
                  </div>
                </button>

                {expanded === patient.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mt-4 mb-3">
                      <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Patient Details</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 dark:text-gray-400">
                          <tr>
                            <th className="py-2 pr-4 font-medium">Phone</th>
                            <th className="py-2 pr-4 font-medium">Date of Birth</th>
                            <th className="py-2 pr-4 font-medium">Blood Group</th>
                            <th className="py-2 font-medium">Last Visit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                          <tr className="dark:hover:bg-gray-700/50">
                            <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{patient.phone || '—'}</td>
                            <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{patient.dateOfBirth || '—'}</td>
                            <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{patient.bloodGroup || '—'}</td>
                            <td className="py-2 text-gray-700 dark:text-gray-300">{patient.lastVisit || '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {patients.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No patients found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NursePatients;
