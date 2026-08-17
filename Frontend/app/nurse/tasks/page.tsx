'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pill, ClipboardList, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listNurseTasks, completeNurseTask, mapNurseTask as mapTask, CareTask } from '@/api/nurseTasks';

const NurseTasks: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'medication' | 'care' | 'pending' | 'completed'>('all');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listNurseTasks();
      setTasks(data.map(mapTask));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'pending' || filter === 'completed') return t.status === filter;
    return t.type === filter;
  });

  const completeTask = async (id: string) => {
    setCompletingId(id);
    setError('');
    try {
      const updated = await completeNurseTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? mapTask(updated) : t)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not complete task.');
    } finally {
      setCompletingId(null);
    }
  };

  const pending = tasks.filter((t) => t.status === 'pending').length;

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Care Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400">Medication rounds and daily care tasks · {pending} pending</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(['all', 'medication', 'care', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-rose-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading tasks...
            </div>
          ) : (
          <div className="space-y-3">
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${task.type === 'medication' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    {task.type === 'medication' ? <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{task.patient}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Room {task.room}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${task.type === 'medication' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Scheduled: {task.scheduled}
                    </p>
                  </div>
                </div>
                {task.status === 'pending' ? (
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={completingId === task.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 shrink-0 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {completingId === task.id ? 'Saving...' : 'Mark Done'}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No tasks found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different filter.</p>
              </div>
            )}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NurseTasks;
