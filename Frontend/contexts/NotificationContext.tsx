'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NotificationIconKey } from '@/lib/notificationIcons';

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

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    icon: 'calendar',
    color: 'blue',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Sarah Wilson is confirmed for tomorrow at 10:00 AM.',
    time: '5 min ago',
    unread: true,
    category: 'appointment'
  },
  {
    id: 'n2',
    icon: 'fileText',
    color: 'purple',
    title: 'New Prescription',
    message: 'A new prescription has been added to your records.',
    time: '1 hour ago',
    unread: true,
    category: 'prescription'
  },
  {
    id: 'n3',
    icon: 'testTube',
    color: 'green',
    title: 'Lab Report Ready',
    message: 'Your Complete Blood Count (CBC) report is now available.',
    time: '3 hours ago',
    unread: true,
    category: 'lab'
  },
  {
    id: 'n4',
    icon: 'pill',
    color: 'orange',
    title: 'Order Shipped',
    message: 'Your medicine order #ORD-1024 has been shipped.',
    time: 'Yesterday',
    unread: false,
    category: 'pharmacy'
  },
  {
    id: 'n5',
    icon: 'dollarSign',
    color: 'red',
    title: 'Invoice Due',
    message: 'Your consultation invoice #INV-2041 of $120 is due in 3 days.',
    time: '2 days ago',
    unread: true,
    category: 'billing'
  },
  {
    id: 'n6',
    icon: 'bell',
    color: 'blue',
    title: 'Reminder',
    message: 'Annual health check-up recommended. Book an appointment with your primary doctor.',
    time: '3 days ago',
    unread: false,
    category: 'appointment'
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
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
