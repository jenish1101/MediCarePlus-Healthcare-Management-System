'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Activity, Building2, Download, FileText, Loader2 } from 'lucide-react';
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
import { ApiError } from '@/lib/api';
import { getAnalyticsSummary, AnalyticsSummary } from '@/api/analytics';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

// Illustrative breakdowns below (patient growth trend, per-department load,
// appointment-type split) have no equivalent endpoint on the backend yet —
// /analytics/summary only returns the four aggregate counts above. These
// stay as sample data for the charts; the KPI cards and exports use the
// live summary values.
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
  const [summary, setSummary] = useState<AnalyticsSummary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAnalyticsSummary();
      setSummary(data as AnalyticsSummary);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load analytics summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const occupied = summary.bed_occupancy?.occupied ?? 0;
  const totalBeds = summary.bed_occupancy?.total ?? 0;
  const occupancyPct = totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;

  const handleExportCsv = () => {
    exportCsv('analytics-report.csv', ['Category', 'Metric', 'Value'], [
      ['Summary', 'Total Users', summary.total_users ?? 0],
      ['Summary', 'Total Appointments', summary.total_appointments ?? 0],
      ['Summary', 'Bed Occupancy', `${occupied}/${totalBeds}`],
      ['Summary', 'Departments', summary.departments ?? 0],
      ...patientGrowth.map((r) => ['Patient Growth (sample)', r.month, r.patients]),
      ...departmentLoad.map((r) => ['Department Load (sample)', r.dept, r.visits]),
      ...appointmentTypes.map((r) => ['Appointment Type (sample)', r.name, r.value])
    ]);
    setExportMsg('CSV report downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const handleExportPdf = () => {
    exportPdfReport(
      'analytics-report.pdf',
      'Hospital Analytics Report',
      [
        `Total Users: ${summary.total_users ?? 0}`,
        `Total Appointments: ${summary.total_appointments ?? 0}`,
        `Bed Occupancy: ${occupied}/${totalBeds} (${occupancyPct}%)`,
        `Departments: ${summary.departments ?? 0}`,
        ...departmentLoad.map((d) => `${d.dept}: ${d.visits} visits (sample)`)
      ]
    );
    setExportMsg('PDF report downloaded.');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const stats: Array<{ icon: typeof Users; label: string; value: string; color: ThemeColor }> = [
    { icon: Users, label: 'Total Users', value: String(summary.total_users ?? '—'), color: 'blue' },
    { icon: Calendar, label: 'Total Appointments', value: String(summary.total_appointments ?? '—'), color: 'green' },
    { icon: Activity, label: 'Bed Occupancy', value: totalBeds > 0 ? `${occupied}/${totalBeds} (${occupancyPct}%)` : '—', color: 'orange' },
    { icon: Building2, label: 'Departments', value: String(summary.departments ?? '—'), color: 'purple' }
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

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading analytics...
            </div>
          ) : (
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
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 leading-snug">{s.label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
              </motion.div>
              );
            })}
          </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">Patient Growth</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">Sample trend — no historical time-series endpoint yet</p>
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
              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">Department Load</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">Sample data — backend only reports a department count</p>
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
            <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">Appointment Distribution</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">Sample breakdown — backend only reports a total appointment count</p>
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
