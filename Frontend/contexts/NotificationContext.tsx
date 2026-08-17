'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { NotificationIconKey } from '@/lib/notificationIcons';
import { useAuth } from '@/contexts/AuthContext';
import * as notificationsApi from '@/api/notifications';
import { BackendNotification } from '@/api/notifications';

export type NotificationCategory = 'appointment' | 'prescription' | 'lab' | 'pharmacy' | 'billing';

export interface AppNotification {
  id: string;
  icon: NotificationIconKey;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  category?: NotificationCategory;
}

function mapNotification(n: BackendNotification): AppNotification {
  return {
    id: n.id,
    icon: n.icon as NotificationIconKey,
    color: n.color as AppNotification['color'],
    title: n.title,
    message: n.message,
    time: n.time_label,
    unread: n.unread,
    category: n.category as NotificationCategory | undefined
  };
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clears state left over from a just-ended session (e.g. after logout).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifications([]);
      return;
    }
    notificationsApi
      .listNotifications()
      .then((data) => setNotifications(data.map(mapNotification)))
      .catch(() => setNotifications([]));
  }, [isAuthenticated]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    notificationsApi.markNotificationRead(id).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    notificationsApi.markAllNotificationsRead().catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
