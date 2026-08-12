'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Download, Clock, CheckCircle, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockLabReports } from '@/data/mockData';

const PatientLabReports: React.FC = () => {
  const completed = mockLabReports.filter(r => r.status === 'completed').length;
  const pending = mockLabReports.filter(r => r.status === 'pending').length;

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Lab Reports</h1>
              <p className="text-gray-600 dark:text-gray-400">Access your test results and reports</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              <Plus className="w-5 h-5" />
              Book Lab Test
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 sm:gap-6 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{completed}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{pending}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {mockLabReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${report.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                      <TestTube className={`w-6 h-6 ${report.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{report.testName}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {report.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                    {report.status}
                  </span>
                </div>

                {report.results ? (
                  <>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                      <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Results:</span> {report.results}</p>
                      {report.doctorNotes && (
                        <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Doctor&apos;s Notes:</span> {report.doctorNotes}</p>
                      )}
                    </div>
                    <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </>
                ) : (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    Results are being processed. You&apos;ll be notified when ready.
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientLabReports;
