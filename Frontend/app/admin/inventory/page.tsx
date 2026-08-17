'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Pill, AlertTriangle, Package, Building2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listInventory, mapInventory } from '@/api/pharmacy';
import { Inventory } from '@/types';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const LOW_STOCK = 500;

const AdminInventory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listInventory();
      setInventory(data.map(mapInventory));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const suppliers = ['all', ...Array.from(new Set(inventory.map((i) => i.supplier)))];

  const filtered = inventory.filter(
    (i) =>
      (supplierFilter === 'all' || i.supplier === supplierFilter) &&
      i.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = inventory.filter((i) => i.quantity < LOW_STOCK).length;
  const totalValue = inventory.reduce((s, i) => s + i.quantity * i.price, 0);
  const expiringSoon = inventory.filter((i) => new Date(i.expiryDate) < new Date('2024-12-31')).length;

  const stats: Array<{ label: string; value: string | number; color: ThemeColor }> = [
    { label: 'Total Items', value: inventory.length, color: 'blue' },
    { label: 'Low Stock', value: lowStock, color: 'red' },
    { label: 'Expiring Soon', value: expiringSoon, color: 'orange' },
    { label: 'Stock Value', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Hospital Inventory</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Hospital-wide pharmacy stock overview</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 min-w-0"
              >
                <p className={`text-base sm:text-lg font-bold ${colors.text600} truncate`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">{s.label}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
              {suppliers.map((s) => (
                <button
                  key={s}
                  onClick={() => setSupplierFilter(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    supplierFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {s === 'all' ? 'All Suppliers' : s}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading inventory...
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((item) => {
                const low = item.quantity < LOW_STOCK;
                return (
                  <div key={item.id} className="p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.medicineName}</span>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${low ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.quantity.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400 pl-10">
                      <p>Batch: {item.batchNumber}</p>
                      <p>Expiry: {item.expiryDate}</p>
                      <p className="col-span-2 flex items-center gap-1"><Building2 className="w-3 h-3" />{item.supplier}</p>
                      <p>Unit: ${item.price.toFixed(2)}</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Total: ${(item.quantity * item.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Medicine</th>
                    <th className="py-3 px-4 font-medium">Batch</th>
                    <th className="py-3 px-4 font-medium">Quantity</th>
                    <th className="py-3 px-4 font-medium">Expiry</th>
                    <th className="py-3 px-4 font-medium">Supplier</th>
                    <th className="py-3 px-4 font-medium text-right">Unit Price</th>
                    <th className="py-3 px-4 font-medium text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((item) => {
                    const low = item.quantity < LOW_STOCK;
                    return (
                      <tr key={item.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.medicineName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.batchNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-medium ${low ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {low && <AlertTriangle className="w-4 h-4" />}
                            {item.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.expiryDate}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Building2 className="w-3.5 h-3.5" />
                            {item.supplier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                          ${(item.quantity * item.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No inventory found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search or supplier filter.</p>
              </div>
            )}
          </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminInventory;
