'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Video,
  FileText,
  Activity
} from 'lucide-react';
import { mockAppointments } from '@/data/mockData';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const DoctorDashboard: React.FC = () => {
  const router = useRouter();
  const todayAppointments = mockAppointments.filter(apt => apt.status === 'scheduled').slice(0, 3);
  const videoAppointment = todayAppointments.find(apt => apt.type === 'video') ||
    mockAppointments.find(apt => apt.type === 'video' && apt.status === 'scheduled');

  const stats: Array<{ icon: typeof Calendar; label: string; value: string; change: string; color: ThemeColor }> = [
    { icon: Calendar, label: "Today's Appointments", value: '12', change: '+3', color: 'blue' },
    { icon: Users, label: 'Total Patients', value: '234', change: '+12', color: 'green' },
    { icon: DollarSign, label: 'Monthly Earnings', value: '$12,450', change: '+8%', color: 'purple' },
    { icon: Clock, label: 'Avg. Consultation', value: '25 min', change: '-2 min', color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-5 text-white"
          >
            <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Good Morning, Dr. Wilson! 👋</h1>
            <p className="text-white/90 text-sm sm:text-base">You have 12 appointments today. 3 are video consultations.</p>
          </motion.div>

          {/* Stats Grid */}
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
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${colors.bg100} shrink-0`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text600}`} />
                  </div>
                  <span className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 leading-snug">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold">Today&apos;s Appointments</h3>
                  <button
                    onClick={() => router.push('/doctor/appointments')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm sm:text-base shrink-0"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {todayAppointments.map((apt, i) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patientName}`}
                          alt={apt.patientName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{apt.patientName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{apt.reason}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3 mr-1 shrink-0" />
                            {apt.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {apt.type === 'video' && (
                          <button
                            onClick={() => router.push(`/doctor/consultation/${apt.id}`)}
                            className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors"
                            aria-label="Start video consultation"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/doctor/patients/${apt.patientId}`)}
                          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          View
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {todayAppointments.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => router.push('/doctor/prescriptions')}
                    className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FileText className="w-5 h-5" />
                    <span>New Prescription</span>
                  </button>
                  <button
                    onClick={() => router.push('/doctor/availability')}
                    className="w-full py-2.5 sm:py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Set Availability</span>
                  </button>
                  <button
                    onClick={() =>
                      videoAppointment
                        ? router.push(`/doctor/consultation/${videoAppointment.id}`)
                        : router.push('/doctor/appointments')
                    }
                    className="w-full py-2.5 sm:py-3 border-2 border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Video className="w-5 h-5" />
                    <span>Start Consultation</span>
                  </button>
                </div>
              </motion.div>

              {/* Performance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-sm sm:text-base">Performance</h3>
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Patient Satisfaction</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                    <div className="w-full bg-white dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Appointments Completed</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-white dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                      <span className="font-semibold">Excellent</span>
                    </div>
                    <div className="w-full bg-white dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Prescription created for John Patient</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">Video consultation completed</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">3 new appointments scheduled</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">5 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorDashboard;
