'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Globe, Mail, Smartphone, Shield, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey =
  | 'emailNotif'
  | 'smsNotif'
  | 'appointmentReminders'
  | 'profileVisible';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      on ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        on ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const PatientSettings: React.FC = () => {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    emailNotif: true,
    smsNotif: false,
    appointmentReminders: true,
    profileVisible: true
  });

  const flip = (key: ToggleKey) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const settingRows: {
    key: ToggleKey;
    label: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive updates and alerts via email', icon: Mail },
    { key: 'smsNotif', label: 'SMS Notifications', desc: 'Receive text messages for important updates', icon: Smartphone },
    { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminded before your appointments', icon: Bell },
    { key: 'profileVisible', label: 'Profile Visibility', desc: 'Allow doctors to view your profile', icon: Shield }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-600">Manage your preferences and account security</p>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold">Preferences &amp; Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {settingRows.map(({ key, label, desc, icon: Icon }) => (
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

          {/* Change password */}
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
            <form
              className="grid sm:grid-cols-2 gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>

          {/* Danger zone */}
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
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="px-5 py-2.5 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientSettings;
