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
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Expiry & Stock Alerts</h1>
            <p className="text-gray-600">Low stock and expiry warnings for pharmacy inventory</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6 max-w-2xl">
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{lowStockCount}</p>
                <p className="text-gray-500 text-sm">Low Stock</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{expiringCount}</p>
                <p className="text-gray-500 text-sm">Expiring Soon</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{filtered.length}</p>
                <p className="text-gray-500 text-sm">Total Alerts</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'low_stock', 'expiring'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === v ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {v === 'all' ? 'All Alerts' : v === 'low_stock' ? 'Low Stock' : 'Expiring'}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white border rounded-xl p-5 shadow-sm ${
                  item.isExpired ? 'border-red-300 bg-red-50/30' : item.isLowStock ? 'border-orange-200' : 'border-yellow-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${item.isExpired ? 'bg-red-100' : 'bg-orange-100'}`}>
                      <Pill className={`w-5 h-5 ${item.isExpired ? 'text-red-600' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.medicineName}</h4>
                      <p className="text-sm text-gray-500">Batch: {item.batchNumber} · Supplier: {item.supplier}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.isLowStock && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Low Stock: {item.quantity} units
                      </span>
                    )}
                    {item.isExpired && (
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                        Expired: {item.expiryDate}
                      </span>
                    )}
                    {item.isExpiring && !item.isExpired && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        Expires: {item.expiryDate}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">All inventory levels look healthy.</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyExpiryAlerts;
