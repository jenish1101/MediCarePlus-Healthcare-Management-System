import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, AlertTriangle, Pill } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockInventory, mockOrders } from '../../data/mockData';

const PharmacyDashboard: React.FC = () => {
  const activeOrders = mockOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const lowStock = mockInventory.filter(i => i.quantity < 500);
  const expiringSoon = mockInventory.filter(i => new Date(i.expiryDate) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000));

  const stats = [
    { icon: Package, label: 'Total Medicines', value: mockInventory.length, color: 'blue' },
    { icon: DollarSign, label: 'Monthly Sales', value: '$45,230', color: 'green' },
    { icon: AlertTriangle, label: 'Low Stock Items', value: lowStock.length, color: 'orange' },
    { icon: Pill, label: 'Active Orders', value: activeOrders.length, color: 'purple' }
  ];

  return (
    <DashboardLayout role="pharmacist">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">Pharmacy Dashboard</h1>
          <p className="text-white/90">Manage inventory, orders, and sales</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className={`p-3 rounded-lg bg-${stat.color}-100 inline-block mb-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Low Stock Alerts</h3>
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-orange-900">{item.medicineName}</p>
                    <p className="text-sm text-orange-700">Batch: {item.batchNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-900">{item.quantity}</p>
                    <button className="text-sm text-orange-700 hover:text-orange-900 font-medium">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Expiring Soon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Expiring Soon (6 months)</h3>
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div className="space-y-3">
              {expiringSoon.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">{item.medicineName}</p>
                    <p className="text-sm text-red-700">Expires: {item.expiryDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-900">{item.quantity} units</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.medicines.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${order.total}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PharmacyDashboard;
