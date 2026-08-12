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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700"
              >
                <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}-100 inline-block mb-2 sm:mb-4`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Today&apos;s Check-ins</h3>
                <UserCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="space-y-3">
                {todayCheckIns.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.doctor}</p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 sm:justify-end">
                        <Clock className="w-3.5 h-3.5" /> {item.time}
                      </p>
                      <span
                        className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === 'checked-in'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : item.status === 'in-room'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Walk-in Queue</h3>
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="space-y-3">
                {walkIns.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${
                      item.priority === 'urgent' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.reason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.priority === 'urgent' ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300' : 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300'
                          }`}
                        >
                          {item.priority}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{item.arrived}</p>
                      </div>
                    </div>
                    <button className="mt-3 text-sm font-medium text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300">
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
