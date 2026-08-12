'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, UserPlus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Referral {
  id: string;
  patientName: string;
  specialist: string;
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent';
  status: 'pending' | 'accepted' | 'completed';
  date: string;
}

const specialists = [
  { name: 'Dr. Sarah Chen', specialty: 'Cardiology' },
  { name: 'Dr. Robert Kim', specialty: 'Neurology' },
  { name: 'Dr. Lisa Patel', specialty: 'Endocrinology' },
  { name: 'Dr. Mark Johnson', specialty: 'Orthopedics' },
  { name: 'Dr. Anna Rivera', specialty: 'Pulmonology' }
];

const initialReferrals: Referral[] = [
  {
    id: 'ref1',
    patientName: 'Michael Brown',
    specialist: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    reason: 'Stress test evaluation for atypical chest pain',
    urgency: 'urgent',
    status: 'pending',
    date: '2024-02-14'
  },
  {
    id: 'ref2',
    patientName: 'Olivia Martin',
    specialist: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    reason: 'Echocardiogram for palpitations workup',
    urgency: 'routine',
    status: 'accepted',
    date: '2024-02-10'
  },
  {
    id: 'ref3',
    patientName: 'James Wilson',
    specialist: 'Dr. Mark Johnson',
    specialty: 'Orthopedics',
    reason: 'Post-CABG rehabilitation assessment',
    urgency: 'routine',
    status: 'completed',
    date: '2024-01-20'
  }
];

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Pending' },
  accepted: { icon: AlertCircle, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', label: 'Accepted' },
  completed: { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Completed' }
};

const DoctorReferrals: React.FC = () => {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [form, setForm] = useState({
    patientName: '',
    specialist: '',
    specialty: '',
    reason: '',
    urgency: 'routine' as 'routine' | 'urgent'
  });

  const handleSpecialistChange = (name: string) => {
    const spec = specialists.find((s) => s.name === name);
    setForm({ ...form, specialist: name, specialty: spec?.specialty || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.specialist || !form.reason) return;
    setReferrals((prev) => [
      {
        id: `ref${Date.now()}`,
        patientName: form.patientName,
        specialist: form.specialist,
        specialty: form.specialty,
        reason: form.reason,
        urgency: form.urgency,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);
    setForm({ patientName: '', specialist: '', specialty: '', reason: '', urgency: 'routine' });
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Referrals</h1>
            <p className="text-gray-600 dark:text-gray-400">Refer patients to specialists and track referral status</p>
          </motion.div>

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
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Patient Name</label>
                  <input
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    placeholder="e.g. John Patient"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    required
                  />
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
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Submit Referral
                </button>
              </form>
            </motion.div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Referral History</h3>
              {referrals.map((ref, i) => {
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
