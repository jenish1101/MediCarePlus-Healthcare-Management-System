'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Bell, TestTube, FileCheck, Mail, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey = 'newTestAlerts' | 'urgentAlerts' | 'reportReady' | 'emailReports' | 'autoAssign';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-purple-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const LabSettings: React.FC = () => {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    newTestAlerts: true,
    urgentAlerts: true,
    reportReady: true,
    emailReports: false,
    autoAssign: false
  });

  const flip = (k: ToggleKey) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const rows: { key: ToggleKey; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'newTestAlerts', label: 'New Test Requests', desc: 'Notify when a new test is requested', icon: TestTube },
    { key: 'urgentAlerts', label: 'Urgent Test Alerts', desc: 'Highlight and notify urgent tests', icon: Bell },
    { key: 'reportReady', label: 'Report Ready Alerts', desc: 'Notify when a report is generated', icon: FileCheck },
    { key: 'emailReports', label: 'Email Daily Summary', desc: 'Receive daily lab activity summary', icon: Mail },
    { key: 'autoAssign', label: 'Auto-assign Tests', desc: 'Automatically assign incoming tests to you', icon: TestTube }
  ];

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-600">Manage lab preferences and alerts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-purple-600" />
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold">Change Password</h3>
            </div>
            <form className="grid sm:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg p-4 border border-red-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-semibold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Clear all completed test records. This action cannot be undone.</p>
            <button className="px-5 py-2.5 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Clear Records
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabSettings;
