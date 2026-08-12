'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, AlertTriangle, XCircle, Calendar, Activity } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Equipment {
  id: string;
  name: string;
  model: string;
  location: string;
  lastCalibration: string;
  nextCalibration: string;
  status: 'operational' | 'maintenance' | 'qc-pending' | 'offline';
  qcScore?: number;
}

const initialEquipment: Equipment[] = [
  { id: 'eq1', name: 'Automated Hematology Analyzer', model: 'Sysmex XN-1000', location: 'Hematology Lab', lastCalibration: '2024-01-15', nextCalibration: '2024-04-15', status: 'operational', qcScore: 98 },
  { id: 'eq2', name: 'Chemistry Analyzer', model: 'Cobas c311', location: 'Biochemistry Lab', lastCalibration: '2024-02-01', nextCalibration: '2024-05-01', status: 'operational', qcScore: 96 },
  { id: 'eq3', name: 'Centrifuge', model: 'Eppendorf 5810', location: 'Sample Prep', lastCalibration: '2023-12-10', nextCalibration: '2024-03-10', status: 'qc-pending', qcScore: 88 },
  { id: 'eq4', name: 'Immunoassay System', model: 'Architect i2000', location: 'Immunology Lab', lastCalibration: '2024-01-28', nextCalibration: '2024-04-28', status: 'maintenance' },
  { id: 'eq5', name: 'Microscope', model: 'Olympus CX43', location: 'Pathology', lastCalibration: '2024-02-10', nextCalibration: '2024-08-10', status: 'operational', qcScore: 99 },
  { id: 'eq6', name: 'Refrigerated Storage', model: 'Thermo TSX400', location: 'Specimen Storage', lastCalibration: '2023-11-20', nextCalibration: '2024-02-20', status: 'offline' }
];

const statusConfig = {
  operational: { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Operational' },
  maintenance: { icon: Wrench, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Maintenance' },
  'qc-pending': { icon: AlertTriangle, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', label: 'QC Pending' },
  offline: { icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', label: 'Offline' }
};

const LabEquipment: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [filter, setFilter] = useState<string>('all');

  const runQc = (id: string) => {
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'operational' as const, qcScore: 95 + Math.floor(Math.random() * 5) } : e
      )
    );
  };

  const filtered = filter === 'all' ? equipment : equipment.filter((e) => e.status === filter);

  const operational = equipment.filter((e) => e.status === 'operational').length;

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Equipment & QC</h1>
            <p className="text-gray-600 dark:text-gray-400">Lab equipment status and quality control</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Operational', value: operational, color: 'green' },
              { label: 'QC Pending', value: equipment.filter((e) => e.status === 'qc-pending').length, color: 'orange' },
              { label: 'Maintenance', value: equipment.filter((e) => e.status === 'maintenance').length, color: 'yellow' },
              { label: 'Offline', value: equipment.filter((e) => e.status === 'offline').length, color: 'red' }
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center">
                <p className={`text-lg font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'operational', 'qc-pending', 'maintenance', 'offline'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((item, i) => {
              const cfg = statusConfig[item.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.model}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{item.location}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Last QC: {item.lastCalibration}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Next: {item.nextCalibration}</span>
                  </div>
                  {item.qcScore !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1"><Activity className="w-4 h-4" /> QC Score</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{item.qcScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.qcScore >= 95 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${item.qcScore}%` }} />
                      </div>
                    </div>
                  )}
                  {item.status === 'qc-pending' && (
                    <button onClick={() => runQc(item.id)} className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                      Run QC Check
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabEquipment;
