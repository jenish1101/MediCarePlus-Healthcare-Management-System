'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Stethoscope,
  Shield,
  Pill,
  TestTube,
  CheckCircle,
  ClipboardList,
  HeartPulse,
  Truck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

const LoginForm: React.FC<{ initialRole: UserRole }> = ({ initialRole }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles: { value: UserRole; label: string; demo: string; icon: React.ElementType }[] = [
    { value: 'patient', label: 'Patient', demo: 'patient@demo.com', icon: User },
    { value: 'doctor', label: 'Doctor', demo: 'doctor@demo.com', icon: Stethoscope },
    { value: 'admin', label: 'Admin', demo: 'admin@demo.com', icon: Shield },
    { value: 'pharmacist', label: 'Pharmacist', demo: 'pharmacist@demo.com', icon: Pill },
    { value: 'lab_tech', label: 'Lab Tech', demo: 'lab@demo.com', icon: TestTube },
    { value: 'receptionist', label: 'Reception', demo: 'receptionist@demo.com', icon: ClipboardList },
    { value: 'nurse', label: 'Nurse', demo: 'nurse@demo.com', icon: HeartPulse },
    { value: 'supplier', label: 'Supplier', demo: 'supplier@demo.com', icon: Truck }
  ];

  const activeRole = roles.find((r) => r.value === selectedRole) ?? roles[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password || 'demo123', selectedRole);

      const roleRoutes: Record<UserRole, string> = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard',
        pharmacist: '/pharmacy/dashboard',
        lab_tech: '/lab/dashboard',
        receptionist: '/reception/dashboard',
        nurse: '/nurse/dashboard',
        supplier: '/supplier/dashboard'
      };

      router.push(roleRoutes[selectedRole] || '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please use the demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Book appointments & video consultations',
    'Manage prescriptions and lab reports',
    'Order medicines from the pharmacy',
    'Secure, role-based access for everyone'
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left: Branded visual panel */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <Heart className="w-8 h-8 text-white" />
          <span className="text-lg font-bold">MediCare Plus</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-3xl bg-white/10 backdrop-blur-sm p-3 shadow-2xl ring-1 ring-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/login-hero.png"
                alt="Healthcare illustration"
                className="w-full rounded-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="text-xl font-bold leading-tight">
              Your complete hospital management system
            </h2>
            <ul className="mt-6 space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <CheckCircle className="w-5 h-5 text-white shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          © {new Date().getFullYear()} MediCare Plus. All rights reserved.
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center p-4 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediCare Plus
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8">Sign in to access your {activeRole.label.toLowerCase()} portal</p>

          {/* Role selector */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select your role</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7">
            {roles.map((role) => {
              const active = selectedRole === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.value);
                    setEmail('');
                  }}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                    active
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <role.icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{role.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <span className="text-xs text-gray-400 dark:text-gray-500">Forgot password?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-7 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Demo credentials</p>
              <span className="text-xs text-blue-500 dark:text-blue-400">Password: demo123</span>
            </div>
            <button
              type="button"
              onClick={() => setEmail(activeRole.demo)}
              className="w-full flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-gray-800 px-3 py-2.5 text-left border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group"
            >
              <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <activeRole.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {activeRole.demo}
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:underline">Use</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            New patient?{' '}
            <Link href="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
