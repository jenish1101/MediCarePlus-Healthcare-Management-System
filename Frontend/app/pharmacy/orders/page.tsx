'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Pill, Search, Truck, CheckCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const STEPS: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered'];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    confirmed: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-colors ${
                  done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                {done ? <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : i + 1}
              </div>
              <span className={`mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] capitalize ${done ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 mb-3 sm:mb-4 ${i < currentIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
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

  const stats: Array<{ label: string; value: number; color: ThemeColor; icon: typeof Package }> = [
    { label: 'Total Orders', value: orders.length, color: 'blue', icon: Package },
    { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'yellow', icon: Clock },
    { label: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length, color: 'purple', icon: Truck },
    { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, color: 'green', icon: CheckCircle }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Process and fulfill medicine orders</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0"
              >
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg ${colors.bg100} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text600}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-none">{s.value}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">{s.label}</p>
                </div>
              </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                    filter === f ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order #..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {filtered.map((order, i) => {
              const itemCount = order.medicines.reduce((sum, m) => sum + m.quantity, 0);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 p-3 sm:p-5 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Order #{order.id}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{order.date} · {order.medicines.length} item{order.medicines.length > 1 ? 's' : ''} · {itemCount} units</p>
                      </div>
                    </div>
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium capitalize shrink-0 ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.status !== 'cancelled' && (
                    <div className="px-3 sm:px-5 pt-3 sm:pt-4">
                      <StatusStepper status={order.status} />
                    </div>
                  )}

                  <div className="px-3 sm:px-5 pt-2 sm:pt-3 flex items-start gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{order.address}</span>
                  </div>

                  <div className="p-3 sm:p-6 space-y-1 sm:space-y-2 flex-1">
                    {order.medicines.map((med, j) => (
                      <div key={j} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-50 dark:border-gray-700 last:border-0 gap-2">
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                            <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{med.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{med.quantity} × ${med.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">${(med.price * med.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">${order.total}</p>
                    </div>
                    {nextStatus[order.status] ? (
                      <button
                        onClick={() => advance(order.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Mark as {nextStatus[order.status]}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Completed
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try a different search or filter.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyOrders;
