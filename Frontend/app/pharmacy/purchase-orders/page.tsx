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
    draft: 'bg-gray-100 text-gray-700',
    ordered: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    received: 'bg-green-100 text-green-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
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
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Purchase Orders</h1>
              <p className="text-gray-600">Order stock from suppliers</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> New Order
            </button>
          </motion.div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-6">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg">{order.id}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Supplier: {order.supplier}</p>
                      <p className="text-xs text-gray-400">Ordered: {order.orderDate} · Expected: {order.expectedDelivery}</p>
                      <div className="mt-2 space-y-1">
                        {order.items.map((item) => (
                          <p key={item.name} className="text-sm text-gray-700">
                            {item.name} × {item.quantity} @ ${item.unitPrice.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <p className="text-2xl font-bold text-gray-900">${order.total.toLocaleString()}</p>
                    {order.status !== 'received' && (
                      <button
                        onClick={() => advance(order.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
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
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchase orders found</h3>
                <p className="text-gray-600">Create a new order to restock inventory.</p>
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
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold">New Purchase Order</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
                    <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select supplier</option>
                      <option value="PharmaCorp">PharmaCorp</option>
                      <option value="MedSupply Inc">MedSupply Inc</option>
                      <option value="HealthPlus">HealthPlus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Medicine</label>
                    <input value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                      <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Unit Price ($)</label>
                      <input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
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
