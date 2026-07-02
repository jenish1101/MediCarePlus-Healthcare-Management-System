'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Bell, Lock, ShieldCheck, Mail, CreditCard, UserCog, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey = 'maintenance' | 'emailReports' | 'newUserAlerts' | 'autoBackup' | 'onlinePayments';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const AdminSettings: React.FC = () => {
  const [hospital, setHospital] = useState({
    name: 'MediCare Plus Hospital',
    email: 'admin@medicareplus.com',
    phone: '+1 (800) 555-0199',
    address: '500 Health Ave, New York, NY 10001'
  });

  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    maintenance: false,
    emailReports: true,
    newUserAlerts: true,
    autoBackup: true,
    onlinePayments: true
  });

  const flip = (k: ToggleKey) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const rows: { key: ToggleKey; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'maintenance', label: 'Maintenance Mode', desc: 'Temporarily disable patient access', icon: ShieldCheck },
    { key: 'emailReports', label: 'Daily Email Reports', desc: 'Receive daily operations summary', icon: Mail },
    { key: 'newUserAlerts', label: 'New User Alerts', desc: 'Notify admins when users register', icon: Bell },
    { key: 'autoBackup', label: 'Automatic Backups', desc: 'Back up system data nightly', icon: UserCog },
    { key: 'onlinePayments', label: 'Online Payments', desc: 'Allow patients to pay invoices online', icon: CreditCard }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">System Settings</h1>
            <p className="text-gray-600">Configure hospital and platform settings</p>
          </motion.div>

          {/* Hospital info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold">Hospital Information</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Hospital Name</label>
                <input
                  value={hospital.name}
                  onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  value={hospital.email}
                  onChange={(e) => setHospital({ ...hospital, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <input
                  value={hospital.phone}
                  onChange={(e) => setHospital({ ...hospital, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <input
                  value={hospital.address}
                  onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Save Hospital Info
            </button>
          </motion.div>

          {/* System toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-5">Platform Configuration</h3>
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

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lock className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold">Change Admin Password</h3>
            </div>
            <form className="grid sm:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
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
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-4 border border-red-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-semibold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Reset all system data to factory defaults. This action is irreversible.
            </p>
            <button className="px-5 py-2.5 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Reset System Data
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminSettings;
