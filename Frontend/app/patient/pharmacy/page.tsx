'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, Package, ShoppingCart, Plus, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockOrders, mockInventory } from '@/data/mockData';

const orderStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const PatientPharmacy: React.FC = () => {
  const [tab, setTab] = useState<'browse' | 'orders'>('browse');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<string[]>([]);

  const medicines = mockInventory.filter(m =>
    m.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCart = (id: string) =>
    setCart(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Pharmacy</h1>
              <p className="text-gray-600">Order medicines and track your deliveries</p>
            </div>
            <button className="relative inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['browse', 'orders'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {t === 'browse' ? 'Browse Medicines' : 'My Orders'}
              </button>
            ))}
          </div>

          {tab === 'browse' && (
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search medicines..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((med, i) => {
                  const inCart = cart.includes(med.id);
                  return (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-lg flex flex-col"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                        <Pill className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{med.medicineName}</h4>
                      <p className="text-sm text-gray-500 mb-1">Supplier: {med.supplier}</p>
                      <p className="text-xs text-gray-400">In stock: {med.quantity}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">${med.price.toFixed(2)}</span>
                        <button
                          onClick={() => toggleCart(med.id)}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            inCart
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {inCart ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {medicines.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
                  <p className="text-gray-600">Try a different search term.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {mockOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                        <p className="text-gray-600 text-sm">Date: {order.date}</p>
                        <p className="text-gray-500 text-sm mt-1">{order.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-lg font-bold text-green-600 mt-2">${order.total}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {order.medicines.map((med, j) => (
                      <div key={j} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Pill className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {med.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">${med.price * med.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {order.status === 'shipped' && (
                    <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Track Order
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientPharmacy;
