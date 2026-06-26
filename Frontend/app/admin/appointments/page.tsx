'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Clock, Video, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments } from '@/data/mockData';

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
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
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

  const stats = [
    { label: 'Total', value: all.length, color: 'blue' },
    { label: 'Scheduled', value: all.filter((a) => a.status === 'scheduled').length, color: 'purple' },
    { label: 'Completed', value: all.filter((a) => a.status === 'completed').length, color: 'green' },
    { label: 'Cancelled', value: all.filter((a) => a.status === 'cancelled').length, color: 'red' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Appointments</h1>
            <p className="text-gray-600">All appointments across the hospital</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-lg text-center"
              >
                <p className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or doctor..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">Doctor</th>
                    <th className="py-3 px-4 font-medium">Date &amp; Time</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a) => (
                    <tr key={a.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{a.patientName}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{a.doctorName}</p>
                        <p className="text-xs text-gray-500">{a.doctorSpecialization}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date}</span>
                        <span className="flex items-center gap-1 text-xs mt-0.5"><Clock className="w-3.5 h-3.5" />{a.time}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                          {a.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          {a.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${a.fees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAppointments;
