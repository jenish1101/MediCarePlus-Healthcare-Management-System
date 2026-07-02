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
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  accepted: { icon: AlertCircle, color: 'bg-blue-100 text-blue-700', label: 'Accepted' },
  completed: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completed' }
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Referrals</h1>
            <p className="text-gray-600">Refer patients to specialists and track referral status</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 h-fit"
            >
              <div className="flex items-center gap-2 mb-5">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold">New Referral</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                  <input
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    placeholder="e.g. John Patient"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Specialist</label>
                  <select
                    value={form.specialist}
                    onChange={(e) => handleSpecialistChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select specialist...</option>
                    {specialists.map((s) => (
                      <option key={s.name} value={s.name}>{s.name} — {s.specialty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Reason for Referral</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Clinical indication for referral..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Urgency</label>
                  <div className="flex gap-3">
                    {(['routine', 'urgent'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setForm({ ...form, urgency: u })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          form.urgency === u
                            ? u === 'urgent' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Referral History</h3>
              {referrals.map((ref, i) => {
                const cfg = statusConfig[ref.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{ref.patientName}</h4>
                        <p className="text-sm text-gray-600">
                          Referred to {ref.specialist} · {ref.specialty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          ref.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ref.urgency}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-2">{ref.reason}</p>
                    <p className="text-xs text-gray-500">Submitted {ref.date}</p>
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
