'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Pill, Calendar, Package } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockInventory } from '@/data/mockData';

const LOW_STOCK = 500;

const PharmacyExpiryAlerts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'all' | 'low_stock' | 'expiring'>('all');

  const today = new Date();
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);

  const alerts = mockInventory.map((item) => {
    const expiry = new Date(item.expiryDate);
    const isLowStock = item.quantity < LOW_STOCK;
    const isExpiring = expiry <= sixMonths;
    const isExpired = expiry < today;
    return { ...item, isLowStock, isExpiring, isExpired };
  });

  const filtered = alerts.filter((item) => {
    const matchesSearch = item.medicineName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (view === 'low_stock') return item.isLowStock;
    if (view === 'expiring') return item.isExpiring || item.isExpired;
    return item.isLowStock || item.isExpiring || item.isExpired;
  });

  const lowStockCount = alerts.filter((a) => a.isLowStock).length;
  const expiringCount = alerts.filter((a) => a.isExpiring || a.isExpired).length;

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Expiry & Stock Alerts</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Low stock and expiry warnings for pharmacy inventory</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{lowStockCount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Low Stock</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{expiringCount}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Expiring Soon</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{filtered.length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Total Alerts</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {(['all', 'low_stock', 'expiring'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    view === v ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {v === 'all' ? 'All Alerts' : v === 'low_stock' ? 'Low Stock' : 'Expiring'}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white dark:bg-gray-800 border rounded-xl p-3 sm:p-5 shadow-sm dark:shadow-none ${
                  item.isExpired ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20' : item.isLowStock ? 'border-orange-200 dark:border-orange-800' : 'border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 ${item.isExpired ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                      <Pill className={`w-4 h-4 sm:w-5 sm:h-5 ${item.isExpired ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{item.medicineName}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Batch: {item.batchNumber} · Supplier: {item.supplier}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-13 sm:pl-0">
                    {item.isLowStock && (
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Low Stock: {item.quantity} units
                      </span>
                    )}
                    {item.isExpired && (
                      <span className="px-2.5 sm:px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                        Expired: {item.expiryDate}
                      </span>
                    )}
                    {item.isExpiring && !item.isExpired && (
                      <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        Expires: {item.expiryDate}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
                <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No alerts found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">All inventory levels look healthy.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyExpiryAlerts;
