'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Pill, AlertTriangle, Package, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockInventory } from '@/data/mockData';

const LOW_STOCK = 500;

const AdminInventory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');

  const suppliers = ['all', ...Array.from(new Set(mockInventory.map((i) => i.supplier)))];

  const filtered = mockInventory.filter(
    (i) =>
      (supplierFilter === 'all' || i.supplier === supplierFilter) &&
      i.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = mockInventory.filter((i) => i.quantity < LOW_STOCK).length;
  const totalValue = mockInventory.reduce((s, i) => s + i.quantity * i.price, 0);
  const expiringSoon = mockInventory.filter((i) => new Date(i.expiryDate) < new Date('2024-12-31')).length;

  const stats = [
    { label: 'Total Items', value: mockInventory.length, color: 'blue' },
    { label: 'Low Stock', value: lowStock, color: 'red' },
    { label: 'Expiring Soon', value: expiringSoon, color: 'orange' },
    { label: 'Stock Value', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Hospital Inventory</h1>
            <p className="text-gray-600">Hospital-wide pharmacy stock overview</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <p className={`text-lg font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {suppliers.map((s) => (
                <button
                  key={s}
                  onClick={() => setSupplierFilter(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    supplierFilter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {s === 'all' ? 'All Suppliers' : s}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
                    <th className="py-3 px-4 font-medium text-right">Unit Price</th>
                    <th className="py-3 px-4 font-medium text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const low = item.quantity < LOW_STOCK;
                    return (
                      <tr key={item.id} className="text-sm hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Pill className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{item.medicineName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.batchNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 font-medium ${low ? 'text-red-600' : 'text-gray-900'}`}>
                            {low && <AlertTriangle className="w-4 h-4" />}
                            {item.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.expiryDate}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <Building2 className="w-3.5 h-3.5" />
                            {item.supplier}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
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
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No inventory found</h3>
                <p className="text-gray-600">Try a different search or supplier filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminInventory;
