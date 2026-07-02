'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualifications: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialPending: PendingDoctor[] = [
  { id: 'pd1', name: 'Dr. Anita Kapoor', email: 'anita.kapoor@email.com', specialization: 'Cardiology', experience: 8, qualifications: ['MBBS', 'MD Cardiology'], submittedAt: '2024-02-14', status: 'pending' },
  { id: 'pd2', name: 'Dr. David Lee', email: 'david.lee@email.com', specialization: 'Neurology', experience: 12, qualifications: ['MBBS', 'DNB Neurology'], submittedAt: '2024-02-13', status: 'pending' },
  { id: 'pd3', name: 'Dr. Maria Santos', email: 'maria.santos@email.com', specialization: 'Pediatrics', experience: 6, qualifications: ['MBBS', 'MD Pediatrics'], submittedAt: '2024-02-12', status: 'pending' },
  { id: 'pd4', name: 'Dr. Kevin O\'Brien', email: 'kevin.obrien@email.com', specialization: 'Orthopedics', experience: 15, qualifications: ['MBBS', 'MS Orthopedics'], submittedAt: '2024-02-10', status: 'approved' },
  { id: 'pd5', name: 'Dr. Lisa Park', email: 'lisa.park@email.com', specialization: 'Dermatology', experience: 4, qualifications: ['MBBS'], submittedAt: '2024-02-08', status: 'rejected' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const AdminDoctorOnboarding: React.FC = () => {
  const [doctors, setDoctors] = useState<PendingDoctor[]>(initialPending);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, status: action } : d)));
  };

  const filtered = doctors.filter(
    (d) =>
      (filter === 'all' || d.status === filter) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = doctors.filter((d) => d.status === 'pending').length;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Doctor Onboarding</h1>
            <p className="text-gray-600">Review and approve pending doctor registrations</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{doctors.filter((d) => d.status === 'approved').length}</p>
                <p className="text-gray-500 text-sm">Approved</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{doctors.filter((d) => d.status === 'rejected').length}</p>
                <p className="text-gray-500 text-sm">Rejected</p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
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
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {doc.specialization} · {doc.experience} yrs experience
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Submitted: {doc.submittedAt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {doc.qualifications.map((q) => (
                          <span key={q} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{q}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    {doc.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(doc.id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(doc.id, 'rejected')}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No registrations found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDoctorOnboarding;
