'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Lock, ClipboardList, Users, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey = 'walkInAlerts' | 'appointmentAlerts' | 'roomAlerts' | 'emailSummary';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button type="button" onClick={onClick} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const ReceptionSettings: React.FC = () => {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    walkInAlerts: true,
    appointmentAlerts: true,
    roomAlerts: false,
    emailSummary: true
  });

  const flip = (k: ToggleKey) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const rows: { key: ToggleKey; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'walkInAlerts', label: 'Walk-in Alerts', desc: 'Notify when a new walk-in arrives', icon: Users },
    { key: 'appointmentAlerts', label: 'Appointment Reminders', desc: 'Alert before scheduled appointments', icon: Calendar },
    { key: 'roomAlerts', label: 'Room Availability', desc: 'Notify when rooms become available', icon: ClipboardList },
    { key: 'emailSummary', label: 'Daily Email Summary', desc: 'Receive end-of-day front desk summary', icon: Bell }
  ];

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage reception desk preferences</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                  </div>
                  <Toggle on={toggles[key]} onClick={() => flip(key)} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Security</h3>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50">
              Change Password
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ReceptionSettings;
