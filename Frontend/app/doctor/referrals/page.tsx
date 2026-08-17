'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, UserPlus, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listReferrals, createReferral, mapReferral, Referral } from '@/api/referrals';
import { listPatients } from '@/api/users';

interface PatientOption {
  id: string;
  name: string;
}

const specialists = [
  { name: 'Dr. Sarah Chen', specialty: 'Cardiology' },
  { name: 'Dr. Robert Kim', specialty: 'Neurology' },
  { name: 'Dr. Lisa Patel', specialty: 'Endocrinology' },
  { name: 'Dr. Mark Johnson', specialty: 'Orthopedics' },
  { name: 'Dr. Anna Rivera', specialty: 'Pulmonology' }
];

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Pending' },
  accepted: { icon: AlertCircle, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', label: 'Accepted' },
  completed: { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Completed' }
};

const DoctorReferrals: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    specialist: '',
    specialty: '',
    reason: '',
    urgency: 'routine' as 'routine' | 'urgent'
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [referralsData, patientsData] = await Promise.all([
        listReferrals(),
        listPatients()
      ]);
      setPatients(patientsData.map((p) => ({ id: p.id, name: p.name })));
      setReferrals(
        referralsData.map(mapReferral).sort((a, b) => (a.date < b.date ? 1 : -1))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load referrals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSpecialistChange = (name: string) => {
    const spec = specialists.find((s) => s.name === name);
    setForm({ ...form, specialist: name, specialty: spec?.specialty || '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.specialist || !form.reason) return;
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await createReferral({
        patient_id: form.patientId,
        patient_name: patient.name,
        specialist: form.specialist,
        specialty: form.specialty,
        reason: form.reason,
        urgency: form.urgency,
        date: new Date().toISOString().slice(0, 10)
      });
      setReferrals((prev) => [mapReferral(created), ...prev]);
      setForm({ patientId: '', specialist: '', specialty: '', reason: '', urgency: 'routine' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit referral.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Referrals</h1>
            <p className="text-gray-600 dark:text-gray-400">Refer patients to specialists and track referral status</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6 h-fit order-2 lg:order-1"
            >
              <div className="flex items-center gap-2 mb-5">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">New Referral</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Patient</label>
                  <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select patient...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Specialist</label>
                  <select
                    value={form.specialist}
                    onChange={(e) => handleSpecialistChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Select specialist...</option>
                    {specialists.map((s) => (
                      <option key={s.name} value={s.name}>{s.name} — {s.specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Reason for Referral</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Clinical indication for referral..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Urgency</label>
                  <div className="flex gap-3">
                    {(['routine', 'urgent'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setForm({ ...form, urgency: u })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          form.urgency === u
                            ? u === 'urgent' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" /> {submitting ? 'Submitting...' : 'Submit Referral'}
                </button>
              </form>
            </motion.div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Referral History</h3>
              {loading && (
                <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading referrals...
                </div>
              )}
              {!loading && referrals.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No referrals yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Referrals you submit will appear here.</p>
                </div>
              )}
              {!loading && referrals.map((ref, i) => {
                const cfg = statusConfig[ref.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{ref.patientName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Referred to {ref.specialist} · {ref.specialty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          ref.urgency === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                          {ref.urgency}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3 mb-2">{ref.reason}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Submitted {ref.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorReferrals;
