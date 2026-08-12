'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ShoppingBag, Package, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const monthlySales = [
  { month: 'Sep', sales: 32000 },
  { month: 'Oct', sales: 38500 },
  { month: 'Nov', sales: 41200 },
  { month: 'Dec', sales: 47800 },
  { month: 'Jan', sales: 43000 },
  { month: 'Feb', sales: 45230 }
];

const topSellers = [
  { name: 'Paracetamol 500mg', units: 1240, revenue: 620 },
  { name: 'Ibuprofen 400mg', units: 980, revenue: 784 },
  { name: 'Vitamin B Complex', units: 760, revenue: 456 },
  { name: 'Aspirin 75mg', units: 640, revenue: 192 },
  { name: 'Amoxicillin 500mg', units: 410, revenue: 492 }
];

const PharmacySales: React.FC = () => {
  const stats: Array<{ icon: typeof DollarSign; label: string; value: string; color: ThemeColor }> = [
    { icon: DollarSign, label: 'Monthly Sales', value: '$45,230', color: 'green' },
    { icon: TrendingUp, label: 'Growth', value: '+12%', color: 'blue' },
    { icon: ShoppingBag, label: 'Orders', value: '328', color: 'purple' },
    { icon: Package, label: 'Units Sold', value: '4,030', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Sales</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Track sales performance and top products</p>
            </div>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Export
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
                <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} w-fit mb-2 sm:mb-4`}>
                  <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{s.label}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{s.value}</p>
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
            <h3 className="text-base sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Monthly Sales</h3>
            <div className="h-48 sm:h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} width={45} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
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
            <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Top Selling Products</h3>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {topSellers.map((p) => (
                <div key={p.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.units.toLocaleString()} units sold</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 shrink-0">${p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium text-right">Units Sold</th>
                    <th className="py-3 pr-4 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellers.map((p) => (
                    <tr key={p.name} className="border-b border-gray-200 dark:border-gray-700 last:border-0 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-100">{p.name}</td>
                      <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-400">{p.units.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right font-semibold text-green-600 dark:text-green-400">${p.revenue.toLocaleString()}</td>
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

export default PharmacySales;
