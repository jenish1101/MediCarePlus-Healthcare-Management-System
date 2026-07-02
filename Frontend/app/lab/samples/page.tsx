'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanBarcode, Search, CheckCircle, Clock, Package, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Sample {
  id: string;
  sampleId: string;
  patientName: string;
  testName: string;
  collectedAt: string;
  status: 'collected' | 'in-transit' | 'received' | 'processing' | 'completed';
  location: string;
}

const initialSamples: Sample[] = [
  { id: 's1', sampleId: 'SMP-2024-0841', patientName: 'John Patient', testName: 'Complete Blood Count (CBC)', collectedAt: '2024-02-15 09:15', status: 'processing', location: 'Hematology Lab' },
  { id: 's2', sampleId: 'SMP-2024-0842', patientName: 'Emma Thompson', testName: 'Lipid Profile', collectedAt: '2024-02-15 10:30', status: 'received', location: 'Biochemistry Lab' },
  { id: 's3', sampleId: 'SMP-2024-0843', patientName: 'Michael Brown', testName: 'Liver Function Test', collectedAt: '2024-02-15 11:00', status: 'in-transit', location: 'Collection → Lab' },
  { id: 's4', sampleId: 'SMP-2024-0840', patientName: 'Sophia Davis', testName: 'Thyroid Panel', collectedAt: '2024-02-14 14:20', status: 'completed', location: 'Endocrinology Lab' },
  { id: 's5', sampleId: 'SMP-2024-0839', patientName: 'James Wilson', testName: 'Blood Glucose', collectedAt: '2024-02-14 08:45', status: 'completed', location: 'Biochemistry Lab' }
];

const statusSteps: Sample['status'][] = ['collected', 'in-transit', 'received', 'processing', 'completed'];

const statusLabel: Record<Sample['status'], string> = {
  collected: 'Collected',
  'in-transit': 'In Transit',
  received: 'Received',
  processing: 'Processing',
  completed: 'Completed'
};

const statusColor: Record<Sample['status'], string> = {
  collected: 'bg-gray-100 text-gray-700',
  'in-transit': 'bg-blue-100 text-blue-700',
  received: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700'
};

const LabSamples: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>(initialSamples);
  const [search, setSearch] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanMsg, setScanMsg] = useState('');

  const filtered = samples.filter(
    (s) =>
      s.sampleId.toLowerCase().includes(search.toLowerCase()) ||
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.testName.toLowerCase().includes(search.toLowerCase())
  );

  const advanceSample = (id: string) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const idx = statusSteps.indexOf(s.status);
        if (idx < statusSteps.length - 1) return { ...s, status: statusSteps[idx + 1] };
        return s;
      })
    );
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const code = scanInput.trim().toUpperCase();
    if (!code) return;
    const match = samples.find((s) => s.sampleId === code);
    if (match) {
      advanceSample(match.id);
      setScanMsg(`Sample ${code} advanced to next stage.`);
    } else {
      setScanMsg(`Sample ${code} not found.`);
    }
    setScanInput('');
    setTimeout(() => setScanMsg(''), 3000);
  };

  const active = samples.filter((s) => s.status !== 'completed').length;

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sample Tracking</h1>
            <p className="text-gray-600">Barcode / sample ID workflow</p>
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
            <form onSubmit={handleScan} className="flex gap-3">
              <input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter or scan sample ID (e.g. SMP-2024-0841)"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2">
                <ScanBarcode className="w-5 h-5" /> Scan
              </button>
            </form>
            {scanMsg && <p className="text-sm text-white/90 mt-3">{scanMsg}</p>}
          </motion.div>

          <div className="grid grid-cols-2 gap-6 max-w-md">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <Package className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-lg font-bold">{active}</p>
                <p className="text-gray-500 text-sm">In Pipeline</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-lg font-bold">{samples.filter((s) => s.status === 'completed').length}</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>
            </div>
          </div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search samples..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-6">
            {filtered.map((sample, i) => {
              const stepIdx = statusSteps.indexOf(sample.status);
              return (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">{sample.sampleId}</code>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[sample.status]}`}>
                          {statusLabel[sample.status]}
                        </span>
                      </div>
                      <p className="font-medium text-gray-900 mt-2">{sample.testName}</p>
                      <p className="text-sm text-gray-600">Patient: {sample.patientName}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Collected: {sample.collectedAt} · {sample.location}
                      </p>
                    </div>
                    {sample.status !== 'completed' && (
                      <button
                        onClick={() => advanceSample(sample.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2 shrink-0"
                      >
                        Advance <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {statusSteps.map((step, j) => (
                      <React.Fragment key={step}>
                        <div className={`flex items-center gap-1 ${j <= stepIdx ? 'text-purple-600' : 'text-gray-300'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${j <= stepIdx ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {j + 1}
                          </div>
                          <span className="text-xs font-medium hidden sm:inline">{statusLabel[step]}</span>
                        </div>
                        {j < statusSteps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${j < stepIdx ? 'bg-purple-500' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabSamples;
