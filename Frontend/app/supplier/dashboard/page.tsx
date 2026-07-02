'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, DollarSign, Truck } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const pendingOrders = [
  { id: 'so1', hospital: 'MediCare Plus Pharmacy', items: 'Ibuprofen 400mg x 500', amount: '$1,250', due: 'Feb 18', status: 'pending' },
  { id: 'so2', hospital: 'MediCare Plus Pharmacy', items: 'Amoxicillin 500mg x 300, Vitamin B x 200', amount: '$2,840', due: 'Feb 19', status: 'pending' },
  { id: 'so3', hospital: 'MediCare Plus Pharmacy', items: 'Insulin pens x 50', amount: '$3,100', due: 'Feb 20', status: 'processing' }
];

const recentFulfillments = [
  { id: 'rf1', order: 'PO-2024-089', items: 'Paracetamol 500mg', delivered: 'Feb 14', status: 'delivered' },
  { id: 'rf2', order: 'PO-2024-087', items: 'Surgical gloves x 1000', delivered: 'Feb 12', status: 'delivered' }
];

const SupplierDashboard: React.FC = () => {
  const stats = [
    { icon: Package, label: 'Pending Orders', value: pendingOrders.filter((o) => o.status === 'pending').length, color: 'orange' },
    { icon: Truck, label: 'In Processing', value: pendingOrders.filter((o) => o.status === 'processing').length, color: 'blue' },
    { icon: DollarSign, label: 'This Month Revenue', value: '$48,200', color: 'green' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 shadow-lg">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 inline-block mb-4`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Pending Supply Orders</h3>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{order.hospital}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${order.status === 'pending' ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.items}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="font-semibold text-gray-900">{order.amount}</span>
                      <span className="text-gray-500">Due: {order.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Fulfillments</h3>
              <div className="space-y-3">
                {recentFulfillments.map((item) => (
                  <div key={item.id} className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item.order}</p>
                        <p className="text-sm text-gray-600">{item.items}</p>
                      </div>
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Delivered</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Delivered {item.delivered}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SupplierDashboard;
