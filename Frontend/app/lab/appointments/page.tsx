'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, MapPin, Home, Building, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LabAppointment {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  time: string;
  mode: 'in-lab' | 'home-collection';
  status: 'scheduled' | 'collected' | 'completed';
}

const initialAppointments: LabAppointment[] = [
  { id: 'la1', patientName: 'John Patient', testName: 'Complete Blood Count (CBC)', date: '2024-02-16', time: '09:00 AM', mode: 'in-lab', status: 'scheduled' },
  { id: 'la2', patientName: 'Emma Thompson', testName: 'Lipid Profile', date: '2024-02-16', time: '10:30 AM', mode: 'home-collection', status: 'scheduled' },
  { id: 'la3', patientName: 'Sophia Davis', testName: 'Thyroid Panel', date: '2024-02-15', time: '11:00 AM', mode: 'in-lab', status: 'collected' },
  { id: 'la4', patientName: 'James Wilson', testName: 'Blood Glucose (Fasting)', date: '2024-02-14', time: '08:00 AM', mode: 'home-collection', status: 'completed' },
  { id: 'la5', patientName: 'Michael Brown', testName: 'Liver Function Test', date: '2024-02-17', time: '02:00 PM', mode: 'in-lab', status: 'scheduled' }
];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    collected: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const LabAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<LabAppointment[]>(initialAppointments);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const markCollected = (id: string) =>
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'collected' } : a)));

  const filtered = appointments.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      (a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.testName.toLowerCase().includes(search.toLowerCase()))
  );

  const filters = ['all', 'scheduled', 'collected', 'completed'];
  const stats = [
    { label: 'Total', value: appointments.length, color: 'blue' },
    { label: 'Scheduled', value: appointments.filter((a) => a.status === 'scheduled').length, color: 'yellow' },
    { label: 'Collected', value: appointments.filter((a) => a.status === 'collected').length, color: 'purple' },
    { label: 'Completed', value: appointments.filter((a) => a.status === 'completed').length, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Appointments</h1>
            <p className="text-gray-600">Sample collection schedule</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 shadow-lg text-center"
              >
                <p className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
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
                placeholder="Search patient or test..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patientName}`}
                      alt={apt.patientName}
                      className="w-12 h-12 rounded-full bg-gray-100"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{apt.patientName}</h4>
                      <p className="text-sm text-gray-600">{apt.testName}</p>
                      <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{apt.date}</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{apt.time}</span>
                        <span className="flex items-center gap-1">
                          {apt.mode === 'home-collection' ? <Home className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                          {apt.mode === 'home-collection' ? 'Home Collection' : 'In-Lab'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(apt.status)}`}>
                      {apt.status}
                    </span>
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => markCollected(apt.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" /> Mark Collected
                      </button>
                    )}
                    {apt.status !== 'scheduled' && (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> {apt.status === 'collected' ? 'Sample collected' : 'Completed'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabAppointments;
