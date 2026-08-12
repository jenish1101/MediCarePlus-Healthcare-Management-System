'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle, Plus, Stethoscope } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments } from '@/data/mockData';

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    rescheduled: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const PatientAppointments: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const upcoming = mockAppointments.filter(a => a.status === 'scheduled');
  const past = mockAppointments.filter(a => a.status === 'completed');

  const filtered =
    filter === 'all' ? mockAppointments : mockAppointments.filter(a => a.status === filter);

  const stats = [
    { label: 'Upcoming', value: upcoming.length, color: 'blue' },
    { label: 'Completed', value: past.length, color: 'green' },
    { label: 'Total', value: mockAppointments.length, color: 'purple' }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Appointments</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your upcoming and past appointments</p>
            </div>
            <button
              onClick={() => router.push('/patient/book-appointment')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Book Appointment
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'scheduled', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-6">
            {filtered.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                      <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{apt.doctorName}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{apt.doctorSpecialization}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{apt.reason}</p>
                      <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {apt.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {apt.time}
                        </span>
                        <span className="capitalize px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                          {apt.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${apt.fees}</span>
                  </div>
                </div>

                {apt.status === 'scheduled' ? (
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 min-w-[120px] py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Reschedule
                    </button>
                    <button className="flex-1 min-w-[120px] py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Cancel
                    </button>
                    {apt.type === 'video' && (
                      <button
                        onClick={() => router.push(`/patient/consultation/${apt.id}`)}
                        className="flex-1 min-w-[120px] py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Call
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Visit completed
                  </div>
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No appointments</h3>
                <p className="text-gray-600 dark:text-gray-400">You have no {filter !== 'all' ? filter : ''} appointments.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientAppointments;
