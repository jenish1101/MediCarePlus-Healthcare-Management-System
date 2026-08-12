'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  FileText,
  TestTube,
  Filter,
  Stethoscope,
  Pill
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments, mockPrescriptions, mockLabReports } from '@/data/mockData';

type TimelineType = 'all' | 'appointment' | 'prescription' | 'lab';

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'prescription' | 'lab';
  date: string;
  title: string;
  subtitle: string;
  detail: string;
  status?: string;
  color: string;
}

const typeConfig = {
  appointment: { icon: Calendar, label: 'Appointment', badge: 'bg-blue-100 text-blue-700' },
  prescription: { icon: FileText, label: 'Prescription', badge: 'bg-purple-100 text-purple-700' },
  lab: { icon: TestTube, label: 'Lab Report', badge: 'bg-green-100 text-green-700' }
};

const HealthTimeline: React.FC = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<TimelineType>('all');

  const events = useMemo(() => {
    const timeline: TimelineEvent[] = [];

    mockAppointments.forEach((apt) => {
      timeline.push({
        id: apt.id,
        type: 'appointment',
        date: apt.date,
        title: apt.doctorName,
        subtitle: apt.doctorSpecialization,
        detail: apt.reason,
        status: apt.status,
        color: 'blue'
      });
    });

    mockPrescriptions.forEach((rx) => {
      timeline.push({
        id: rx.id,
        type: 'prescription',
        date: rx.date,
        title: `Prescription #${rx.id}`,
        subtitle: rx.diagnosis,
        detail: rx.medicines.map((m) => m.name).join(', '),
        color: 'purple'
      });
    });

    mockLabReports.forEach((lab) => {
      timeline.push({
        id: lab.id,
        type: 'lab',
        date: lab.date,
        title: lab.testName,
        subtitle: lab.status === 'completed' ? 'Results available' : 'Awaiting results',
        detail: lab.results || 'Test in progress',
        status: lab.status,
        color: 'green'
      });
    });

    return timeline.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  const stats = [
    { label: 'Appointments', value: mockAppointments.length, color: 'blue' },
    { label: 'Prescriptions', value: mockPrescriptions.length, color: 'purple' },
    { label: 'Lab Reports', value: mockLabReports.length, color: 'green' },
    { label: 'Total Events', value: events.length, color: 'indigo' }
  ];

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

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            <div className="space-y-6">
              {filtered.map((event, i) => {
                const config = typeConfig[event.type];
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default HealthTimeline;
