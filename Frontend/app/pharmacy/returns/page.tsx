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
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    refunded: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
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
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Returns & Refunds</h1>
            <p className="text-gray-600">Handle cancelled orders and medicine returns</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6 max-w-2xl">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pending}</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{returns.filter((r) => r.status === 'refunded').length}</p>
                <p className="text-gray-500 text-sm">Refunded</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">${refundedTotal}</p>
                <p className="text-gray-500 text-sm">Total Refunded</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'approved', 'refunded', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
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
                placeholder="Search returns..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((ret, i) => (
              <motion.div
                key={ret.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg">{ret.id}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(ret.status)}`}>
                          {ret.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Order: {ret.orderId} · Patient: {ret.patientName}</p>
                      <p className="text-sm text-gray-500 mt-1">Reason: {ret.reason}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {ret.medicines.map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            <Package className="w-3 h-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Requested: {ret.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <p className="text-lg font-bold text-gray-900">${ret.amount}</p>
                    {ret.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(ret.id, 'approved')}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(ret.id, 'rejected')}
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {ret.status === 'approved' && (
                      <button
                        onClick={() => handleAction(ret.id, 'refunded')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" /> Process Refund
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No returns found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyReturns;
