'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  FileText,
  TestTube,
  Filter,
  Stethoscope,
  Pill,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { getMyHealthTimeline, BackendTimelineEvent } from '@/api/healthTimeline';

type TimelineType = 'all' | 'appointment' | 'prescription' | 'lab';

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'prescription' | 'lab' | string;
  date: string;
  title: string;
  subtitle: string;
  detail: string;
  status?: string;
  color: string;
}

const colorForType: Record<string, string> = {
  appointment: 'blue',
  prescription: 'purple',
  lab: 'green'
};

function mapTimelineEvent(e: BackendTimelineEvent): TimelineEvent {
  return {
    id: e.id,
    type: e.type,
    date: e.date,
    title: e.title,
    subtitle: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : '',
    detail: e.description,
    status: e.status,
    color: colorForType[e.type] || 'indigo'
  };
}

const typeConfig: Record<string, { icon: typeof Calendar; label: string; badge: string }> = {
  appointment: { icon: Calendar, label: 'Appointment', badge: 'bg-blue-100 text-blue-700' },
  prescription: { icon: FileText, label: 'Prescription', badge: 'bg-purple-100 text-purple-700' },
  lab: { icon: TestTube, label: 'Lab Report', badge: 'bg-green-100 text-green-700' }
};

const defaultTypeConfig = { icon: Activity, label: 'Event', badge: 'bg-gray-100 text-gray-700' };

const HealthTimeline: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<TimelineType>('all');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyHealthTimeline();
      const mapped = data.map(mapTimelineEvent).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEvents(mapped);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load health timeline.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  const stats = useMemo(
    () => [
      { label: 'Appointments', value: events.filter((e) => e.type === 'appointment').length, color: 'blue' },
      { label: 'Prescriptions', value: events.filter((e) => e.type === 'prescription').length, color: 'purple' },
      { label: 'Lab Reports', value: events.filter((e) => e.type === 'lab').length, color: 'green' },
      { label: 'Total Events', value: events.length, color: 'indigo' }
    ],
    [events]
  );

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Health Timeline</h1>
              <p className="text-gray-600 dark:text-gray-400">Your complete medical history in one place</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400 hidden sm:block" />
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {(['all', 'appointment', 'prescription', 'lab'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                {f === 'all' ? 'All Events' : f === 'lab' ? 'Lab Reports' : `${f}s`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading health timeline...
            </div>
          ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            <div className="space-y-6">
              {filtered.map((event, i) => {
                const config = typeConfig[event.type] || defaultTypeConfig;
                const Icon = config.icon;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative flex gap-6 sm:gap-6"
                  >
                    <div
                      className={`hidden sm:flex w-12 h-12 rounded-full bg-${event.color}-100 items-center justify-center shrink-0 z-10 border-4 border-gray-50 dark:border-gray-900`}
                    >
                      <Icon className={`w-5 h-5 text-${event.color}-600`} />
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-5 hover:shadow-xl dark:hover:bg-gray-700/30 transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                              {config.label}
                            </span>
                            {event.status && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                                {event.status}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{event.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{event.subtitle}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium shrink-0">{event.date}</span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm">{event.detail}</p>

                      {event.type === 'prescription' && (
                        <button
                          onClick={() => router.push('/patient/prescriptions')}
                          className="mt-3 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                          <Pill className="w-4 h-4" />
                          View full prescription details
                        </button>
                      )}

                      {event.type === 'appointment' && (
                        <button
                          onClick={() => router.push('/patient/appointments')}
                          className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Stethoscope className="w-4 h-4" />
                          {event.status === 'scheduled' ? 'Upcoming visit' : 'Visit completed'}
                        </button>
                      )}

                      {event.type === 'lab' && (
                        <button
                          onClick={() => router.push('/patient/lab-reports')}
                          className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          <TestTube className="w-4 h-4" />
                          View lab report
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No events found</h3>
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

export default HealthTimeline;
