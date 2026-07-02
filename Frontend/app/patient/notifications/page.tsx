'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationIconMap } from '@/lib/notificationIcons';
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

  const stats = [
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
              <p className="text-gray-600 text-sm">Stay updated on your health activities</p>
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

          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <p className={`text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {(['all', 'unread', 'appointment', 'prescription', 'lab', 'pharmacy', 'billing'] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
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
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => n.unread && markAsRead(n.id)}
                  className={`rounded-xl shadow-lg p-5 flex items-start gap-4 cursor-pointer hover:shadow-xl transition-all ${
                    n.unread
                      ? 'bg-blue-50 border border-blue-100 border-l-4 border-l-blue-500'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-${n.color}-100 flex items-center justify-center shrink-0`}>
                    <NIcon className={`w-5 h-5 text-${n.color}-600`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">{n.title}</p>
                      {n.unread && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-400">{n.time}</p>
                      {n.category && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full capitalize">
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
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                <Bell className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You&apos;re all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientNotifications;
