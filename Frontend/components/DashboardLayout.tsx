'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Pill,
  TestTube,
  Package,
  BarChart3,
  Bed,
  DollarSign,
  User,
  Shield,
  Activity,
  HelpCircle,
  UserPlus,
  CalendarPlus,
  MessageSquare,
  CalendarClock,
  ClipboardList,
  Share2,
  Stethoscope,
  ScrollText,
  Megaphone,
  Building2,
  AlertTriangle,
  ShoppingCart,
  RotateCcw,
  BookOpen,
  ScanBarcode,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationIconMap } from '@/lib/notificationIcons';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const roleBasePath: Record<UserRole, string> = {
    patient: '/patient',
    doctor: '/doctor',
    admin: '/admin',
    pharmacist: '/pharmacy',
    lab_tech: '/lab',
    receptionist: '/reception',
    nurse: '/nurse',
    supplier: '/supplier'
  };

  const navigationItems: Record<UserRole, Array<{ icon: React.ElementType; label: string; path: string }>> = {
    patient: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
      { icon: CalendarPlus, label: 'Book Appointment', path: '/patient/book-appointment' },
      { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
      { icon: Users, label: 'Find Doctors', path: '/patient/doctors' },
      { icon: FileText, label: 'Prescriptions', path: '/patient/prescriptions' },
      { icon: TestTube, label: 'Lab Reports', path: '/patient/lab-reports' },
      { icon: Pill, label: 'Pharmacy', path: '/patient/pharmacy' },
      { icon: Activity, label: 'Health Timeline', path: '/patient/timeline' },
      { icon: DollarSign, label: 'Billing', path: '/patient/billing' },
      { icon: UserPlus, label: 'Family Members', path: '/patient/family' },
      { icon: Shield, label: 'Insurance', path: '/patient/insurance' },
      { icon: Bell, label: 'Notifications', path: '/patient/notifications' },
      { icon: HelpCircle, label: 'Help & FAQ', path: '/patient/help' },
      { icon: User, label: 'Profile', path: '/patient/profile' }
    ],
    doctor: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
      { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
      { icon: Users, label: 'Patients', path: '/doctor/patients' },
      { icon: ClipboardList, label: 'Medical Notes', path: '/doctor/notes' },
      { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
      { icon: Share2, label: 'Referrals', path: '/doctor/referrals' },
      { icon: MessageSquare, label: 'Messages', path: '/doctor/messages' },
      { icon: DollarSign, label: 'Earnings', path: '/doctor/earnings' },
      { icon: CalendarClock, label: 'Availability', path: '/doctor/availability' },
      { icon: User, label: 'Profile', path: '/doctor/profile' }
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Stethoscope, label: 'Doctor Onboarding', path: '/admin/doctor-onboarding' },
      { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
      { icon: Bed, label: 'Beds', path: '/admin/beds' },
      { icon: Package, label: 'Inventory', path: '/admin/inventory' },
      { icon: Building2, label: 'Departments', path: '/admin/departments' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
      { icon: ScrollText, label: 'Audit Log', path: '/admin/audit-log' },
      { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
      { icon: User, label: 'Profile', path: '/admin/profile' }
    ],
    pharmacist: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/pharmacy/dashboard' },
      { icon: FileText, label: 'Prescriptions', path: '/pharmacy/prescriptions' },
      { icon: Pill, label: 'Inventory', path: '/pharmacy/inventory' },
      { icon: Package, label: 'Orders', path: '/pharmacy/orders' },
      { icon: AlertTriangle, label: 'Expiry Alerts', path: '/pharmacy/expiry-alerts' },
      { icon: ShoppingCart, label: 'Purchase Orders', path: '/pharmacy/purchase-orders' },
      { icon: RotateCcw, label: 'Returns', path: '/pharmacy/returns' },
      { icon: Users, label: 'Suppliers', path: '/pharmacy/suppliers' },
      { icon: BarChart3, label: 'Sales', path: '/pharmacy/sales' },
      { icon: User, label: 'Profile', path: '/pharmacy/profile' }
    ],
    lab_tech: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/lab/dashboard' },
      { icon: TestTube, label: 'Tests', path: '/lab/tests' },
      { icon: BookOpen, label: 'Test Catalog', path: '/lab/catalog' },
      { icon: ScanBarcode, label: 'Sample Tracking', path: '/lab/samples' },
      { icon: FileText, label: 'Reports', path: '/lab/reports' },
      { icon: Wrench, label: 'Equipment / QC', path: '/lab/equipment' },
      { icon: Calendar, label: 'Appointments', path: '/lab/appointments' },
      { icon: User, label: 'Profile', path: '/lab/profile' }
    ],
    receptionist: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/reception/dashboard' },
      { icon: Calendar, label: 'Appointments', path: '/reception/appointments' },
      { icon: Users, label: 'Patients', path: '/reception/patients' },
      { icon: Bed, label: 'Rooms', path: '/reception/rooms' }
    ],
    nurse: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/nurse/dashboard' },
      { icon: Users, label: 'Patients', path: '/nurse/patients' },
      { icon: Calendar, label: 'Tasks', path: '/nurse/tasks' }
    ],
    supplier: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/supplier/dashboard' },
      { icon: Package, label: 'Products', path: '/supplier/products' },
      { icon: FileText, label: 'Orders', path: '/supplier/orders' }
    ]
  };

  const navItems = navigationItems[role] || navigationItems.patient;

  const requestLogout = () => {
    setMobileMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push('/');
  };

  const goToSettings = () => {
    setMobileMenuOpen(false);
    router.push(`${roleBasePath[role]}/settings`);
  };

  const goToProfile = () => {
    setShowNotifications(false);
    router.push(`${roleBasePath[role]}/profile`);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Heart className="w-7 h-7 text-red-500" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MediCare Plus
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((s) => !s)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      {/* Click-away overlay */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                          <h4 className="font-semibold text-gray-900">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                          {notifications.map((n) => {
                            const NIcon = notificationIconMap[n.icon];
                            return (
                            <div
                              key={n.id}
                              onClick={() => n.unread && markAsRead(n.id)}
                              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                n.unread ? 'bg-blue-50/40' : ''
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-full bg-${n.color}-100 flex items-center justify-center shrink-0`}>
                                <NIcon className={`w-5 h-5 text-${n.color}-600`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                                  {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            if (role === 'patient') {
                              router.push('/patient/notifications');
                            } else {
                              markAllAsRead();
                            }
                          }}
                          className="w-full py-2.5 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors border-t"
                        >
                          {role === 'patient' ? 'View all notifications' : 'Mark all as read'}
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={goToProfile}
                className="flex items-center space-x-3 rounded-lg p-1 hover:bg-gray-100 transition-colors"
                aria-label="View profile"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-full border-2 border-blue-500"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={false}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', damping: 20 }}
            className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-40 overflow-hidden"
          >
            <nav className="p-3 h-full flex flex-col min-w-0">
              <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden min-w-0">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left text-sm min-w-0"
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1">
                <button
                  onClick={goToSettings}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm"
                >
                  <Settings className="w-5 h-5 text-gray-600 shrink-0" />
                  <span className="font-medium text-gray-700">Settings</span>
                </button>
                <button
                  onClick={requestLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left text-sm"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-4rem)]">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left text-sm min-w-0"
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                ))}
                <div className="border-t mt-3 pt-3 space-y-1">
                  <button
                    onClick={goToSettings}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left text-sm"
                  >
                    <Settings className="w-5 h-5 text-gray-600 shrink-0" />
                    <span className="font-medium text-gray-700">Settings</span>
                  </button>
                  <button
                    onClick={requestLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left text-sm"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-16 transition-[padding] duration-300 overflow-x-hidden ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] min-w-0">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Log out?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to log out of your account?
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
