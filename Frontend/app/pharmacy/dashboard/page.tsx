'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, DollarSign, AlertTriangle, Pill, FileText, ShoppingCart, RotateCcw, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listInventory, listOrders, mapInventory, mapOrder } from '@/api/pharmacy';
import { Inventory, Order } from '@/types';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const PharmacyDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [inventoryData, ordersData] = await Promise.all([
        listInventory(),
        listOrders()
      ]);
      setInventory(inventoryData.map(mapInventory));
      setOrders(ordersData.map(mapOrder));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const lowStock = inventory.filter(i => i.quantity < 500);

  const sixMonthsFromNow = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d;
  }, []);

  const expiringSoon = inventory.filter(i => new Date(i.expiryDate) < sixMonthsFromNow);

  const stats: Array<{ icon: typeof Package; label: string; value: string | number; color: ThemeColor }> = [
    { icon: Package, label: 'Total Medicines', value: inventory.length, color: 'blue' },
    { icon: DollarSign, label: 'Monthly Sales', value: '$45,230', color: 'green' },
    { icon: AlertTriangle, label: 'Low Stock Items', value: lowStock.length, color: 'orange' },
    { icon: Pill, label: 'Active Orders', value: activeOrders.length, color: 'purple' }
  ];

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 sm:p-5 text-white"
          >
            <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Pharmacy Dashboard</h1>
            <p className="text-white/90 text-sm sm:text-base">Manage inventory, orders, and sales</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, i) => {
              const colors = colorClasses[stat.color];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 min-w-0"
              >
                <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} inline-block mb-2 sm:mb-4`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{stat.value}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Low Stock Alerts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Low Stock Alerts</h3>
                <Link href="/pharmacy/expiry-alerts" className="text-xs sm:text-sm text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 font-medium shrink-0">
                  View all
                </Link>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="min-w-0">
                      <p className="font-medium text-orange-900 dark:text-orange-300 text-sm sm:text-base truncate">{item.medicineName}</p>
                      <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-400">Batch: {item.batchNumber}</p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-2">
                      <p className="text-base sm:text-lg font-bold text-orange-900 dark:text-orange-300">{item.quantity}</p>
                      <Link href="/pharmacy/purchase-orders" className="text-xs sm:text-sm text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 font-medium">
                        Reorder
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expiring Soon */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Expiring Soon (6 months)</h3>
                <Link href="/pharmacy/expiry-alerts" className="text-xs sm:text-sm text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium shrink-0">
                  View all
                </Link>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {expiringSoon.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="min-w-0">
                      <p className="font-medium text-red-900 dark:text-red-300 text-sm sm:text-base truncate">{item.medicineName}</p>
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">Expires: {item.expiryDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-300">{item.quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {[
              { href: '/pharmacy/prescriptions', icon: FileText, label: 'Prescriptions', desc: 'Fulfill doctor orders' },
              { href: '/pharmacy/expiry-alerts', icon: AlertTriangle, label: 'Expiry Alerts', desc: 'Low stock & expiry' },
              { href: '/pharmacy/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders', desc: 'Order from suppliers' },
              { href: '/pharmacy/returns', icon: RotateCcw, label: 'Returns', desc: 'Cancelled order refunds' }
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:bg-gray-700/70 transition-shadow border border-gray-100 dark:border-gray-700 min-w-0"
              >
                <action.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mb-2 sm:mb-3" />
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{action.label}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{action.desc}</p>
              </Link>
            ))}
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h3>
              <Link href="/pharmacy/orders" className="text-xs sm:text-sm text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 font-medium shrink-0">
                View all
              </Link>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Order #{order.id}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.medicines.length} items</p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-2">
                    <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">${order.total}</p>
                    <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyDashboard;
