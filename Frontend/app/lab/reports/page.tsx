'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Eye, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Report {
  id: string;
  testName: string;
  patientName: string;
  date: string;
  status: 'ready' | 'processing';
  summary?: string;
}

const reports: Report[] = [
  { id: 'rep1', testName: 'Complete Blood Count (CBC)', patientName: 'John Patient', date: '2024-01-25', status: 'ready', summary: 'All values within normal range' },
  { id: 'rep2', testName: 'Thyroid Panel (T3, T4, TSH)', patientName: 'Sophia Davis', date: '2024-02-13', status: 'ready', summary: 'Normal thyroid function' },
  { id: 'rep3', testName: 'Blood Glucose (Fasting)', patientName: 'James Wilson', date: '2024-02-12', status: 'ready', summary: 'Slightly elevated - 110 mg/dL' },
  { id: 'rep4', testName: 'Lipid Profile', patientName: 'Emma Thompson', date: '2024-02-15', status: 'processing' },
  { id: 'rep5', testName: 'Liver Function Test', patientName: 'Michael Brown', date: '2024-02-14', status: 'processing' }
];

const LabReports: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');

  const filtered = reports.filter(
    (r) =>
      (filter === 'all' || r.status === filter) &&
      (r.testName.toLowerCase().includes(search.toLowerCase()) ||
        r.patientName.toLowerCase().includes(search.toLowerCase()))
  );

  const ready = reports.filter((r) => r.status === 'ready').length;
  const processing = reports.filter((r) => r.status === 'processing').length;

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Reports</h1>
            <p className="text-gray-600">View and download generated lab reports</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl">
            <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                <p className="text-gray-500 text-sm">Total</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ready}</p>
                <p className="text-gray-500 text-sm">Ready</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{processing}</p>
                <p className="text-gray-500 text-sm">Processing</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'ready', 'processing'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search report or patient..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${report.status === 'ready' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <FileText className={`w-6 h-6 ${report.status === 'ready' ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{report.testName}</h4>
                      <p className="text-sm text-gray-600">Patient: {report.patientName}</p>
                      <p className="text-xs text-gray-500 mt-1">Date: {report.date}</p>
                      {report.summary && (
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg px-3 py-2">{report.summary}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${report.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {report.status}
                    </span>
                    {report.status === 'ready' ? (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm flex items-center gap-2">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    ) : (
                      <span className="flex items-center text-yellow-600 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-1" /> Processing
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabReports;
