'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Users, ClipboardList, AlertCircle, Clock, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listPatients, BackendPatientSummary } from '@/api/users';
import { listNurseTasks, BackendNurseTask } from '@/api/nurseTasks';

// There is no backend "vitals due" endpoint, so this schedule stays local/mock.
const vitalsDue = [
  { id: 'v1', patient: 'Maria Garcia', room: '204', type: 'BP & Pulse', due: '11:30 AM', overdue: false },
  { id: 'v2', patient: 'Robert Kim', room: '115', type: 'Temperature', due: '11:15 AM', overdue: true },
  { id: 'v3', patient: 'James Lee', room: '108', type: 'Full vitals', due: '12:00 PM', overdue: false }
];

const NurseDashboard: React.FC = () => {
  const [patients, setPatients] = useState<BackendPatientSummary[]>([]);
  const [tasks, setTasks] = useState<BackendNurseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pats, taskList] = await Promise.all([
        listPatients(),
        listNurseTasks()
      ]);
      setPatients(pats);
      setTasks(taskList);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const stats = [
    { icon: Users, label: 'Assigned Patients', value: patients.length, color: 'blue' },
    { icon: HeartPulse, label: 'Vitals Due Today', value: vitalsDue.length, color: 'red' },
    { icon: ClipboardList, label: 'Pending Tasks', value: pendingTasks, color: 'purple' },
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

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700">
                <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}-100 inline-block mb-2 sm:mb-4`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{loading ? '—' : stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Assigned Patients</h3>
              {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...
                </div>
              ) : (
              <div className="space-y-3">
                {patients.map((p) => (
                  <div key={p.id} className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{p.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {p.blood_group ? `Blood Group: ${p.blood_group}` : p.email}
                        </p>
                      </div>
                      {p.last_visit && (
                        <span className="text-sm text-rose-600 dark:text-rose-400 font-medium shrink-0">Last visit: {p.last_visit}</span>
                      )}
                    </div>
                  </div>
                ))}
                {patients.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">No patients found.</p>
                )}
              </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" /> Vitals Due
              </h3>
              <div className="space-y-3">
                {vitalsDue.map((v) => (
                  <div key={v.id} className={`p-4 rounded-lg border ${v.overdue ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-700'}`}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{v.patient}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Room {v.room} · {v.type}</p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        {v.overdue && <span className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Overdue</span>}
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 sm:justify-end mt-1">
                          <Clock className="w-3.5 h-3.5" /> {v.due}
                        </p>
                      </div>
                    </div>
                    <button className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300">Record vitals →</button>
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
