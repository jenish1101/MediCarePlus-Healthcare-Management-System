'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Search, DollarSign, Package, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ReturnRequest {
  id: string;
  orderId: string;
  patientName: string;
  medicines: string[];
  amount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'refunded' | 'rejected';
}

const initialReturns: ReturnRequest[] = [
  { id: 'RET-001', orderId: 'ord2', patientName: 'John Patient', medicines: ['Paracetamol 500mg'], amount: 28, reason: 'Wrong dosage ordered', requestDate: '2024-02-13', status: 'pending' },
  { id: 'RET-002', orderId: 'ord3', patientName: 'Emma Thompson', medicines: ['Amoxicillin 500mg'], amount: 17, reason: 'Order cancelled before shipping', requestDate: '2024-02-12', status: 'approved' },
  { id: 'RET-003', orderId: 'ord1', patientName: 'John Patient', medicines: ['Ibuprofen 400mg', 'Vitamin B Complex'], amount: 65, reason: 'Duplicate order', requestDate: '2024-02-08', status: 'refunded' },
  { id: 'RET-004', orderId: 'ord4', patientName: 'Michael Brown', medicines: ['Aspirin 75mg'], amount: 9, reason: 'Patient no longer needs medication', requestDate: '2024-02-06', status: 'rejected' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    refunded: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const PharmacyReturns: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>(initialReturns);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleAction = (id: string, action: 'approved' | 'refunded' | 'rejected') => {
    setReturns((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
  };

  const filtered = returns.filter(
    (r) =>
      (filter === 'all' || r.status === filter) &&
      (r.patientName.toLowerCase().includes(search.toLowerCase()) ||
        r.orderId.toLowerCase().includes(search.toLowerCase()))
  );

  const pending = returns.filter((r) => r.status === 'pending').length;
  const refundedTotal = returns.filter((r) => r.status === 'refunded').reduce((s, r) => s + r.amount, 0);

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Returns & Refunds</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Handle cancelled orders and medicine returns</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{pending}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Pending</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{returns.filter((r) => r.status === 'refunded').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Refunded</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">${refundedTotal}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Total Refunded</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['all', 'pending', 'approved', 'refunded', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                    filter === f ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
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
                placeholder="Search returns..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filtered.map((ret, i) => (
              <motion.div
                key={ret.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">{ret.id}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(ret.status)}`}>
                          {ret.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Order: {ret.orderId} · Patient: {ret.patientName}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Reason: {ret.reason}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {ret.medicines.map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            <Package className="w-3 h-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Requested: {ret.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700 sm:border-0 sm:pt-0">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${ret.amount}</p>
                    {ret.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(ret.id, 'approved')}
                          className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(ret.id, 'rejected')}
                          className="flex-1 sm:flex-none px-3 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {ret.status === 'approved' && (
                      <button
                        onClick={() => handleAction(ret.id, 'refunded')}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" /> Process Refund
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
                <RotateCcw className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No returns found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyReturns;
