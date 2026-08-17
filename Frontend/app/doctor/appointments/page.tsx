'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle, Search, User, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';
import { ApiError } from '@/lib/api';
import { listAppointments, updateAppointment, mapAppointment } from '@/api/appointments';
import { Appointment } from '@/types';

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const DoctorAppointments: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAppointments();
      setAppointments(data.map(mapAppointment));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const updateStatus = async (id: string, status: 'completed' | 'cancelled') => {
    setUpdatingId(id);
    try {
      const updated = await updateAppointment(id, { status });
      const mapped = mapAppointment(updated);
      setAppointments((prev) => prev.map((a) => (a.id === id ? mapped : a)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = appointments.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      a.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const stats: Array<{ label: string; value: number; color: ThemeColor }> = [
    { label: 'Scheduled', value: appointments.filter((a) => a.status === 'scheduled').length, color: 'blue' },
    { label: 'Completed', value: appointments.filter((a) => a.status === 'completed').length, color: 'green' },
    { label: 'Cancelled', value: appointments.filter((a) => a.status === 'cancelled').length, color: 'red' }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage your patient appointments and consultations</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center min-w-0"
              >
                <p className={`text-xl sm:text-2xl font-bold ${colors.text600}`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">{s.label}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading appointments...
            </div>
          ) : (
          <div className="space-y-4 sm:space-y-6">
            {filtered.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patientName}`}
                      alt={apt.patientName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg truncate">{apt.patientName}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{apt.reason}</p>
                        </div>
                        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center mt-2 gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />{apt.date}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />{apt.time}</span>
                        <span className="capitalize px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">{apt.type}</span>
                      </div>
                    </div>
                  </div>
                  {apt.status === 'scheduled' ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {apt.type === 'video' && (
                        <button
                          onClick={() => router.push(`/doctor/consultation/${apt.id}`)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Video className="w-4 h-4" /> Start
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/doctor/patients/${apt.patientId}`)}
                        className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <User className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => router.push('/doctor/notes')}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'completed')}
                        disabled={updatingId === apt.id}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {updatingId === apt.id ? 'Updating...' : 'Mark Completed'}
                      </button>
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        disabled={updatingId === apt.id}
                        className="flex-1 px-4 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : apt.status === 'completed' ? (
                    <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" /> Completed
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No appointments</h3>
                <p className="text-gray-600 dark:text-gray-400">No appointments match your filters.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorAppointments;
