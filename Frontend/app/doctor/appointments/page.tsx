'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle, Search, User } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface DoctorAppointment {
  id: string;
  patientName: string;
  reason: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const appointments: DoctorAppointment[] = [
  { id: 'a1', patientName: 'John Patient', reason: 'Regular checkup', date: '2024-02-15', time: '10:00 AM', type: 'in-person', status: 'scheduled' },
  { id: 'a2', patientName: 'Emma Thompson', reason: 'Follow-up consultation', date: '2024-02-15', time: '11:30 AM', type: 'video', status: 'scheduled' },
  { id: 'a3', patientName: 'Michael Brown', reason: 'Chest pain evaluation', date: '2024-02-15', time: '02:00 PM', type: 'in-person', status: 'scheduled' },
  { id: 'a4', patientName: 'Sophia Davis', reason: 'Blood pressure review', date: '2024-02-16', time: '09:00 AM', type: 'video', status: 'scheduled' },
  { id: 'a5', patientName: 'James Wilson', reason: 'Post-surgery follow-up', date: '2024-02-12', time: '03:30 PM', type: 'in-person', status: 'completed' },
  { id: 'a6', patientName: 'Olivia Martin', reason: 'ECG consultation', date: '2024-02-10', time: '01:00 PM', type: 'in-person', status: 'completed' },
  { id: 'a7', patientName: 'Liam Garcia', reason: 'Cancelled by patient', date: '2024-02-09', time: '04:00 PM', type: 'video', status: 'cancelled' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const DoctorAppointments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const filtered = appointments.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      a.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Scheduled', value: appointments.filter((a) => a.status === 'scheduled').length, color: 'blue' },
    { label: 'Completed', value: appointments.filter((a) => a.status === 'completed').length, color: 'green' },
    { label: 'Cancelled', value: appointments.filter((a) => a.status === 'cancelled').length, color: 'red' }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Appointments</h1>
            <p className="text-gray-600">Manage your patient appointments and consultations</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
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
                placeholder="Search patient..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patientName}`}
                      alt={apt.patientName}
                      className="w-12 h-12 rounded-full bg-gray-100"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{apt.patientName}</h4>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                      <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{apt.date}</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{apt.time}</span>
                        <span className="capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{apt.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                    {apt.status === 'scheduled' ? (
                      <div className="flex gap-2">
                        {apt.type === 'video' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <Video className="w-4 h-4" /> Start
                          </button>
                        )}
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                          <User className="w-4 h-4" /> View
                        </button>
                      </div>
                    ) : apt.status === 'completed' ? (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Completed
                      </span>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments</h3>
                <p className="text-gray-600">No appointments match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorAppointments;
