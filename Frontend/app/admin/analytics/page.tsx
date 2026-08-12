'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Activity, Download, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { exportCsv, exportPdfReport } from '@/lib/exportReport';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const patientGrowth = [
  { month: 'Jan', patients: 1850 },
  { month: 'Feb', patients: 2020 },
  { month: 'Mar', patients: 2180 },
  { month: 'Apr', patients: 2310 },
  { month: 'May', patients: 2420 },
  { month: 'Jun', patients: 2543 }
];

const departmentLoad = [
  { dept: 'Cardiology', visits: 320 },
  { dept: 'Neurology', visits: 210 },
  { dept: 'Pediatrics', visits: 280 },
  { dept: 'Orthopedics', visits: 190 },
  { dept: 'Dermatology', visits: 150 }
];

const appointmentTypes = [
  { name: 'In-person', value: 620 },
  { name: 'Video', value: 380 },
  { name: 'Follow-up', value: 240 }
];

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e'];

const AdminAnalytics: React.FC = () => {
  const [exportMsg, setExportMsg] = useState('');

  const handleExportCsv = () => {
    exportCsv('analytics-report.csv', ['Category', 'Metric', 'Value'], [
      ...patientGrowth.map((r) => ['Patient Growth', r.month, r.patients]),
      ...departmentLoad.map((r) => ['Department Load', r.dept, r.visits]),
      ...appointmentTypes.map((r) => ['Appointment Type', r.name, r.value])
    ]);
    setExportMsg('CSV report downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const handleExportPdf = () => {
    exportPdfReport(
      'analytics-report.pdf',
      'Hospital Analytics Report',
      [
        `Total Patients: 2,543`,
        `Monthly Appointments: 1,240`,
        `Revenue: $124.5k`,
        `Bed Occupancy: 78%`,
        ...departmentLoad.map((d) => `${d.dept}: ${d.visits} visits`)
      ]
    );
    setExportMsg('PDF report downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const stats: Array<{ icon: typeof Users; label: string; value: string; change: string; color: ThemeColor }> = [
    { icon: Users, label: 'Total Patients', value: '2,543', change: '+12%', color: 'blue' },
    { icon: Calendar, label: 'Appointments (mo)', value: '1,240', change: '+8%', color: 'green' },
    { icon: DollarSign, label: 'Revenue (mo)', value: '$124.5k', change: '+15%', color: 'purple' },
    { icon: Activity, label: 'Bed Occupancy', value: '78%', change: '+3%', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Hospital performance and insights</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </motion.div>

          {exportMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 dark:text-green-400 font-medium">
              {exportMsg}
            </motion.p>
          )}

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
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} shrink-0`}>
                    <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                  </div>
                  <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium shrink-0">{s.change}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 leading-snug">{s.label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Patient Growth</h3>
              <div className="h-56 sm:h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientGrowth} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={40} />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} fill="url(#pg)" />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Department Load</h3>
              <div className="h-56 sm:h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentLoad} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="dept" axisLine={false} tickLine={false} width={72} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Appointment Distribution</h3>
            <div className="h-64 sm:h-72 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {appointmentTypes.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAnalytics;
