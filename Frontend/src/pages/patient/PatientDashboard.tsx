import React, { useState } from 'react';
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
  Heart
} from 'lucide-react';
import { mockAppointments, mockPrescriptions, mockLabReports, mockOrders } from '../../data/mockData';
import DashboardLayout from '../../components/DashboardLayout';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const upcomingAppointments = mockAppointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = mockAppointments.filter(apt => apt.status === 'completed');

  const stats = [
    { icon: Calendar, label: 'Upcoming Appointments', value: upcomingAppointments.length, color: 'blue' },
    { icon: FileText, label: 'Prescriptions', value: mockPrescriptions.length, color: 'purple' },
    { icon: TestTube, label: 'Lab Reports', value: mockLabReports.length, color: 'green' },
    { icon: Pill, label: 'Active Orders', value: mockOrders.filter(o => o.status !== 'delivered').length, color: 'orange' }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
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
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {['overview', 'appointments', 'prescriptions', 'lab-reports', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Health Overview</h3>
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Vital Stats */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Heart className="w-6 h-6 text-red-500 mr-2" />
                      <h4 className="font-semibold">Vital Signs</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heart Rate</span>
                        <span className="font-semibold">72 bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Pressure</span>
                        <span className="font-semibold">120/80 mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature</span>
                        <span className="font-semibold">98.6°F</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span>Book Appointment</span>
                      </button>
                      <button className="w-full py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-center space-x-2">
                        <Video className="w-5 h-5 text-purple-600" />
                        <span>Start Video Call</span>
                      </button>
                      <button className="w-full py-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-center space-x-2">
                        <Pill className="w-5 h-5 text-green-600" />
                        <span>Order Medicines</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-semibold mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {mockAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{apt.doctorName}</p>
                            <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">My Appointments</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Book New Appointment
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-green-600">Upcoming Appointments</h4>
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{apt.doctorName}</h4>
                              <p className="text-gray-600">{apt.doctorSpecialization}</p>
                              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {apt.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {apt.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                            <span className="text-lg font-bold text-blue-600">${apt.fees}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            Reschedule
                          </button>
                          <button className="flex-1 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            Cancel
                          </button>
                          {apt.type === 'video' && (
                            <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
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
                  <h4 className="font-semibold mb-4 text-gray-600">Past Appointments</h4>
                  <div className="space-y-3">
                    {completedAppointments.map((apt) => (
                      <div key={apt.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{apt.doctorName}</p>
                            <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
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
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">My Prescriptions</h3>
                {mockPrescriptions.map((prescription) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Prescription #{prescription.id}</h4>
                        <p className="text-gray-600">Date: {prescription.date}</p>
                        <p className="text-gray-600">Diagnosis: {prescription.diagnosis}</p>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold mb-3">Medicines:</h5>
                      <div className="space-y-3">
                        {prescription.medicines.map((med, i) => (
                          <div key={i} className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium text-blue-900">{med.name}</p>
                              <Pill className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
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
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Doctor's Notes:</span> {prescription.notes}</p>
                      </div>
                    )}

                    <button className="mt-4 w-full py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      Order These Medicines
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Lab Reports Tab */}
            {activeTab === 'lab-reports' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Lab Reports</h3>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Book Lab Test
                  </button>
                </div>
                {mockLabReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <TestTube className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{report.testName}</h4>
                          <p className="text-gray-600">Date: {report.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>

                    {report.results && (
                      <>
                        <div className="border-t pt-4">
                          <p className="text-gray-700 mb-2"><span className="font-medium">Results:</span> {report.results}</p>
                          {report.doctorNotes && (
                            <p className="text-gray-700"><span className="font-medium">Doctor's Notes:</span> {report.doctorNotes}</p>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Medicine Orders</h3>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    New Order
                  </button>
                </div>
                {mockOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                        <p className="text-gray-600">Date: {order.date}</p>
                        <p className="text-gray-600 text-sm mt-1">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-green-600 mt-2">${order.total}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-semibold mb-3">Items:</h5>
                      <div className="space-y-2">
                        {order.medicines.map((med, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Pill className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium">{med.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {med.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold">${med.price * med.quantity}</p>
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
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
