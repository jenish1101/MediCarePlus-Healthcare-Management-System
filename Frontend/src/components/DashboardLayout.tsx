import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: Record<UserRole, Array<{ icon: any; label: string; path: string }>> = {
    patient: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
      { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
      { icon: Users, label: 'Find Doctors', path: '/patient/doctors' },
      { icon: FileText, label: 'Prescriptions', path: '/patient/prescriptions' },
      { icon: TestTube, label: 'Lab Reports', path: '/patient/lab-reports' },
      { icon: Pill, label: 'Pharmacy', path: '/patient/pharmacy' },
      { icon: User, label: 'Profile', path: '/patient/profile' }
    ],
    doctor: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
      { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
      { icon: Users, label: 'Patients', path: '/doctor/patients' },
      { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
      { icon: DollarSign, label: 'Earnings', path: '/doctor/earnings' },
      { icon: Settings, label: 'Availability', path: '/doctor/availability' }
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
      { icon: Bed, label: 'Beds', path: '/admin/beds' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: DollarSign, label: 'Billing', path: '/admin/billing' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' }
    ],
    pharmacist: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/pharmacy/dashboard' },
      { icon: Pill, label: 'Inventory', path: '/pharmacy/inventory' },
      { icon: Package, label: 'Orders', path: '/pharmacy/orders' },
      { icon: Users, label: 'Suppliers', path: '/pharmacy/suppliers' },
      { icon: BarChart3, label: 'Sales', path: '/pharmacy/sales' }
    ],
    lab_tech: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/lab/dashboard' },
      { icon: TestTube, label: 'Tests', path: '/lab/tests' },
      { icon: FileText, label: 'Reports', path: '/lab/reports' },
      { icon: Calendar, label: 'Appointments', path: '/lab/appointments' }
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MediCare Plus
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar - Desktop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-40"
          >
            <nav className="p-4 h-full flex flex-col">
              <div className="flex-1 space-y-2">
                {navItems.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
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
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-4">
                {navItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <div className="border-t mt-4 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
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
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
