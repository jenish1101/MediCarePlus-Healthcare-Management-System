'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, DollarSign, Truck, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listSupplierOrders, mapSupplierOrder, SupplyOrder } from '@/api/supplier';

const SupplierDashboard: React.FC = () => {
  const [orders, setOrders] = useState<SupplyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSupplierOrders();
      setOrders(data.map(mapSupplierOrder));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load supplier dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');
  const recentFulfillments = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { icon: Package, label: 'Pending Orders', value: orders.filter((o) => o.status === 'pending').length, color: 'orange' },
    { icon: Truck, label: 'In Processing', value: orders.filter((o) => o.status === 'processing').length, color: 'blue' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'green' },
    { icon: Clock, label: 'Avg. Fulfillment', value: '2.3 days', color: 'purple' }
  ];

  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <DashboardLayout role="supplier">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-5 text-white">
            <h1 className="text-xl font-bold mb-2">Supplier Dashboard</h1>
            <p className="text-white/90">Pending supply orders and fulfillment overview</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading dashboard...
            </div>
          ) : (
          <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700">
                <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}-100 inline-block mb-2 sm:mb-4`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Pending Supply Orders</h3>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="p-4 sm:p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100 min-w-0 break-words">{order.hospital}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${order.status === 'pending' ? 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.items}</p>
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 mt-2 text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">${order.total.toLocaleString()}</span>
                      <span className="text-gray-500 dark:text-gray-400">Ordered: {order.ordered}</span>
                    </div>
                  </div>
                ))}
                {pendingOrders.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No pending orders.</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Fulfillments</h3>
              <div className="space-y-3">
                {recentFulfillments.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.poNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.items}</p>
                      </div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full shrink-0">Delivered</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Delivered {item.ordered}</p>
                  </div>
                ))}
                {recentFulfillments.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No fulfillments yet.</p>
                )}
              </div>
            </motion.div>
          </div>
          </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SupplierDashboard;
