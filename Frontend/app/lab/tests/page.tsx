'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TestTube, Search, Clock, CheckCircle, Upload, X, FlaskConical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface LabTest {
  id: string;
  testName: string;
  patientName: string;
  requestedBy: string;
  date: string;
  priority: 'routine' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  results?: string;
}

const initialTests: LabTest[] = [
  { id: 'lt1', testName: 'Complete Blood Count (CBC)', patientName: 'John Patient', requestedBy: 'Dr. Sarah Wilson', date: '2024-02-15', priority: 'routine', status: 'pending' },
  { id: 'lt2', testName: 'Lipid Profile', patientName: 'Emma Thompson', requestedBy: 'Dr. Sarah Wilson', date: '2024-02-15', priority: 'urgent', status: 'in-progress' },
  { id: 'lt3', testName: 'Liver Function Test', patientName: 'Michael Brown', requestedBy: 'Dr. Robert Taylor', date: '2024-02-14', priority: 'routine', status: 'pending' },
  { id: 'lt4', testName: 'Thyroid Panel (T3, T4, TSH)', patientName: 'Sophia Davis', requestedBy: 'Dr. Priya Sharma', date: '2024-02-13', priority: 'routine', status: 'completed', results: 'All values within normal range' },
  { id: 'lt5', testName: 'Blood Glucose (Fasting)', patientName: 'James Wilson', requestedBy: 'Dr. Robert Taylor', date: '2024-02-12', priority: 'urgent', status: 'completed', results: 'Slightly elevated - 110 mg/dL' }
];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const LabTests: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>(initialTests);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<LabTest | null>(null);
  const [resultText, setResultText] = useState('');

  const startTest = (id: string) =>
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'in-progress' } : t)));

  const openUpload = (test: LabTest) => {
    setActive(test);
    setResultText(test.results || '');
  };

  const submitResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    setTests((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, status: 'completed', results: resultText } : t))
    );
    setActive(null);
    setResultText('');
  };

  const filtered = tests.filter(
    (t) =>
      (filter === 'all' || t.status === filter) &&
      (t.testName.toLowerCase().includes(search.toLowerCase()) ||
        t.patientName.toLowerCase().includes(search.toLowerCase()))
  );

  const filters = ['all', 'pending', 'in-progress', 'completed'];
  const stats = [
    { label: 'Total Tests', value: tests.length, color: 'blue' },
    { label: 'Pending', value: tests.filter((t) => t.status === 'pending').length, color: 'yellow' },
    { label: 'In Progress', value: tests.filter((t) => t.status === 'in-progress').length, color: 'purple' },
    { label: 'Completed', value: tests.filter((t) => t.status === 'completed').length, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Lab Tests</h1>
            <p className="text-gray-600">Manage test requests and upload results</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {f.replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search test or patient..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${test.status === 'completed' ? 'bg-green-100' : test.status === 'in-progress' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                      <TestTube className={`w-6 h-6 ${test.status === 'completed' ? 'text-green-600' : test.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg">{test.testName}</h4>
                        {test.priority === 'urgent' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Urgent</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Patient: {test.patientName}</p>
                      <p className="text-xs text-gray-500 mt-1">Requested by {test.requestedBy} · {test.date}</p>
                      {test.results && (
                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg px-3 py-2">{test.results}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(test.status)}`}>
                      {test.status.replace('-', ' ')}
                    </span>
                    {test.status === 'pending' && (
                      <button
                        onClick={() => startTest(test.id)}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" /> Start Test
                      </button>
                    )}
                    {test.status === 'in-progress' && (
                      <button
                        onClick={() => openUpload(test)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Upload Results
                      </button>
                    )}
                    {test.status === 'completed' && (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <FlaskConical className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Results Modal */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">Upload Results</h3>
                  <button onClick={() => setActive(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">{active.testName} · {active.patientName}</p>
                <form onSubmit={submitResults} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Test Results</label>
                    <textarea
                      value={resultText}
                      onChange={(e) => setResultText(e.target.value)}
                      rows={4}
                      required
                      placeholder="Enter findings, values, and observations..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setActive(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
                      Submit &amp; Complete
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

export default LabTests;
