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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Lab Reports</h1>
              <p className="text-gray-600">Access your test results and reports</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              <Plus className="w-5 h-5" />
              Book Lab Test
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 sm:gap-6 max-w-md">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{completed}</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{pending}</p>
                <p className="text-gray-600 text-sm">Pending</p>
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
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${report.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <TestTube className={`w-6 h-6 ${report.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{report.testName}</h4>
                      <p className="text-gray-600 text-sm">Date: {report.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {report.status}
                  </span>
                </div>

                {report.results ? (
                  <>
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-gray-700"><span className="font-medium">Results:</span> {report.results}</p>
                      {report.doctorNotes && (
                        <p className="text-gray-700"><span className="font-medium">Doctor&apos;s Notes:</span> {report.doctorNotes}</p>
                      )}
                    </div>
                    <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download Report</span>
                    </button>
                  </>
                ) : (
                  <div className="border-t pt-4 flex items-center text-yellow-600 text-sm font-medium">
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
