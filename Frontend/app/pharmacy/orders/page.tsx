'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Pill, Search, Truck, CheckCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';

const STEPS: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered'];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const extraOrders: Order[] = [
  { id: 'ord3', patientId: 'p2', medicines: [{ name: 'Amoxicillin 500mg', quantity: 14, price: 1.2 }], total: 17, status: 'pending', date: '2024-02-15', address: '88 Park Ave, New York, NY' },
  { id: 'ord4', patientId: 'p3', medicines: [{ name: 'Aspirin 75mg', quantity: 30, price: 0.3 }, { name: 'Vitamin B Complex', quantity: 30, price: 0.6 }], total: 27, status: 'confirmed', date: '2024-02-14', address: '12 Elm St, Brooklyn, NY' }
];

const nextStatus: Record<string, Order['status']> = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered'
};

const StatusStepper: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const currentIndex = STEPS.indexOf(status);
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`mt-1 text-[10px] capitalize ${done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PharmacyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([...extraOrders, ...mockOrders]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const advance = (id: string) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id && nextStatus[o.status] ? { ...o, status: nextStatus[o.status] } : o))
    );

  const filtered = orders.filter(
    (o) => (filter === 'all' || o.status === filter) && o.id.toLowerCase().includes(search.toLowerCase())
  );

  const filters = ['all', 'pending', 'confirmed', 'shipped', 'delivered'];

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'blue', icon: Package },
    { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'yellow', icon: Clock },
    { label: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length, color: 'purple', icon: Truck },
    { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, color: 'green', icon: CheckCircle }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
            <p className="text-gray-600">Process and fulfill medicine orders</p>
          </motion.div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-6"
              >
                <div className={`w-11 h-11 rounded-lg bg-${s.color}-100 flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-600`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters + search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order #..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Orders grid */}
          <div className="grid lg:grid-cols-2 gap-5">
            {filtered.map((order, i) => {
              const itemCount = order.medicines.reduce((sum, m) => sum + m.quantity, 0);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                        <p className="text-xs text-gray-500">{order.date} · {order.medicines.length} item{order.medicines.length > 1 ? 's' : ''} · {itemCount} units</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Stepper */}
                  {order.status !== 'cancelled' && (
                    <div className="px-5 pt-4">
                      <StatusStepper status={order.status} />
                    </div>
                  )}

                  {/* Address */}
                  <div className="px-5 pt-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{order.address}</span>
                  </div>

                  {/* Items */}
                  <div className="p-6 space-y-2 flex-1">
                    {order.medicines.map((med, j) => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{med.name}</p>
                            <p className="text-xs text-gray-500">{med.quantity} × ${med.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">${(med.price * med.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-bold text-green-600">${order.total}</p>
                    </div>
                    {nextStatus[order.status] ? (
                      <button
                        onClick={() => advance(order.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Mark as {nextStatus[order.status]}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Completed
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try a different search or filter.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyOrders;
