'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Search, Download, FileText, TrendingUp, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { exportCsv, exportPdfReport } from '@/lib/exportReport';

interface Invoice {
  id: string;
  patient: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const invoices: Invoice[] = [
  { id: 'INV-2041', patient: 'John Patient', service: 'Cardiology Consultation', date: '2024-02-14', amount: 500, status: 'paid' },
  { id: 'INV-2042', patient: 'Emma Thompson', service: 'Video Consultation', date: '2024-02-13', amount: 400, status: 'pending' },
  { id: 'INV-2043', patient: 'Michael Brown', service: 'Orthopedic Surgery', date: '2024-02-10', amount: 4500, status: 'paid' },
  { id: 'INV-2044', patient: 'Sophia Davis', service: 'Lab Tests - Lipid Panel', date: '2024-02-08', amount: 180, status: 'overdue' },
  { id: 'INV-2045', patient: 'James Wilson', service: 'Post-surgery Follow-up', date: '2024-02-06', amount: 250, status: 'paid' },
  { id: 'INV-2046', patient: 'Olivia Martin', service: 'ECG + Consultation', date: '2024-02-04', amount: 320, status: 'pending' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const AdminBilling: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [exportMsg, setExportMsg] = useState('');

  const filtered = invoices.filter(
    (inv) =>
      (filter === 'all' || inv.status === filter) &&
      (inv.patient.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const stats = [
    { icon: TrendingUp, label: 'Collected', value: `$${totalRevenue.toLocaleString()}`, color: 'green' },
    { icon: Clock, label: 'Pending', value: `$${pending.toLocaleString()}`, color: 'yellow' },
    { icon: DollarSign, label: 'Overdue', value: `$${overdue.toLocaleString()}`, color: 'red' },
    { icon: FileText, label: 'Invoices', value: invoices.length, color: 'blue' }
  ];

  const handleExportCsv = () => {
    exportCsv(
      'billing-invoices.csv',
      ['Invoice ID', 'Patient', 'Service', 'Date', 'Amount', 'Status'],
      invoices.map((inv) => [inv.id, inv.patient, inv.service, inv.date, inv.amount, inv.status])
    );
    setExportMsg('CSV export downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const handleExportPdf = () => {
    exportPdfReport(
      'billing-report.pdf',
      'Billing & Invoices Report',
      [
        `Collected: $${totalRevenue.toLocaleString()}`,
        `Pending: $${pending.toLocaleString()}`,
        `Overdue: $${overdue.toLocaleString()}`,
        `Total Invoices: ${invoices.length}`,
        ...invoices.slice(0, 5).map((i) => `${i.id} — ${i.patient} — $${i.amount} (${i.status})`)
      ]
    );
    setExportMsg('PDF export downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Billing</h1>
              <p className="text-gray-600">Manage invoices and payments</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={handleExportPdf}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" /> Export PDF
              </button>
            </div>
          </motion.div>

          {exportMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 font-medium">
              {exportMsg}
            </motion.p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className={`p-3 rounded-lg bg-${s.color}-100 w-fit mb-4`}>
                  <s.icon className={`w-6 h-6 text-${s.color}-600`} />
                </div>
                <p className="text-gray-600 text-sm mb-1">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'paid', 'pending', 'overdue'] as const).map((f) => (
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
                placeholder="Search invoice or patient..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="py-3 px-4 font-medium">Invoice</th>
                    <th className="py-3 px-4 font-medium">Patient</th>
                    <th className="py-3 px-4 font-medium">Service</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{inv.id}</td>
                      <td className="py-3 px-4 text-gray-900">{inv.patient}</td>
                      <td className="py-3 px-4 text-gray-600">{inv.service}</td>
                      <td className="py-3 px-4 text-gray-600">{inv.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${inv.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminBilling;
