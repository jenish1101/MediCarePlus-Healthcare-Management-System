'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Bed, TrendingUp, Stethoscope, Megaphone, Package, ScrollText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments, mockBeds, mockInventory } from '@/data/mockData';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const stats: Array<{ icon: typeof Users; label: string; value: string | number; change: string; color: ThemeColor }> = [
    { icon: Users, label: 'Total Patients', value: '2,543', change: '+12%', color: 'blue' },
    { icon: Calendar, label: 'Appointments Today', value: '48', change: '+8%', color: 'green' },
    { icon: DollarSign, label: 'Monthly Revenue', value: '$124,500', change: '+15%', color: 'purple' },
    { icon: Bed, label: 'Available Beds', value: mockBeds.filter(b => b.status === 'available').length, change: '-2', color: 'orange' }
  ];

  const quickActions: Array<{ label: string; icon: typeof Stethoscope; path: string; color: ThemeColor }> = [
    { label: 'Doctor Onboarding', icon: Stethoscope, path: '/admin/doctor-onboarding', color: 'blue' },
    { label: 'Hospital Inventory', icon: Package, path: '/admin/inventory', color: 'green' },
    { label: 'Announcements', icon: Megaphone, path: '/admin/announcements', color: 'purple' },
    { label: 'Audit Log', icon: ScrollText, path: '/admin/audit-log', color: 'orange' }
  ];

  const appointmentData = [
    { name: 'Mon', appointments: 45 },
    { name: 'Tue', appointments: 52 },
    { name: 'Wed', appointments: 48 },
    { name: 'Thu', appointments: 61 },
    { name: 'Fri', appointments: 55 },
    { name: 'Sat', appointments: 42 },
    { name: 'Sun', appointments: 38 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 85000 },
    { name: 'Feb', revenue: 92000 },
    { name: 'Mar', revenue: 98000 },
    { name: 'Apr', revenue: 105000 },
    { name: 'May', revenue: 112000 },
    { name: 'Jun', revenue: 124500 }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage your hospital operations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {quickActions.map((action) => {
                const colors = colorClasses[action.color];
                return (
                <button
                  key={action.path}
                  onClick={() => router.push(action.path)}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left min-w-0"
                >
                  <div className={`p-2 rounded-lg ${colors.bg100} shrink-0`}>
                    <action.icon className={`w-5 h-5 ${colors.text600}`} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{action.label}</span>
                </button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, i) => {
              const colors = colorClasses[stat.color];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 min-w-0"
              >
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} shrink-0`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                  </div>
                  <span className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 leading-snug">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Appointments Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Weekly Appointments</h3>
              <div className="h-56 sm:h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} width={32} />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Revenue Trend</h3>
              <div className="h-56 sm:h-64 md:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} width={44} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Bed Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Bed Management</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {['ICU', 'Private', 'General'].map((type) => {
                const typeBeds = mockBeds.filter(b => b.type === type);
                const available = typeBeds.filter(b => b.status === 'available').length;
                const occupied = typeBeds.filter(b => b.status === 'occupied').length;
                const total = typeBeds.length;
                const percentage = total > 0 ? (available / total) * 100 : 0;

                return (
                  <div key={type} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 sm:p-6">
                    <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-gray-900 dark:text-gray-100">{type} Beds</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Available</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Occupied</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">{occupied}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity & Inventory Alerts */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Recent Appointments</h3>
              <div className="space-y-2 sm:space-y-3">
                {mockAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate text-gray-900 dark:text-gray-100">{apt.patientName}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Dr. {apt.doctorName}</p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{apt.date}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center justify-between gap-2 text-gray-900 dark:text-gray-100">
                <span>Low Stock Alerts</span>
                <button onClick={() => router.push('/admin/inventory')} className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium shrink-0">
                  View all
                </button>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {mockInventory.filter(item => item.quantity < 500).map((item) => (
                  <div key={item.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="min-w-0">
                      <p className="font-medium text-yellow-900 dark:text-yellow-300 text-sm truncate">{item.medicineName}</p>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">Batch: {item.batchNumber}</p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">{item.quantity} left</p>
                      <button
                        onClick={() => router.push('/admin/inventory')}
                        className="text-xs text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300 font-medium"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
