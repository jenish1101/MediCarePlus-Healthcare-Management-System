'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Clock, Video, MapPin, Plus, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments, mockDoctors } from '@/data/mockData';

interface AptRow {
  id: string;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const extra: AptRow[] = [
  { id: 'apt4', patientName: 'Emma Thompson', doctorName: 'Dr. Sarah Wilson', doctorSpecialization: 'Cardiology', date: '2024-02-16', time: '09:00 AM', type: 'video', status: 'scheduled' },
  { id: 'apt5', patientName: 'Michael Brown', doctorName: 'Dr. James Anderson', doctorSpecialization: 'Orthopedics', date: '2024-02-14', time: '01:00 PM', type: 'in-person', status: 'completed' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const ReceptionAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AptRow[]>([...(mockAppointments as AptRow[]), ...extra]);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [showBook, setShowBook] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [form, setForm] = useState({ patientName: '', doctorId: mockDoctors[0]?.id ?? '', date: '', time: '09:00 AM', type: 'in-person' as 'in-person' | 'video' });

  const filtered = appointments.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      (a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = mockDoctors.find((d) => d.id === form.doctorId);
    if (!doctor) return;
    const newApt: AptRow = {
      id: `apt-${Date.now()}`,
      patientName: form.patientName,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'scheduled'
    };
    setAppointments((prev) => [newApt, ...prev]);
    setShowBook(false);
    setForm({ patientName: '', doctorId: mockDoctors[0]?.id ?? '', date: '', time: '09:00 AM', type: 'in-person' });
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleId ? { ...a, date: form.date, time: form.time, type: form.type } : a
      )
    );
    setRescheduleId(null);
  };

  const openReschedule = (apt: AptRow) => {
    setForm({ patientName: apt.patientName, doctorId: '', date: apt.date, time: apt.time, type: apt.type });
    setRescheduleId(apt.id);
  };

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointments</h1>
              <p className="text-gray-600">Book and reschedule patient appointments</p>
            </motion.div>
            <button
              onClick={() => setShowBook(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Book Appointment
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
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
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">Doctor</th>
                    <th className="py-3 px-4 font-medium">Date &amp; Time</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{apt.patientName}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{apt.doctorName}</p>
                        <p className="text-sm text-gray-500">{apt.doctorSpecialization}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="flex items-center gap-1 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" /> {apt.date}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" /> {apt.time}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          {apt.type === 'video' ? <Video className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-green-500" />}
                          {apt.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {apt.status === 'scheduled' && (
                          <button onClick={() => openReschedule(apt)} className="text-sm font-medium text-teal-600 hover:text-teal-800">
                            Reschedule
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {(showBook || rescheduleId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-gray-900">{rescheduleId ? 'Reschedule' : 'Book Appointment'}</h3>
                <button onClick={() => { setShowBook(false); setRescheduleId(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={rescheduleId ? handleReschedule : handleBook} className="space-y-6">
                {!rescheduleId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                      <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                        {mockDoctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                    {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'in-person' | 'video' })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                    <option value="in-person">In-person</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                  {rescheduleId ? 'Save Changes' : 'Book Appointment'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ReceptionAppointments;
