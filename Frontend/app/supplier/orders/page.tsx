'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listSupplierOrders, mapSupplierOrder, SupplyOrder } from '@/api/supplier';

// The backend order status is a free-form string with no fixed step set and no
// status-update endpoint, so this stepper only recognizes the common values and
// the "advance" action below is local-only (not persisted).
const steps = ['pending', 'processing', 'shipped', 'delivered'] as const;

const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const SupplierOrders: React.FC = () => {
  const [orders, setOrders] = useState<SupplyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | string>('all');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSupplierOrders();
      setOrders(data.map(mapSupplierOrder));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = steps.indexOf(o.status as (typeof steps)[number]);
        if (idx >= 0 && idx < steps.length - 1) return { ...o, status: steps[idx + 1] };
        return o;
      })
    );
  };

  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <DashboardLayout role="supplier">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Pharmacy Orders</h1>
            <p className="text-gray-600 dark:text-gray-400">Fulfill purchase orders from hospital pharmacy</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(['all', ...steps] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                {f === 'all' ? 'All Orders' : statusLabel(f)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
            </div>
          ) : (
          <div className="space-y-6">
            {filtered.map((order, i) => {
              const stepIdx = steps.indexOf(order.status as (typeof steps)[number]);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">{order.poNumber}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 capitalize">
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.hospital}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {order.items}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Ordered {order.ordered}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${order.total.toLocaleString()}</p>
                      {order.status !== 'delivered' && stepIdx >= 0 && (
                        <button
                          onClick={() => advanceOrder(order.id)}
                          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                        >
                          <Truck className="w-4 h-4" />
                          {order.status === 'pending' ? 'Start Processing' : order.status === 'processing' ? 'Mark Shipped' : 'Mark Delivered'}
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled
                        </span>
                      )}
                    </div>
                  </div>

                  {stepIdx >= 0 && (
                    <div className="flex items-center gap-1">
                      {steps.map((step, j) => (
                        <React.Fragment key={step}>
                          <div className={`flex items-center gap-1.5 ${j <= stepIdx ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${j <= stepIdx ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                              {j + 1}
                            </div>
                            <span className="text-xs font-medium hidden sm:inline capitalize">{statusLabel(step)}</span>
                          </div>
                          {j < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${j < stepIdx ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different filter.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SupplierOrders;
