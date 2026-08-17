'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, FileText, Clock, TrendingUp, CreditCard, Download, CheckCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listInvoices, payInvoice, mapInvoice, Invoice } from '@/api/billing';

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    overdue: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const PatientBilling: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidSuccess, setPaidSuccess] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listInvoices();
      setInvoices(data.map(mapInvoice));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filtered = invoices.filter((inv) => filter === 'all' || inv.status === filter);

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const stats = [
    { icon: TrendingUp, label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, color: 'green' },
    { icon: Clock, label: 'Pending', value: `$${pending.toLocaleString()}`, color: 'yellow' },
    { icon: DollarSign, label: 'Overdue', value: `$${overdue.toLocaleString()}`, color: 'red' },
    { icon: FileText, label: 'Invoices', value: invoices.length, color: 'blue' }
  ];

  const handlePay = async (id: string) => {
    setPayingId(id);
    setError('');
    try {
      const updated = await payInvoice(id);
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? mapInvoice(updated) : inv)));
      setPaidSuccess(id);
      setTimeout(() => setPaidSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not process payment.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Billing & Payments</h1>
              <p className="text-gray-600 dark:text-gray-400">View invoices and pay online</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" />
              Download Statements
            </button>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-4 shadow-lg dark:shadow-none dark:border dark:border-gray-700"
              >
                <div className={`p-3 rounded-lg bg-${s.color}-100 w-fit mb-4`}>
                  <s.icon className={`w-6 h-6 text-${s.color}-600`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading invoices...
            </div>
          ) : (
          <div className="space-y-6">
            {filtered.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{inv.id}</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{inv.service}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{inv.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${inv.amount.toLocaleString()}</p>

                    {inv.status !== 'paid' ? (
                      <button
                        onClick={() => handlePay(inv.id)}
                        disabled={payingId === inv.id}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        {payingId === inv.id ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    )}
                  </div>
                </div>

                {paidSuccess === inv.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Payment successful! Invoice {inv.id} has been paid.
                  </motion.div>
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No invoices found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different filter.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientBilling;
