'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ScanBarcode, Search, CheckCircle, Clock, Package, ArrowRight, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api, ApiError } from '@/lib/api';

interface Sample {
  id: string;
  sampleId: string;
  patientName: string;
  testName: string;
  collectedAt: string;
  status: 'collected' | 'in-transit' | 'received' | 'processing' | 'completed';
  location: string;
}

interface BackendSample {
  id: string;
  sample_id: string;
  patient_name: string;
  test_name: string;
  collected_at: string;
  status: Sample['status'];
  location: string;
}

function mapSample(s: BackendSample): Sample {
  return {
    id: s.id,
    sampleId: s.sample_id,
    patientName: s.patient_name,
    testName: s.test_name,
    collectedAt: s.collected_at,
    status: s.status,
    location: s.location
  };
}

const statusSteps: Sample['status'][] = ['collected', 'in-transit', 'received', 'processing', 'completed'];

const statusLabel: Record<Sample['status'], string> = {
  collected: 'Collected',
  'in-transit': 'In Transit',
  received: 'Received',
  processing: 'Processing',
  completed: 'Completed'
};

const statusColor: Record<Sample['status'], string> = {
  collected: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  'in-transit': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  received: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  processing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
};

const LabSamples: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanMsg, setScanMsg] = useState('');
  const [scanning, setScanning] = useState(false);

  const loadSamples = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<BackendSample[]>('/lab/samples');
      setSamples(data.map(mapSample));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load samples.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const filtered = samples.filter(
    (s) =>
      s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.testName.toLowerCase().includes(search.toLowerCase())
  );

  const advanceSample = async (id: string) => {
    setAdvancingId(id);
    try {
      const updated = await api.post<BackendSample>(`/lab/samples/${id}/advance`);
      setSamples((prev) => prev.map((s) => (s.id === id ? mapSample(updated) : s)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not advance sample.');
    } finally {
      setAdvancingId(null);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = scanInput.trim().toUpperCase();
    if (!code) return;
    setScanning(true);
    try {
      const updated = await api.post<BackendSample>('/lab/samples/scan', { sample_id: code });
      const mapped = mapSample(updated);
      setSamples((prev) => {
        const exists = prev.some((s) => s.id === mapped.id);
        return exists ? prev.map((s) => (s.id === mapped.id ? mapped : s)) : [mapped, ...prev];
      });
      setScanMsg(`Sample ${code} advanced to "${mapped.status}".`);
    } catch (err) {
      setScanMsg(err instanceof ApiError ? err.message : `Sample ${code} not found.`);
    } finally {
      setScanning(false);
      setScanInput('');
      setTimeout(() => setScanMsg(''), 3000);
    }
  };

  const active = samples.filter((s) => s.status !== 'completed').length;

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Sample Tracking</h1>
            <p className="text-gray-600 dark:text-gray-400">Barcode / sample ID workflow</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <ScanBarcode className="w-8 h-8" />
              <h3 className="text-xl font-semibold">Scan Sample Barcode</h3>
            </div>
            <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
              <input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter or scan sample ID (e.g. SMP-2024-0841)"
                className="flex-1 min-w-0 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={scanning}
                className="w-full sm:w-auto px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <ScanBarcode className="w-5 h-5" /> {scanning ? 'Scanning...' : 'Scan'}
              </button>
            </form>
            {scanMsg && <p className="text-sm text-white/90 mt-3">{scanMsg}</p>}
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-3 sm:gap-6">
              <Package className="w-8 h-8 text-purple-600 shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{active}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">In Pipeline</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-3 sm:gap-6">
              <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{samples.filter((s) => s.status === 'completed').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search samples..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading samples...
            </div>
          ) : (
          <div className="space-y-6">
            {filtered.map((sample, i) => {
              const stepIdx = statusSteps.indexOf(sample.status);
              return (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">{sample.sampleId}</code>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[sample.status]}`}>
                          {statusLabel[sample.status]}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mt-2">{sample.testName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Patient: {sample.patientName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Collected: {sample.collectedAt} · {sample.location}
                      </p>
                    </div>
                    {sample.status !== 'completed' && (
                      <button
                        onClick={() => advanceSample(sample.id)}
                        disabled={advancingId === sample.id}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        {advancingId === sample.id ? 'Advancing...' : 'Advance'} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {statusSteps.map((step, j) => (
                      <React.Fragment key={step}>
                        <div className={`flex items-center gap-1 ${j <= stepIdx ? 'text-purple-600 dark:text-purple-400' : 'text-gray-300 dark:text-gray-500'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${j <= stepIdx ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500'}`}>
                            {j + 1}
                          </div>
                          <span className="text-xs font-medium hidden sm:inline">{statusLabel[step]}</span>
                        </div>
                        {j < statusSteps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${j < stepIdx ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No samples</h3>
                <p className="text-gray-600 dark:text-gray-400">No samples match your search.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabSamples;
