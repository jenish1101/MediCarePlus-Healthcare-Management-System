'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Pill,
  TestTube,
  Clock,
  CheckCircle,
  Activity,
  Download,
  Video,
  Heart,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';
import { api, ApiError } from '@/lib/api';
import { listAppointments, mapAppointment } from '@/api/appointments';
import { listPrescriptions, mapPrescription } from '@/api/prescriptions';
import { listOrders, mapOrder } from '@/api/pharmacy';
import { mapLabReport, BackendLabReport } from '@/lib/mappers';
import { Appointment, Prescription, LabReport, Order } from '@/types';

const PatientDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [apts, rxs, labs, ords] = await Promise.all([
        listAppointments(),
        listPrescriptions(),
        api.get<BackendLabReport[]>('/lab/reports'),
        listOrders()
      ]);
      setAppointments(apts.map(mapAppointment));
      setPrescriptions(rxs.map(mapPrescription));
      setLabReports(labs.map(mapLabReport));
      setOrders(ords.map(mapOrder));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const videoAppointment = appointments.find(apt => apt.type === 'video' && apt.status === 'scheduled');

  const stats: Array<{ icon: typeof Calendar; label: string; value: number; color: ThemeColor }> = [
    { icon: Calendar, label: 'Upcoming Appointments', value: upcomingAppointments.length, color: 'blue' },
    { icon: FileText, label: 'Prescriptions', value: prescriptions.length, color: 'purple' },
    { icon: TestTube, label: 'Lab Reports', value: labReports.length, color: 'green' },
    { icon: Pill, label: 'Active Orders', value: orders.filter(o => o.status !== 'delivered').length, color: 'orange' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-4 sm:space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading dashboard...
            </div>
          ) : (
          <>
          {/* Stats */}
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
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-snug">{stat.label}</p>
              </motion.div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max sm:min-w-0 space-x-1 sm:space-x-8 px-4 sm:px-6">
                {['overview', 'appointments', 'prescriptions', 'lab-reports', 'orders'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Health Overview</h3>
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Vital Stats */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center mb-4">
                        <Heart className="w-6 h-6 text-red-500 dark:text-red-400 mr-2" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Vital Signs</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Heart Rate</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">72 bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Blood Pressure</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">120/80 mmHg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">98.6°F</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Quick Actions</h4>
                      <div className="space-y-2 sm:space-y-3">
                        <button
                          onClick={() => router.push('/patient/book-appointment')}
                          className="w-full py-2.5 sm:py-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md dark:hover:bg-gray-600 transition-shadow flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-900 dark:text-gray-100"
                        >
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span>Book Appointment</span>
                        </button>
                        <button
                          onClick={() =>
                            videoAppointment
                              ? router.push(`/patient/consultation/${videoAppointment.id}`)
                              : router.push('/patient/appointments')
                          }
                          className="w-full py-2.5 sm:py-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md dark:hover:bg-gray-600 transition-shadow flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-900 dark:text-gray-100"
                        >
                          <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span>Start Video Call</span>
                        </button>
                        <button
                          onClick={() => router.push('/patient/pharmacy')}
                          className="w-full py-2.5 sm:py-3 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md dark:hover:bg-gray-600 transition-shadow flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-900 dark:text-gray-100"
                        >
                          <Pill className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span>Order Medicines</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Recent Activity</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{apt.doctorName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{apt.date} at {apt.time}</p>
                            </div>
                          </div>
                          <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">My Appointments</h3>
                    <button
                      onClick={() => router.push('/patient/book-appointment')}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      Book New Appointment
                    </button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 sm:mb-4 text-green-600 dark:text-green-400">Upcoming Appointments</h4>
                    <div className="space-y-4 sm:space-y-6">
                      {upcomingAppointments.map((apt) => (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div className="flex items-start space-x-3 sm:space-x-4 min-w-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">{apt.doctorName}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{apt.doctorSpecialization}</p>
                                <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1 shrink-0" />
                                    {apt.date}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 shrink-0" />
                                    {apt.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:space-y-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${apt.fees}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button className="flex-1 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                              Reschedule
                            </button>
                            <button className="flex-1 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
                              Cancel
                            </button>
                            {apt.type === 'video' && (
                              <button
                                onClick={() => router.push(`/patient/consultation/${apt.id}`)}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Call
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 sm:mb-4 text-gray-600 dark:text-gray-400">Past Appointments</h4>
                    <div className="space-y-2 sm:space-y-3">
                      {completedAppointments.map((apt) => (
                        <div key={apt.id} className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{apt.doctorName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{apt.date} at {apt.time}</p>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </span>
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Prescriptions Tab */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">My Prescriptions</h3>
                  {prescriptions.map((prescription) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 dark:text-gray-100">Prescription #{prescription.id}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {prescription.date}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Diagnosis: {prescription.diagnosis}</p>
                        </div>
                        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto shrink-0">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <h5 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Medicines:</h5>
                        <div className="space-y-3">
                          {prescription.medicines.map((med, i) => (
                            <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <p className="font-medium text-blue-900 dark:text-blue-300">{med.name}</p>
                                <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                                <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                                <p><span className="font-medium">Duration:</span> {med.duration}</p>
                                {med.instructions && (
                                  <p className="col-span-2"><span className="font-medium">Instructions:</span> {med.instructions}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-medium">Doctor&apos;s Notes:</span> {prescription.notes}</p>
                        </div>
                      )}

                      <button className="mt-4 w-full py-2 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        Order These Medicines
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Lab Reports Tab */}
              {activeTab === 'lab-reports' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Lab Reports</h3>
                    <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
                      Book Lab Test
                    </button>
                  </div>
                  {labReports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex items-start space-x-3 sm:space-x-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                            <TestTube className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">{report.testName}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {report.date}</p>
                          </div>
                        </div>
                        <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>

                      {report.results && (
                        <>
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-2"><span className="font-medium">Results:</span> {report.results}</p>
                            {report.doctorNotes && (
                              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Doctor&apos;s Notes:</span> {report.doctorNotes}</p>
                            )}
                          </div>
                          <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download Report</span>
                          </button>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Medicine Orders</h3>
                    <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                      New Order
                    </button>
                  </div>
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">Order #{order.id}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {order.date}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 break-words">{order.address}</p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">${order.total}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <h5 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Items:</h5>
                        <div className="space-y-2">
                          {order.medicines.map((med, i) => (
                            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                              <div className="flex items-center space-x-3 min-w-0">
                                <Pill className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{med.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {med.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100 sm:text-right">${med.price * med.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.status === 'shipped' && (
                        <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Track Order
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientDashboard;
