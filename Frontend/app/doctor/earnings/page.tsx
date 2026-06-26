'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Wallet, Clock, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const monthly = [
  { month: 'Sep', earnings: 9800 },
  { month: 'Oct', earnings: 11200 },
  { month: 'Nov', earnings: 10500 },
  { month: 'Dec', earnings: 13400 },
  { month: 'Jan', earnings: 12100 },
  { month: 'Feb', earnings: 12450 }
];

const transactions = [
  { id: 't1', patient: 'John Patient', date: '2024-02-14', type: 'In-person', amount: 500 },
  { id: 't2', patient: 'Emma Thompson', date: '2024-02-13', type: 'Video', amount: 400 },
  { id: 't3', patient: 'Michael Brown', date: '2024-02-12', type: 'In-person', amount: 500 },
  { id: 't4', patient: 'Sophia Davis', date: '2024-02-10', type: 'Video', amount: 400 },
  { id: 't5', patient: 'James Wilson', date: '2024-02-08', type: 'In-person', amount: 550 }
];

const DoctorEarnings: React.FC = () => {
  const stats = [
    { icon: DollarSign, label: 'Total Earnings', value: '$78,450', color: 'blue' },
    { icon: TrendingUp, label: 'This Month', value: '$12,450', color: 'green' },
    { icon: Wallet, label: 'Pending Payout', value: '$3,200', color: 'purple' },
    { icon: Clock, label: 'Avg / Consult', value: '$480', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Earnings</h1>
              <p className="text-gray-600">Track your income and payouts</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" /> Export
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-6">Monthly Earnings</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="earnings" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3 pr-4 font-medium">Patient</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Type</th>
                    <th className="py-3 pr-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 text-sm hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{t.patient}</td>
                      <td className="py-3 pr-4 text-gray-600">{t.date}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${t.type === 'Video' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-green-600">+${t.amount}</td>
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

export default DoctorEarnings;
