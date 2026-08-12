'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, X, Search, Truck, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  orderDate: string;
  expectedDelivery: string;
  status: 'draft' | 'ordered' | 'shipped' | 'received';
}

const initialOrders: PurchaseOrder[] = [
  { id: 'PO-1001', supplier: 'PharmaCorp', items: [{ name: 'Amoxicillin 500mg', quantity: 500, unitPrice: 1.2 }], total: 600, orderDate: '2024-02-14', expectedDelivery: '2024-02-20', status: 'ordered' },
  { id: 'PO-1002', supplier: 'MedSupply Inc', items: [{ name: 'Ibuprofen 400mg', quantity: 1000, unitPrice: 0.8 }, { name: 'Aspirin 75mg', quantity: 2000, unitPrice: 0.3 }], total: 1400, orderDate: '2024-02-12', expectedDelivery: '2024-02-18', status: 'shipped' },
  { id: 'PO-1003', supplier: 'HealthPlus', items: [{ name: 'Vitamin B Complex', quantity: 800, unitPrice: 0.6 }], total: 480, orderDate: '2024-02-10', expectedDelivery: '2024-02-16', status: 'received' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    ordered: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    received: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const nextStatus: Record<string, PurchaseOrder['status']> = {
  draft: 'ordered',
  ordered: 'shipped',
  shipped: 'received'
};

const PharmacyPurchaseOrders: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplier: '', medicine: '', quantity: '', unitPrice: '' });

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = nextStatus[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier || !form.medicine) return;
    const qty = Number(form.quantity) || 0;
    const price = Number(form.unitPrice) || 0;
    setOrders((prev) => [
      {
        id: `PO-${Date.now()}`,
        supplier: form.supplier,
        items: [{ name: form.medicine, quantity: qty, unitPrice: price }],
        total: qty * price,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'draft'
      },
      ...prev
    ]);
    setForm({ supplier: '', medicine: '', quantity: '', unitPrice: '' });
    setShowModal(false);
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier.toLowerCase().includes(search.toLowerCase())
  );

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Purchase Orders</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Order stock from suppliers</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> New Order
            </button>
          </motion.div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">{order.id}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Supplier: {order.supplier}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Ordered: {order.orderDate} · Expected: {order.expectedDelivery}</p>
                      <div className="mt-2 space-y-0.5">
                        {order.items.map((item) => (
                          <p key={item.name} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                            {item.name} × {item.quantity} @ ${item.unitPrice.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700 sm:border-0 sm:pt-0">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">${order.total.toLocaleString()}</p>
                    {order.status !== 'received' && (
                      <button
                        onClick={() => advance(order.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {order.status === 'draft' && <><Clock className="w-4 h-4" /> Place Order</>}
                        {order.status === 'ordered' && <><Truck className="w-4 h-4" /> Mark Shipped</>}
                        {order.status === 'shipped' && <><CheckCircle className="w-4 h-4" /> Mark Received</>}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No purchase orders found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Create a new order to restock inventory.</p>
              </div>
            )}
          </div>
        </div>

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
                className="w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">New Purchase Order</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Supplier</label>
                    <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100">
                      <option value="">Select supplier</option>
                      <option value="PharmaCorp">PharmaCorp</option>
                      <option value="MedSupply Inc">MedSupply Inc</option>
                      <option value="HealthPlus">HealthPlus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Medicine</label>
                    <input value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Quantity</label>
                      <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Unit Price ($)</label>
                      <input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                      Create Order
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

export default PharmacyPurchaseOrders;
