'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationIconMap } from '@/lib/notificationIcons';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';
import { AppNotification } from '@/contexts/NotificationContext';

type FilterType = 'all' | 'unread' | NonNullable<AppNotification['category']>;

const PatientNotifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const visible = notifications.filter((n) => !deletedIds.includes(n.id));
  const visibleUnread = visible.filter((n) => n.unread).length;

  const filtered = visible.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.category === filter;
  });

  const deleteNotification = (id: string) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  const stats: { label: string; value: number; color: ThemeColor }[] = [
    { label: 'Total', value: visible.length, color: 'blue' },
    { label: 'Unread', value: visibleUnread, color: 'orange' },
    { label: 'Read', value: visible.length - visibleUnread, color: 'green' }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Stay updated on your health activities</p>
            </div>
            {visibleUnread > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <CheckCheck className="w-5 h-5" />
                Mark All as Read
              </button>
            )}
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 max-w-2xl">
            {stats.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center min-w-0"
              >
                <p className={`text-xl sm:text-2xl font-bold ${colors.text600}`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">{s.label}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {(['all', 'unread', 'appointment', 'prescription', 'lab', 'pharmacy', 'billing'] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {f}
                </button>
              )
            )}
          </div>

          <div className="space-y-4">
            {filtered.map((n, i) => {
              const NIcon = notificationIconMap[n.icon];
              const colors = colorClasses[n.color];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => n.unread && markAsRead(n.id)}
                  className={`rounded-xl shadow-lg p-4 sm:p-5 flex items-start gap-3 sm:gap-4 cursor-pointer hover:shadow-xl transition-all ${
                    n.unread
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 border-l-4 border-l-blue-500'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${colors.bg100} flex items-center justify-center shrink-0`}>
                    <NIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text600}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
                      {n.unread && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-400 dark:text-gray-500">{n.time}</p>
                      {n.category && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full capitalize">
                          {n.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-10 text-center">
                <Bell className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">You&apos;re all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientNotifications;
