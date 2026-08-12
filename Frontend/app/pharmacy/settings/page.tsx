'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Bell, AlertTriangle, Package, Mail, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type ToggleKey = 'lowStockAlerts' | 'expiryAlerts' | 'newOrderAlerts' | 'emailReports' | 'autoReorder';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${on ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const PharmacySettings: React.FC = () => {
  const [threshold, setThreshold] = useState('500');
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    lowStockAlerts: true,
    expiryAlerts: true,
    newOrderAlerts: true,
    emailReports: false,
    autoReorder: false
  });

  const flip = (k: ToggleKey) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const rows: { key: ToggleKey; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Notify when stock drops below threshold', icon: AlertTriangle },
    { key: 'expiryAlerts', label: 'Expiry Alerts', desc: 'Notify about medicines expiring soon', icon: Bell },
    { key: 'newOrderAlerts', label: 'New Order Alerts', desc: 'Notify when a new order arrives', icon: Package },
    { key: 'emailReports', label: 'Email Sales Reports', desc: 'Receive weekly sales summaries', icon: Mail },
    { key: 'autoReorder', label: 'Auto Reorder', desc: 'Automatically reorder low-stock items', icon: Package }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage pharmacy preferences and alerts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Inventory Settings</h3>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Low Stock Threshold (units)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Items below this quantity will be flagged as low stock.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between gap-3 py-3 sm:py-4">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{label}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{desc}</p>
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Change Password</h3>
            </div>
            <form className="grid sm:grid-cols-2 gap-4 sm:gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none p-4 sm:p-6 border border-red-100 dark:border-red-900/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-base sm:text-xl font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">Clear all inventory records. This action cannot be undone.</p>
            <button className="w-full sm:w-auto px-5 py-2.5 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Clear Inventory
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacySettings;
