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
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

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
  const stats: Array<{ icon: typeof DollarSign; label: string; value: string; color: ThemeColor }> = [
    { icon: DollarSign, label: 'Total Earnings', value: '$78,450', color: 'blue' },
    { icon: TrendingUp, label: 'This Month', value: '$12,450', color: 'green' },
    { icon: Wallet, label: 'Pending Payout', value: '$3,200', color: 'purple' },
    { icon: Clock, label: 'Avg / Consult', value: '$480', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Earnings</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Track your income and payouts</p>
            </div>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <Download className="w-5 h-5" /> Export
            </button>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 min-w-0"
              >
                <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} w-fit mb-3 sm:mb-4`}>
                  <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 leading-snug">{s.label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Monthly Earnings</h3>
            <div className="h-56 sm:h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 11 }} width={40} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="earnings" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Recent Transactions</h3>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{t.patient}</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 text-sm shrink-0">+${t.amount}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{t.date}</span>
                    <span className={`px-2 py-0.5 rounded ${t.type === 'Video' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                      {t.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 pr-4 font-medium">Patient</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Type</th>
                    <th className="py-3 pr-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-100">{t.patient}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{t.date}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${t.type === 'Video' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-green-600 dark:text-green-400">+${t.amount}</td>
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
