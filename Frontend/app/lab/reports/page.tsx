'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Search, Eye, CheckCircle, Clock, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { exportPdfReport } from '@/lib/exportReport';

interface Report {
  id: string;
  testName: string;
  patientName: string;
  date: string;
  status: 'ready' | 'processing';
  summary?: string;
  results?: { parameter: string; value: string; range: string; flag?: string }[];
}

const reports: Report[] = [
  {
    id: 'rep1',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'John Patient',
    date: '2024-01-25',
    status: 'ready',
    summary: 'All values within normal range',
    results: [
      { parameter: 'WBC', value: '7.2 K/uL', range: '4.5-11.0' },
      { parameter: 'RBC', value: '4.8 M/uL', range: '4.5-5.5' },
      { parameter: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5' },
      { parameter: 'Platelets', value: '245 K/uL', range: '150-400' }
    ]
  },
  {
    id: 'rep2',
    testName: 'Thyroid Panel (T3, T4, TSH)',
    patientName: 'Sophia Davis',
    date: '2024-02-13',
    status: 'ready',
    summary: 'Normal thyroid function',
    results: [
      { parameter: 'TSH', value: '2.1 mIU/L', range: '0.4-4.0' },
      { parameter: 'Free T4', value: '1.2 ng/dL', range: '0.8-1.8' },
      { parameter: 'Free T3', value: '3.1 pg/mL', range: '2.3-4.2' }
    ]
  },
  {
    id: 'rep3',
    testName: 'Blood Glucose (Fasting)',
    patientName: 'James Wilson',
    date: '2024-02-12',
    status: 'ready',
    summary: 'Slightly elevated - 110 mg/dL',
    results: [{ parameter: 'Glucose (Fasting)', value: '110 mg/dL', range: '70-100', flag: 'High' }]
  },
  { id: 'rep4', testName: 'Lipid Profile', patientName: 'Emma Thompson', date: '2024-02-15', status: 'processing' },
  { id: 'rep5', testName: 'Liver Function Test', patientName: 'Michael Brown', date: '2024-02-14', status: 'processing' }
];

const LabReports: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');
  const [viewReport, setViewReport] = useState<Report | null>(null);

  const filtered = reports.filter(
    (r) =>
      (filter === 'all' || r.status === filter) &&
      (r.testName.toLowerCase().includes(search.toLowerCase()) ||
        r.patientName.toLowerCase().includes(search.toLowerCase()))
  );

  const ready = reports.filter((r) => r.status === 'ready').length;
  const processing = reports.filter((r) => r.status === 'processing').length;

  const downloadReport = (report: Report) => {
    const lines = [
      `Patient: ${report.patientName}`,
      `Test: ${report.testName}`,
      `Date: ${report.date}`,
      report.summary ?? '',
      ...(report.results?.map((r) => `${r.parameter}: ${r.value} (${r.range})${r.flag ? ` [${r.flag}]` : ''}`) ?? [])
    ].filter(Boolean);
    exportPdfReport(`lab-report-${report.id}.pdf`, report.testName, lines);
  };

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
            <p className="text-gray-600">View and download generated lab reports</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6 max-w-2xl">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{reports.length}</p>
                <p className="text-gray-500 text-sm">Total</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{ready}</p>
                <p className="text-gray-500 text-sm">Ready</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{processing}</p>
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

          <div className="space-y-6">
            {filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-6">
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
                        <button
                          onClick={() => setViewReport(report)}
                          className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => downloadReport(report)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                        >
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
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {viewReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setViewReport(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-purple-50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lab Report</h2>
                    <p className="text-sm text-gray-600">{viewReport.testName}</p>
                  </div>
                  <button onClick={() => setViewReport(null)} className="p-2 rounded-lg hover:bg-purple-100 text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 font-mono text-sm space-y-6">
                    <div className="text-center border-b border-gray-300 pb-4">
                      <p className="font-bold text-lg text-gray-900">MediCare Plus Laboratory</p>
                      <p className="text-gray-600">Official Test Report</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-700">
                      <p><span className="text-gray-500">Patient:</span> {viewReport.patientName}</p>
                      <p><span className="text-gray-500">Report ID:</span> {viewReport.id.toUpperCase()}</p>
                      <p><span className="text-gray-500">Test:</span> {viewReport.testName}</p>
                      <p><span className="text-gray-500">Date:</span> {viewReport.date}</p>
                    </div>
                    {viewReport.summary && (
                      <p className="text-gray-800 bg-white rounded-lg p-3 border border-gray-200">{viewReport.summary}</p>
                    )}
                    {viewReport.results && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="py-2 text-gray-600">Parameter</th>
                            <th className="py-2 text-gray-600">Value</th>
                            <th className="py-2 text-gray-600">Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewReport.results.map((row) => (
                            <tr key={row.parameter} className="border-b border-gray-200">
                              <td className="py-2">{row.parameter}</td>
                              <td className={`py-2 font-semibold ${row.flag ? 'text-red-600' : ''}`}>
                                {row.value} {row.flag && `(${row.flag})`}
                              </td>
                              <td className="py-2 text-gray-500">{row.range}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <p className="text-xs text-gray-400 pt-4 border-t border-gray-300">
                      This is a demo report for presentation purposes. Verified by Lab Technician.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    onClick={() => setViewReport(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => downloadReport(viewReport)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabReports;
