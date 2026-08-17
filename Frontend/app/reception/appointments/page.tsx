'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Clock, Video, MapPin, Plus, X, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listAppointments, createAppointment, updateAppointment, mapAppointment } from '@/api/appointments';
import { listDoctors, mapDoctor } from '@/api/doctors';
import { listPatients, BackendPatientSummary } from '@/api/users';
import { Appointment, Doctor } from '@/types';

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    rescheduled: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

const ReceptionAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<BackendPatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [showBook, setShowBook] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '09:00 AM',
    type: 'in-person' as 'in-person' | 'video',
    reason: ''
  });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [apts, docs, pats] = await Promise.all([
        listAppointments(),
        listDoctors(),
        listPatients()
      ]);
      setAppointments(apts.map(mapAppointment));
      setDoctors(docs.map(mapDoctor));
      setPatients(pats);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      patientId: f.patientId || patients[0]?.id || '',
      doctorId: f.doctorId || doctors[0]?.id || ''
    }));
  }, [patients, doctors]);

  const filtered = appointments.filter(
    (a) =>
      (filter === 'all' || a.status === filter) &&
      (a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(search.toLowerCase()))
  );

  const resetForm = () =>
    setForm({ patientId: patients[0]?.id || '', doctorId: doctors[0]?.id || '', date: '', time: '09:00 AM', type: 'in-person', reason: '' });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId) return;
    setSaving(true);
    setError('');
    try {
      const created = await createAppointment({
        doctor_id: form.doctorId,
        date: form.date,
        time: form.time,
        reason: form.reason || 'Reception booking',
        appointment_type: form.type,
        patient_id: form.patientId
      });
      setAppointments((prev) => [mapAppointment(created), ...prev]);
      setShowBook(false);
      resetForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not book appointment.');
    } finally {
      setSaving(false);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateAppointment(rescheduleId, {
        date: form.date,
        time: form.time,
        appointment_type: form.type
      });
      const mapped = mapAppointment(updated);
      setAppointments((prev) => prev.map((a) => (a.id === mapped.id ? mapped : a)));
      setRescheduleId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reschedule appointment.');
    } finally {
      setSaving(false);
    }
  };

  const openReschedule = (apt: Appointment) => {
    setForm({ patientId: apt.patientId, doctorId: apt.doctorId, date: apt.date, time: apt.time, type: apt.type === 'video' ? 'video' : 'in-person', reason: apt.reason });
    setRescheduleId(apt.id);
  };

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Appointments</h1>
              <p className="text-gray-600 dark:text-gray-400">Book and reschedule patient appointments</p>
            </motion.div>
            <button
              onClick={() => setShowBook(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Book Appointment
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-teal-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or doctor..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading appointments...
            </div>
          ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">Doctor</th>
                    <th className="py-3 px-4 font-medium">Date &amp; Time</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{apt.patientName}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 dark:text-gray-100">{apt.doctorName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{apt.doctorSpecialization}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {apt.date}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" /> {apt.time}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                          {apt.type === 'video' ? <Video className="w-4 h-4 text-blue-500 dark:text-blue-400" /> : <MapPin className="w-4 h-4 text-green-500 dark:text-green-400" />}
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
                          <button onClick={() => openReschedule(apt)} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
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
          )}
        </div>

        {(showBook || rescheduleId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{rescheduleId ? 'Reschedule' : 'Book Appointment'}</h3>
                <button onClick={() => { setShowBook(false); setRescheduleId(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={rescheduleId ? handleReschedule : handleBook} className="space-y-6">
                {!rescheduleId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
                      <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100">
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
                      <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100">
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                      <input required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for visit" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100">
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'in-person' | 'video' })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100">
                    <option value="in-person">In-person</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <button type="submit" disabled={saving} className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50">
                  {saving ? 'Saving...' : rescheduleId ? 'Save Changes' : 'Book Appointment'}
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
