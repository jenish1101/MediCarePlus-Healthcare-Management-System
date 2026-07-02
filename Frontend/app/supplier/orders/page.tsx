'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SupplyOrder {
  id: string;
  poNumber: string;
  hospital: string;
  items: string;
  total: number;
  ordered: string;
  due: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const initialOrders: SupplyOrder[] = [
  { id: 'o1', poNumber: 'PO-2024-091', hospital: 'MediCare Plus Pharmacy', items: 'Ibuprofen 400mg x 500', total: 1250, ordered: 'Feb 15', due: 'Feb 18', status: 'pending' },
  { id: 'o2', poNumber: 'PO-2024-092', hospital: 'MediCare Plus Pharmacy', items: 'Amoxicillin 500mg x 300', total: 1260, ordered: 'Feb 16', due: 'Feb 19', status: 'pending' },
  { id: 'o3', poNumber: 'PO-2024-093', hospital: 'MediCare Plus Pharmacy', items: 'Insulin pens x 50', total: 3100, ordered: 'Feb 16', due: 'Feb 20', status: 'processing' },
  { id: 'o4', poNumber: 'PO-2024-089', hospital: 'MediCare Plus Pharmacy', items: 'Paracetamol 500mg x 1000', total: 1800, ordered: 'Feb 10', due: 'Feb 14', status: 'delivered' }
];

const steps: SupplyOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered'];

const statusLabel: Record<SupplyOrder['status'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

const SupplierOrders: React.FC = () => {
  const [orders, setOrders] = useState<SupplyOrder[]>(initialOrders);
  const [filter, setFilter] = useState<'all' | SupplyOrder['status']>('all');

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = steps.indexOf(o.status);
        if (idx < steps.length - 1) return { ...o, status: steps[idx + 1] };
        return o;
      })
    );
  };

  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <DashboardLayout role="supplier">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Pharmacy Orders</h1>
            <p className="text-gray-600">Fulfill purchase orders from hospital pharmacy</p>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {(['all', ...steps] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {f === 'all' ? 'All Orders' : statusLabel[f]}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((order, i) => {
              const stepIdx = steps.indexOf(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{order.poNumber}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
                          {statusLabel[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.hospital}</p>
                      <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" /> {order.items}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Ordered {order.ordered} · Due {order.due}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gray-900">${order.total.toLocaleString()}</p>
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => advanceOrder(order.id)}
                          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                        >
                          <Truck className="w-4 h-4" />
                          {order.status === 'pending' ? 'Start Processing' : order.status === 'processing' ? 'Mark Shipped' : 'Mark Delivered'}
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-600">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {steps.map((step, j) => (
                      <React.Fragment key={step}>
                        <div className={`flex items-center gap-1.5 ${j <= stepIdx ? 'text-amber-600' : 'text-gray-300'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${j <= stepIdx ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {j + 1}
                          </div>
                          <span className="text-xs font-medium hidden sm:inline capitalize">{statusLabel[step]}</span>
                        </div>
                        {j < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${j < stepIdx ? 'bg-amber-500' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SupplierOrders;
