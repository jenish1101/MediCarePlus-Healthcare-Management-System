'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Lock, HeartPulse, Pill, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey = 'vitalsAlerts' | 'medicationAlerts' | 'urgentAlerts' | 'shiftSummary';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button type="button" onClick={onClick} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-rose-600' : 'bg-gray-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const NurseSettings: React.FC = () => {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    vitalsAlerts: true,
    medicationAlerts: true,
    urgentAlerts: true,
    shiftSummary: false
  });

  const flip = (k: ToggleKey) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const rows: { key: ToggleKey; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'vitalsAlerts', label: 'Vitals Due Reminders', desc: 'Alert when patient vitals are due', icon: HeartPulse },
    { key: 'medicationAlerts', label: 'Medication Round Alerts', desc: 'Notify before scheduled medication times', icon: Pill },
    { key: 'urgentAlerts', label: 'Urgent Patient Alerts', desc: 'Highlight critical patient status changes', icon: AlertTriangle },
    { key: 'shiftSummary', label: 'End-of-Shift Summary', desc: 'Email summary of completed tasks', icon: Bell }
  ];

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-600">Manage nursing preferences and alerts</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-rose-600" />
              <h3 className="text-xl font-semibold">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {rows.map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                  <Toggle on={toggles[key]} onClick={() => flip(key)} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-rose-600" />
              <h3 className="text-xl font-semibold">Security</h3>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100">
              Change Password
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NurseSettings;
