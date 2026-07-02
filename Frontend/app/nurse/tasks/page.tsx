'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CareTask {
  id: string;
  patient: string;
  room: string;
  type: 'medication' | 'care';
  description: string;
  scheduled: string;
  status: 'pending' | 'completed';
}

const initialTasks: CareTask[] = [
  { id: 't1', patient: 'Maria Garcia', room: '204', type: 'medication', description: 'Ibuprofen 400mg — after meals', scheduled: '11:30 AM', status: 'pending' },
  { id: 't2', patient: 'James Lee', room: '108', type: 'medication', description: 'Amoxicillin 500mg — with water', scheduled: '12:00 PM', status: 'pending' },
  { id: 't3', patient: 'Anna Patel', room: '312', type: 'care', description: 'Wound dressing change', scheduled: '11:00 AM', status: 'completed' },
  { id: 't4', patient: 'Robert Kim', room: '115', type: 'medication', description: 'Insulin — before lunch', scheduled: '12:30 PM', status: 'pending' },
  { id: 't5', patient: 'Maria Garcia', room: '204', type: 'care', description: 'Mobility assistance — walk 10 min', scheduled: '2:00 PM', status: 'pending' }
];

const NurseTasks: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'medication' | 'care' | 'pending' | 'completed'>('all');

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending' || filter === 'completed') return t.status === filter;
    return t.type === filter;
  });

  const completeTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'completed' as const } : t)));
  };

  const pending = tasks.filter((t) => t.status === 'pending').length;

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Care Tasks</h1>
            <p className="text-gray-600">Medication rounds and daily care tasks · {pending} pending</p>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'medication', 'care', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-rose-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-xl shadow-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${task.type === 'medication' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {task.type === 'medication' ? <Pill className="w-5 h-5 text-purple-600" /> : <ClipboardList className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{task.patient}</p>
                      <span className="text-xs text-gray-500">Room {task.room}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${task.type === 'medication' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Scheduled: {task.scheduled}
                    </p>
                  </div>
                </div>
                {task.status === 'pending' ? (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Done
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NurseTasks;
