'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Phone, Mail, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface WalkInPatient {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  registeredAt: string;
  status: 'waiting' | 'assigned';
}

const initialPatients: WalkInPatient[] = [
  { id: 'wp1', name: 'Tom Walker', phone: '+1 555-0101', email: 'tom.w@email.com', reason: 'Fever & cough', registeredAt: '10:05 AM', status: 'waiting' },
  { id: 'wp2', name: 'Susan Reed', phone: '+1 555-0102', email: 'susan.r@email.com', reason: 'Minor injury', registeredAt: '10:22 AM', status: 'assigned' },
  { id: 'wp3', name: 'David Nguyen', phone: '+1 555-0103', email: 'david.n@email.com', reason: 'Follow-up visit', registeredAt: '11:00 AM', status: 'waiting' }
];

const ReceptionPatients: React.FC = () => {
  const [patients, setPatients] = useState<WalkInPatient[]>(initialPatients);
  const [search, setSearch] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: '' });

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setPatients((prev) => [
      { id: `wp-${Date.now()}`, ...form, registeredAt: time, status: 'waiting' },
      ...prev
    ]);
    setForm({ name: '', phone: '', email: '', reason: '' });
    setShowRegister(false);
  };

  const assignDoctor = (id: string) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'assigned' } : p)));
  };

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Walk-in Patients</h1>
              <p className="text-gray-600 dark:text-gray-400">Register and manage walk-in patient records</p>
            </motion.div>
            <button
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Register Walk-in
            </button>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div className="grid gap-6">
            {filtered.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{patient.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${patient.status === 'assigned' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                        {patient.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{patient.reason}</p>
                    <div className="flex flex-wrap gap-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {patient.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {patient.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Registered at {patient.registeredAt}</p>
                  </div>
                </div>
                {patient.status === 'waiting' && (
                  <button onClick={() => assignDoctor(patient.id)} className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 shrink-0">
                    Assign Doctor
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {showRegister && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Register Walk-in Patient</h3>
                <button onClick={() => setShowRegister(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
                  <textarea required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                  Register Patient
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ReceptionPatients;
