'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
  CreditCard,
  Phone
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CoverageItem {
  category: string;
  covered: string;
  copay: string;
  limit: string;
  status: 'active' | 'limited';
}

const coverageItems: CoverageItem[] = [
  { category: 'Primary Care Visits', covered: '100%', copay: '$25', limit: 'Unlimited', status: 'active' },
  { category: 'Specialist Consultations', covered: '80%', copay: '$50', limit: '12/year', status: 'active' },
  { category: 'Emergency Room', covered: '90%', copay: '$150', limit: 'Unlimited', status: 'active' },
  { category: 'Lab Tests & Diagnostics', covered: '100%', copay: '$0', limit: 'Unlimited', status: 'active' },
  { category: 'Prescription Medications', covered: '70%', copay: '$15', limit: '$2,000/year', status: 'active' },
  { category: 'Mental Health Services', covered: '80%', copay: '$30', limit: '20 sessions/year', status: 'active' },
  { category: 'Physical Therapy', covered: '70%', copay: '$40', limit: '30 sessions/year', status: 'limited' },
  { category: 'Dental Care', covered: '50%', copay: '$50', limit: '$1,500/year', status: 'limited' }
];

const PatientInsurance: React.FC = () => {
  const stats = [
    { label: 'Annual Deductible', value: '$500', sub: '$320 met', color: 'blue' },
    { label: 'Out-of-Pocket Max', value: '$3,000', sub: '$890 used', color: 'green' },
    { label: 'Coverage Categories', value: coverageItems.length, sub: 'Active plan', color: 'purple' },
    { label: 'Plan Status', value: 'Active', sub: 'Valid through Dec 2024', color: 'indigo' }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Insurance Coverage</h1>
            <p className="text-gray-600 dark:text-gray-400">View your health insurance plan details</p>
          </motion.div>

          {/* Policy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 sm:p-8 text-white shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-8 h-8" />
                  <span className="text-sm font-medium text-white/80">Health Insurance Plan</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-1">BlueCross Premier PPO</h2>
                <p className="text-white/80">Comprehensive health coverage for you and your family</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-5 space-y-3 min-w-[220px]">
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Policy Number</p>
                  <p className="font-mono font-bold text-lg">BCX-2024-7894561</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Group ID</p>
                  <p className="font-mono font-semibold">GRP-HMS-1024</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Member ID</p>
                  <p className="font-mono font-semibold">MEM-JP-001234</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Provider</p>
                  <p className="font-semibold">BlueCross Health Insurance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Effective Date</p>
                  <p className="font-semibold">Jan 1, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Member Services</p>
                  <p className="font-semibold">1-800-555-0199</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700"
              >
                <p className={`text-lg font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm mt-1">{s.label}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Deductible Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">Deductible Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">$320 of $500 met</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">64%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: '64%' }} />
              </div>
            </div>
          </motion.div>

          {/* Coverage Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Coverage Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Covered</th>
                    <th className="py-3 px-4 font-medium">Copay</th>
                    <th className="py-3 px-4 font-medium">Annual Limit</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {coverageItems.map((item) => (
                    <tr key={item.category} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{item.category}</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">{item.covered}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.copay}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.limit}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}
                        >
                          {item.status === 'active' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientInsurance;
