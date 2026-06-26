'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Bed, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments, mockBeds, mockInventory } from '@/data/mockData';

const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Total Patients', value: '2,543', change: '+12%', color: 'blue' },
    { icon: Calendar, label: 'Appointments Today', value: '48', change: '+8%', color: 'green' },
    { icon: DollarSign, label: 'Monthly Revenue', value: '$124,500', change: '+15%', color: 'purple' },
    { icon: Bed, label: 'Available Beds', value: mockBeds.filter(b => b.status === 'available').length, change: '-2', color: 'orange' }
  ];

  const appointmentData = [
    { name: 'Mon', appointments: 45 },
    { name: 'Tue', appointments: 52 },
    { name: 'Wed', appointments: 48 },
    { name: 'Thu', appointments: 61 },
    { name: 'Fri', appointments: 55 },
    { name: 'Sat', appointments: 42 },
    { name: 'Sun', appointments: 38 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 85000 },
    { name: 'Feb', revenue: 92000 },
    { name: 'Mar', revenue: 98000 },
    { name: 'Apr', revenue: 105000 },
    { name: 'May', revenue: 112000 },
    { name: 'Jun', revenue: 124500 }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your hospital operations</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="flex items-center text-sm text-green-600 font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Appointments Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Weekly Appointments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Bed Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Bed Management</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {['ICU', 'Private', 'General'].map((type) => {
                const typeBeds = mockBeds.filter(b => b.type === type);
                const available = typeBeds.filter(b => b.status === 'available').length;
                const occupied = typeBeds.filter(b => b.status === 'occupied').length;
                const total = typeBeds.length;
                const percentage = (available / total) * 100;

                return (
                  <div key={type} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">{type} Beds</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Available</span>
                        <span className="font-semibold text-green-600">{available}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Occupied</span>
                        <span className="font-semibold text-red-600">{occupied}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total</span>
                        <span className="font-semibold">{total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity & Inventory Alerts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
              <div className="space-y-3">
                {mockAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{apt.patientName}</p>
                      <p className="text-sm text-gray-600">Dr. {apt.doctorName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{apt.date}</p>
                      <p className="text-xs text-gray-600">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Low Stock Alerts</h3>
              <div className="space-y-3">
                {mockInventory.filter(item => item.quantity < 500).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-yellow-900">{item.medicineName}</p>
                      <p className="text-sm text-yellow-700">Batch: {item.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-yellow-900">{item.quantity} left</p>
                      <button className="text-xs text-yellow-700 hover:text-yellow-900 font-medium">
                        Reorder
                      </button>
                    </div>
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

export default AdminDashboard;
