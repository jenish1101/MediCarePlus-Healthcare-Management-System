'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
  CreditCard,
  Phone,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { getMyInsurance, mapInsurance, InsurancePlan } from '@/api/insurance';

const PatientInsurance: React.FC = () => {
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInsurance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyInsurance();
      setPlan(data ? mapInsurance(data) : null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load insurance details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsurance();
  }, [loadInsurance]);

  const coverageItems = plan?.coverageItems ?? [];
  const deductiblePct = plan && plan.deductible > 0 ? Math.min(100, Math.round((plan.deductibleMet / plan.deductible) * 100)) : 0;

  const stats = plan
    ? [
        { label: 'Annual Deductible', value: `$${plan.deductible.toLocaleString()}`, sub: `$${plan.deductibleMet.toLocaleString()} met`, color: 'blue' },
        { label: 'Out-of-Pocket Max', value: `$${plan.outOfPocketMax.toLocaleString()}`, sub: `$${plan.outOfPocketUsed.toLocaleString()} used`, color: 'green' },
        { label: 'Coverage Categories', value: coverageItems.length, sub: 'Active plan', color: 'purple' },
        { label: 'Plan Status', value: 'Active', sub: `Effective ${plan.effectiveDate}`, color: 'indigo' }
      ]
    : [];

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

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading insurance details...
            </div>
          ) : !plan ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No insurance policy on file</h3>
              <p className="text-gray-600 dark:text-gray-400">Contact your provider to add insurance coverage to your account.</p>
            </div>
          ) : (
          <>
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
                <h2 className="text-lg sm:text-xl font-bold mb-1">{plan.planName}</h2>
                <p className="text-white/80">Comprehensive health coverage for you and your family</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-5 space-y-3 min-w-[220px]">
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Policy Number</p>
                  <p className="font-mono font-bold text-lg">{plan.policyNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Group ID</p>
                  <p className="font-mono font-semibold">{plan.groupNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Member ID</p>
                  <p className="font-mono font-semibold">{plan.memberId}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Provider</p>
                  <p className="font-semibold">{plan.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Effective Date</p>
                  <p className="font-semibold">{plan.effectiveDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Member Services</p>
                  <p className="font-semibold">{plan.memberServicesPhone}</p>
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
                <span className="text-gray-600 dark:text-gray-400">${plan.deductibleMet.toLocaleString()} of ${plan.deductible.toLocaleString()} met</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{deductiblePct}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${deductiblePct}%` }} />
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
          </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientInsurance;
