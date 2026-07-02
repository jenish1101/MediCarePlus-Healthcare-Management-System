'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agree) {
      setError('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, phone: form.phone });
      router.push('/patient/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Book appointments with top doctors',
    'Start instant video consultations',
    'Track prescriptions & lab reports',
    'Order medicines to your doorstep'
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left: Branded visual panel */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white">
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
              <img src="/login-hero.png" alt="Healthcare illustration" className="w-full rounded-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="text-xl font-bold leading-tight">Your health, all in one place</h2>
            <ul className="mt-6 space-y-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <CheckCircle className="w-5 h-5 text-white shrink-0" />
                  {b}
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
          <button
            onClick={() => router.push('/')}
            className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediCare Plus
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 mb-8">Sign up as a patient to get started</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={(e) => update('confirm', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms-of-service" className="text-blue-600 font-medium hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-blue-600 font-medium hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-gray-400">
            Are you a doctor, pharmacist, or lab technician? Your account is created by your hospital administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
