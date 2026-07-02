'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pill, AlertTriangle, X, Package } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockInventory } from '@/data/mockData';
import { Inventory } from '@/types';

const LOW_STOCK = 500;

const PharmacyInventory: React.FC = () => {
  const [items, setItems] = useState<Inventory[]>(mockInventory);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medicineName: '', batchNumber: '', quantity: '', expiryDate: '', supplier: '', price: '' });

  const filtered = items.filter((i) =>
    i.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicineName) return;
    setItems((prev) => [
      {
        id: `inv${Date.now()}`,
        medicineName: form.medicineName,
        batchNumber: form.batchNumber || 'N/A',
        quantity: Number(form.quantity) || 0,
        expiryDate: form.expiryDate || '2026-01-01',
        supplier: form.supplier || 'Unknown',
        price: Number(form.price) || 0
      },
      ...prev
    ]);
    setForm({ medicineName: '', batchNumber: '', quantity: '', expiryDate: '', supplier: '', price: '' });
    setShowModal(false);
  };

  const lowStock = items.filter((i) => i.quantity < LOW_STOCK).length;
  const stats = [
    { label: 'Total Items', value: items.length, color: 'blue' },
    { label: 'Low Stock', value: lowStock, color: 'red' },
    { label: 'In Stock', value: items.length - lowStock, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventory</h1>
              <p className="text-gray-600">Manage your medicine stock</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Medicine
            </button>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="py-3 px-4 font-medium">Medicine</th>
                    <th className="py-3 px-4 font-medium">Batch</th>
                    <th className="py-3 px-4 font-medium">Quantity</th>
                    <th className="py-3 px-4 font-medium">Expiry</th>
                    <th className="py-3 px-4 font-medium">Supplier</th>
                    <th className="py-3 px-4 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const low = item.quantity < LOW_STOCK;
                    return (
                      <tr key={item.id} className="text-sm hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">{item.medicineName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.batchNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-medium ${low ? 'text-red-600' : 'text-gray-900'}`}>
                            {low && <AlertTriangle className="w-4 h-4" />}
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.expiryDate}</td>
                        <td className="py-3 px-4 text-gray-600">{item.supplier}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">${item.price.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
                <p className="text-gray-600">Try a different search term.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Add Medicine Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold">Add Medicine</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Medicine Name</label>
                    <input value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Batch Number</label>
                    <input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                    <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                    <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
                    <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                      Add
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
