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
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Doctor Onboarding</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Review and approve pending doctor registrations</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{pendingCount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Pending</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{doctors.filter((d) => d.status === 'approved').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Approved</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-5 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{doctors.filter((d) => d.status === 'rejected').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Rejected</p>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">{doc.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{doc.email}</p>
                        </div>
                        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${statusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {doc.specialization} · {doc.experience} yrs experience
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Submitted: {doc.submittedAt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {doc.qualifications.map((q) => (
                          <span key={q} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{q}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {doc.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <button
                        onClick={() => handleAction(doc.id, 'approved')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(doc.id, 'rejected')}
                        className="flex-1 sm:flex-none px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No registrations found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDoctorOnboarding;
