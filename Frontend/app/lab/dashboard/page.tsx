'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TestTube, FileText, Clock, CheckCircle, BookOpen, ScanBarcode, Wrench } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockLabReports } from '@/data/mockData';

const LabDashboard: React.FC = () => {
  const router = useRouter();
  const pending = mockLabReports.filter(r => r.status === 'pending').length;
  const completed = mockLabReports.filter(r => r.status === 'completed').length;

  const stats = [
    { icon: TestTube, label: 'Total Tests', value: mockLabReports.length, color: 'blue' },
    { icon: Clock, label: 'Pending', value: pending, color: 'yellow' },
    { icon: CheckCircle, label: 'Completed', value: completed, color: 'green' },
    { icon: FileText, label: 'Reports Generated', value: completed, color: 'purple' }
  ];

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white"
          >
            <h1 className="text-xl font-bold mb-2">Laboratory Dashboard</h1>
            <p className="text-white/90">Manage tests and generate reports</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700"
              >
                <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}-100 inline-block mb-2 sm:mb-4`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { href: '/lab/catalog', icon: BookOpen, label: 'Test Catalog', desc: 'Tests & pricing' },
              { href: '/lab/samples', icon: ScanBarcode, label: 'Sample Tracking', desc: 'Barcode workflow' },
              { href: '/lab/reports', icon: FileText, label: 'Reports', desc: 'View & download PDFs' },
              { href: '/lab/equipment', icon: Wrench, label: 'Equipment / QC', desc: 'Equipment status' }
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:bg-gray-700/70 transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <action.icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                <p className="font-semibold text-gray-900 dark:text-gray-100">{action.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
              </Link>
            ))}
          </motion.div>

          {/* Lab Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Lab Tests</h3>
              <Link href="/lab/tests" className="text-sm text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-6">
              {mockLabReports.map((report) => (
                <div key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:bg-gray-700/30 transition-shadow">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      report.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <TestTube className={`w-6 h-6 ${
                        report.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate text-gray-900 dark:text-gray-100">{report.testName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date: {report.date}</p>
                      {report.results && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.results}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap sm:shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'pending' ? (
                      <Link
                        href="/lab/tests"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block text-sm"
                      >
                        Upload Results
                      </Link>
                    ) : (
                      <button
                        onClick={() => router.push('/lab/reports')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        View Report
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabDashboard;
