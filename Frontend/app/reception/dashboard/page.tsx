'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Users, Calendar, DoorOpen, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const todayCheckIns = [
  { id: 'c1', name: 'Maria Garcia', time: '8:15 AM', doctor: 'Dr. Sarah Wilson', status: 'checked-in' },
  { id: 'c2', name: 'James Lee', time: '9:00 AM', doctor: 'Dr. Michael Chen', status: 'waiting' },
  { id: 'c3', name: 'Anna Patel', time: '9:30 AM', doctor: 'Dr. Emily Rodriguez', status: 'checked-in' },
  { id: 'c4', name: 'Robert Kim', time: '10:15 AM', doctor: 'Dr. James Anderson', status: 'in-room' }
];

const walkIns = [
  { id: 'w1', name: 'Tom Walker', arrived: '10:05 AM', reason: 'Fever & cough', priority: 'normal' },
  { id: 'w2', name: 'Susan Reed', arrived: '10:22 AM', reason: 'Minor injury', priority: 'urgent' }
];

const ReceptionDashboard: React.FC = () => {
  const stats = [
    { icon: UserCheck, label: "Today's Check-ins", value: todayCheckIns.length, color: 'blue' },
    { icon: Users, label: 'Walk-ins Waiting', value: walkIns.length, color: 'orange' },
    { icon: Calendar, label: 'Appointments Today', value: 12, color: 'green' },
    { icon: DoorOpen, label: 'Rooms Available', value: 8, color: 'purple' }
  ];

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-5 text-white"
          >
            <h1 className="text-xl font-bold mb-2">Reception Dashboard</h1>
            <p className="text-white/90">Today&apos;s check-ins, walk-ins, and front desk activity</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Today&apos;s Check-ins</h3>
                <UserCheck className="w-6 h-6 text-teal-600" />
              </div>
              <div className="space-y-3">
                {todayCheckIns.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" /> {item.time}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === 'checked-in'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'in-room'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Walk-in Queue</h3>
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="space-y-3">
                {walkIns.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.priority === 'urgent' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.priority === 'urgent' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                          }`}
                        >
                          {item.priority}
                        </span>
                        <p className="text-sm text-gray-500 mt-2">{item.arrived}</p>
                      </div>
                    </div>
                    <button className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-900">
                      Register & assign doctor →
                    </button>
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

export default ReceptionDashboard;
