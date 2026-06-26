'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ShoppingBag, Package, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  const stats = [
    { icon: DollarSign, label: 'Monthly Sales', value: '$45,230', color: 'green' },
    { icon: TrendingUp, label: 'Growth', value: '+12%', color: 'blue' },
    { icon: ShoppingBag, label: 'Orders', value: '328', color: 'purple' },
    { icon: Package, label: 'Units Sold', value: '4,030', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Sales</h1>
              <p className="text-gray-600">Track sales performance and top products</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
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
            <h3 className="text-xl font-semibold mb-6">Monthly Sales</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="sales" fill="#16a34a" radius={[8, 8, 0, 0]} />
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
            <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium text-right">Units Sold</th>
                    <th className="py-3 pr-4 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellers.map((p) => (
                    <tr key={p.name} className="border-b last:border-0 text-sm hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{p.name}</td>
                      <td className="py-3 pr-4 text-right text-gray-600">{p.units.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right font-semibold text-green-600">${p.revenue.toLocaleString()}</td>
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
