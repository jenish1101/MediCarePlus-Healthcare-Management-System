'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Search, Eye, CheckCircle, Clock, X, Pencil, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { exportPdfReport } from '@/lib/exportReport';
import { ApiError } from '@/lib/api';
import {
  listLabReports,
  updateLabReport,
  mapLabReportDetail as mapReport,
  LabReportDetail as Report,
  LabReportStatus as BackendReportStatus
} from '@/api/lab';

const LabReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState({ status: 'pending' as BackendReportStatus, summary: '', doctorNotes: '' });
  const [saving, setSaving] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listLabReports();
      setReports(data.map(mapReport));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filtered = reports.filter(
    (r) =>
      (filter === 'all' || r.status === filter) &&
      (r.testName.toLowerCase().includes(search.toLowerCase()) ||
        r.patientId.toLowerCase().includes(search.toLowerCase()))
  );

  const ready = reports.filter((r) => r.status === 'ready').length;
  const processing = reports.filter((r) => r.status === 'processing').length;

  const downloadReport = (report: Report) => {
    const lines = [
      `Patient ID: ${report.patientId}`,
      `Test: ${report.testName}`,
      `Date: ${report.date}`,
      report.summary ?? '',
      ...(report.results?.map((r) => `${r.parameter}: ${r.value} (${r.range})${r.flag ? ` [${r.flag}]` : ''}`) ?? [])
    ].filter(Boolean);
    exportPdfReport(`lab-report-${report.id}.pdf`, report.testName, lines);
  };

  const openEdit = (report: Report) => {
    setEditForm({ status: report.backendStatus, summary: report.summary ?? '', doctorNotes: report.doctorNotes ?? '' });
    setEditReport(report);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReport) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateLabReport(editReport.id, {
        status: editForm.status,
        results_summary: editForm.summary || null,
        doctor_notes: editForm.doctorNotes || null
      });
      const mapped = mapReport(updated);
      setReports((prev) => prev.map((r) => (r.id === mapped.id ? mapped : r)));
      setEditReport(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save report.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">View and download generated lab reports</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-3 sm:gap-6">
              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{reports.length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-3 sm:gap-6">
              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{ready}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Ready</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-3 sm:gap-6">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{processing}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Processing</p>
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
                    filter === f ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search report or patient ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading reports...
            </div>
          ) : (
          <div className="space-y-6">
            {filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${report.status === 'ready' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                      <FileText className={`w-6 h-6 ${report.status === 'ready' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{report.testName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Patient ID: {report.patientId}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date: {report.date}</p>
                      {report.summary && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-900/40 rounded-lg px-3 py-2">{report.summary}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${report.status === 'ready' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                      {report.backendStatus}
                    </span>
                    {report.status === 'ready' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewReport(report)}
                          className="px-4 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => downloadReport(report)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button
                          onClick={() => openEdit(report)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openEdit(report)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" /> Enter Results
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No reports found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search or filter.</p>
              </div>
            )}
          </div>
          )}
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lab Report</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{viewReport.testName}</p>
                  </div>
                  <button onClick={() => setViewReport(null)} className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/40 text-gray-600 dark:text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/40 font-mono text-sm space-y-6">
                    <div className="text-center border-b border-gray-300 dark:border-gray-700 pb-4">
                      <p className="font-bold text-lg text-gray-900 dark:text-gray-100">MediCare Plus Laboratory</p>
                      <p className="text-gray-600 dark:text-gray-400">Official Test Report</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                      <p><span className="text-gray-500 dark:text-gray-400">Patient ID:</span> {viewReport.patientId}</p>
                      <p><span className="text-gray-500 dark:text-gray-400">Report ID:</span> {viewReport.id.toUpperCase()}</p>
                      <p><span className="text-gray-500 dark:text-gray-400">Test:</span> {viewReport.testName}</p>
                      <p><span className="text-gray-500 dark:text-gray-400">Date:</span> {viewReport.date}</p>
                    </div>
                    {viewReport.summary && (
                      <p className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">{viewReport.summary}</p>
                    )}
                    {viewReport.doctorNotes && (
                      <p className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Doctor Notes: </span>{viewReport.doctorNotes}
                      </p>
                    )}
                    {viewReport.results && viewReport.results.length > 0 && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-300 dark:border-gray-700">
                            <th className="py-2 text-gray-600 dark:text-gray-400">Parameter</th>
                            <th className="py-2 text-gray-600 dark:text-gray-400">Value</th>
                            <th className="py-2 text-gray-600 dark:text-gray-400">Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewReport.results.map((row, idx) => (
                            <tr key={`${row.parameter}-${idx}`} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="py-2 text-gray-900 dark:text-gray-100">{row.parameter}</td>
                              <td className={`py-2 font-semibold ${row.flag ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {row.value} {row.flag && `(${row.flag})`}
                              </td>
                              <td className="py-2 text-gray-500 dark:text-gray-400">{row.range}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-300 dark:border-gray-700">
                      This is a demo report for presentation purposes. Verified by Lab Technician.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                  <button
                    onClick={() => setViewReport(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

        {/* Edit / Enter Results Modal */}
        <AnimatePresence>
          {editReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => !saving && setEditReport(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Report</h3>
                  <button onClick={() => setEditReport(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{editReport.testName} · Patient ID: {editReport.patientId}</p>
                <form onSubmit={submitEdit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as BackendReportStatus })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Results Summary</label>
                    <textarea
                      value={editForm.summary}
                      onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                      rows={3}
                      placeholder="e.g. All values within normal range"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Doctor Notes</label>
                    <textarea
                      value={editForm.doctorNotes}
                      onChange={(e) => setEditForm({ ...editForm, doctorNotes: e.target.value })}
                      rows={2}
                      placeholder="Optional notes for the reviewing doctor..."
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setEditReport(null)} disabled={saving} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabReports;
