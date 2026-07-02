'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Users, ClipboardList, AlertCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const assignedPatients = [
  { id: 'n1', name: 'Maria Garcia', room: '204', vitalsDue: '11:30 AM', condition: 'Post-op recovery' },
  { id: 'n2', name: 'James Lee', room: '108', vitalsDue: '12:00 PM', condition: 'Pneumonia' },
  { id: 'n3', name: 'Anna Patel', room: '312', vitalsDue: '11:45 AM', condition: 'Diabetes monitoring' }
];

const vitalsDue = [
  { id: 'v1', patient: 'Maria Garcia', room: '204', type: 'BP & Pulse', due: '11:30 AM', overdue: false },
  { id: 'v2', patient: 'Robert Kim', room: '115', type: 'Temperature', due: '11:15 AM', overdue: true },
  { id: 'v3', patient: 'James Lee', room: '108', type: 'Full vitals', due: '12:00 PM', overdue: false }
];

const NurseDashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Assigned Patients', value: assignedPatients.length, color: 'blue' },
    { icon: HeartPulse, label: 'Vitals Due Today', value: vitalsDue.length, color: 'red' },
    { icon: ClipboardList, label: 'Pending Tasks', value: 8, color: 'purple' },
    { icon: AlertCircle, label: 'Alerts', value: 2, color: 'orange' }
  ];

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl p-5 text-white">
            <h1 className="text-xl font-bold mb-2">Nurse Dashboard</h1>
            <p className="text-white/90">Assigned patients and vitals schedule</p>
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
              <h3 className="text-xl font-semibold mb-4">Assigned Patients</h3>
              <div className="space-y-3">
                {assignedPatients.map((p) => (
                  <div key={p.id} className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-600">Room {p.room} · {p.condition}</p>
                      </div>
                      <span className="text-sm text-rose-600 font-medium">Vitals: {p.vitalsDue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" /> Vitals Due
              </h3>
              <div className="space-y-3">
                {vitalsDue.map((v) => (
                  <div key={v.id} className={`p-4 rounded-lg border ${v.overdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{v.patient}</p>
                        <p className="text-sm text-gray-600">Room {v.room} · {v.type}</p>
                      </div>
                      <div className="text-right">
                        {v.overdue && <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Overdue</span>}
                        <p className="text-sm text-gray-500 flex items-center gap-1 justify-end mt-1">
                          <Clock className="w-3.5 h-3.5" /> {v.due}
                        </p>
                      </div>
                    </div>
                    <button className="mt-2 text-sm font-medium text-rose-600 hover:text-rose-800">Record vitals →</button>
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

export default NurseDashboard;
