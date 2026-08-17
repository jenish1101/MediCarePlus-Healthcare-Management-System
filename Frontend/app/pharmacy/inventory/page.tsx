'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pill, AlertTriangle, X, Package, Building2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listInventory, addInventoryItem, mapInventory } from '@/api/pharmacy';
import { Inventory } from '@/types';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const LOW_STOCK = 500;

const PharmacyInventory: React.FC = () => {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medicineName: '', batchNumber: '', quantity: '', expiryDate: '', supplier: '', price: '' });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listInventory();
      setItems(data.map(mapInventory));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = items.filter((i) =>
    i.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicineName) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await addInventoryItem({
        medicine_name: form.medicineName,
        batch_number: form.batchNumber || 'N/A',
        quantity: Number(form.quantity) || 0,
        expiry_date: form.expiryDate || '2026-01-01',
        supplier: form.supplier || 'Unknown',
        price: Number(form.price) || 0
      });
      setItems((prev) => [mapInventory(created), ...prev]);
      setForm({ medicineName: '', batchNumber: '', quantity: '', expiryDate: '', supplier: '', price: '' });
      setShowModal(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add medicine.');
    } finally {
      setSubmitting(false);
    }
  };

  const lowStock = items.filter((i) => i.quantity < LOW_STOCK).length;
  const stats: Array<{ label: string; value: number; color: ThemeColor }> = [
    { label: 'Total Items', value: items.length, color: 'blue' },
    { label: 'Low Stock', value: lowStock, color: 'red' },
    { label: 'In Stock', value: items.length - lowStock, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Inventory</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage your medicine stock</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Medicine
            </button>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center min-w-0"
              >
                <p className={`text-base sm:text-xl font-bold ${colors.text600}`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">{s.label}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
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
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                          <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{item.medicineName}</span>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 inline-flex items-center gap-1 ${low ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {low && <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.quantity}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400 pl-10">
                      <p>Batch: {item.batchNumber}</p>
                      <p>Expiry: {item.expiryDate}</p>
                      <p className="col-span-2 flex items-center gap-1"><Building2 className="w-3 h-3" />{item.supplier}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Medicine</th>
                    <th className="py-3 px-4 font-medium">Batch</th>
                    <th className="py-3 px-4 font-medium">Quantity</th>
                    <th className="py-3 px-4 font-medium">Expiry</th>
                    <th className="py-3 px-4 font-medium">Supplier</th>
                    <th className="py-3 px-4 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((item) => {
                    const low = item.quantity < LOW_STOCK;
                    return (
                      <tr key={item.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.medicineName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.batchNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-medium ${low ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {low && <AlertTriangle className="w-4 h-4" />}
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.expiryDate}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.supplier}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-6 sm:p-8 text-center">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No medicines found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try a different search term.</p>
              </div>
            )}
          </motion.div>
          )}
        </div>

        {/* Add Medicine Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Add Medicine</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Medicine Name</label>
                    <input value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Batch Number</label>
                    <input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Quantity</label>
                    <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Price ($)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Supplier</label>
                    <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                      {submitting ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyInventory;
