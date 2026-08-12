'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Clock, Video, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments } from '@/data/mockData';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

interface Row {
  id: string;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
  fees: number;
}

const extra: Row[] = [
  { id: 'apt4', patientName: 'Emma Thompson', doctorName: 'Dr. Sarah Wilson', doctorSpecialization: 'Cardiology', date: '2024-02-16', time: '09:00 AM', type: 'video', status: 'scheduled', fees: 500 },
  { id: 'apt5', patientName: 'Michael Brown', doctorName: 'Dr. James Anderson', doctorSpecialization: 'Orthopedics', date: '2024-02-14', time: '01:00 PM', type: 'in-person', status: 'completed', fees: 550 },
  { id: 'apt6', patientName: 'Sophia Davis', doctorName: 'Dr. Priya Sharma', doctorSpecialization: 'Dermatology', date: '2024-02-09', time: '04:00 PM', type: 'video', status: 'cancelled', fees: 450 }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const AdminAppointments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const all: Row[] = [...(mockAppointments as Row[]), ...extra];

  const filtered = all.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      (a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(search.toLowerCase()))
  );

  const stats: Array<{ label: string; value: number; color: ThemeColor }> = [
    { label: 'Total', value: all.length, color: 'blue' },
    { label: 'Scheduled', value: all.filter((a) => a.status === 'scheduled').length, color: 'purple' },
    { label: 'Completed', value: all.filter((a) => a.status === 'completed').length, color: 'green' },
    { label: 'Cancelled', value: all.filter((a) => a.status === 'cancelled').length, color: 'red' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">All appointments across the hospital</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
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
                placeholder="Search patient or doctor..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((a) => (
                <div key={a.id} className="p-3 sm:p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{a.patientName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.doctorName} · {a.doctorSpecialization}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shrink-0 ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
                    <span className="inline-flex items-center gap-1 capitalize">
                      {a.type === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {a.type}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 ml-auto">${a.fees}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">Doctor</th>
                    <th className="py-3 px-4 font-medium">Date &amp; Time</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((a) => (
                    <tr key={a.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{a.patientName}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 dark:text-gray-100">{a.doctorName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{a.doctorSpecialization}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date}</span>
                        <span className="flex items-center gap-1 text-xs mt-0.5"><Clock className="w-3.5 h-3.5" />{a.time}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          {a.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          {a.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">${a.fees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No appointments found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search or filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAppointments;
