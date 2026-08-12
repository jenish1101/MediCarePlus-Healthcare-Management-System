'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Heart,
  Calendar,
  Phone,
  Shield,
  Clock,
  Users,
  Award,
  Activity,
  Stethoscope,
  Pill,
  TestTube,
  Video,
  ArrowRight,
  CheckCircle,
  Star,
  Mail,
  MapPin,
  Globe,
  MessageCircle,
  Send,
  AtSign,
  ClipboardList,
  HeartPulse,
  Truck,
  Menu,
  X
} from 'lucide-react';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';
import ThemeToggle from '@/components/ThemeToggle';

/* Animated count-up that runs once when scrolled into view. */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/^([\d.]+)(.*)$/);
  const numeric = match?.[1] ?? '0';
  const target = parseFloat(numeric);
  const suffix = match?.[2] ?? '';
  const decimals = numeric.includes('.') ? 1 : 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Landing: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Array<{ icon: typeof Calendar; title: string; desc: string; color: ThemeColor }> = [
    { icon: Calendar, title: 'Book Appointments', desc: 'Schedule with top doctors instantly', color: 'blue' },
    { icon: Video, title: 'Telemedicine', desc: '24/7 video consultations', color: 'purple' },
    { icon: Pill, title: 'Online Pharmacy', desc: 'Order medicines to your doorstep', color: 'green' },
    { icon: TestTube, title: 'Lab Tests', desc: 'Book tests and get reports online', color: 'orange' },
    { icon: Activity, title: 'Health Records', desc: 'Access all medical records anytime', color: 'red' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is safe with us', color: 'indigo' }
  ];

  const stats = [
    { value: '50K+', label: 'Happy Patients', icon: Users },
    { value: '500+', label: 'Expert Doctors', icon: Stethoscope },
    { value: '100K+', label: 'Appointments', icon: Calendar },
    { value: '4.8', label: 'Average Rating', icon: Star }
  ];

  const roleCards = [
    { role: 'patient', title: 'Patient Portal', desc: 'Book appointments, view records, order medicines', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { role: 'doctor', title: 'Doctor Dashboard', desc: 'Manage patients, prescriptions, and appointments', icon: Stethoscope, color: 'from-purple-500 to-pink-500' },
    { role: 'admin', title: 'Admin Panel', desc: 'Complete hospital management and analytics', icon: Shield, color: 'from-orange-500 to-red-500' },
    { role: 'pharmacist', title: 'Pharmacy Module', desc: 'Manage inventory, orders, and sales', icon: Pill, color: 'from-green-500 to-emerald-500' },
    { role: 'lab_tech', title: 'Laboratory', desc: 'Manage tests, reports, and appointments', icon: TestTube, color: 'from-indigo-500 to-purple-500' },
    { role: 'receptionist', title: 'Reception Desk', desc: 'Schedule appointments, patients, and rooms', icon: ClipboardList, color: 'from-teal-500 to-cyan-600' },
    { role: 'nurse', title: 'Nursing Station', desc: 'Patient care, vitals, and daily task lists', icon: HeartPulse, color: 'from-rose-500 to-pink-600' },
    { role: 'supplier', title: 'Supplier Portal', desc: 'Manage products, orders, and deliveries', icon: Truck, color: 'from-amber-500 to-orange-600' }
  ];

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Portals', href: '#portals' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-3">
            <a href="#top" className="flex items-center space-x-2 min-w-0 shrink">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0" />
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                MediCare Plus
              </span>
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <ThemeToggle />
              <button
                onClick={() => router.push('/login')}
                className="hidden sm:inline-flex px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/login');
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors sm:hidden"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="top" className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-purple-300/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Activity className="w-4 h-4" />
                Trusted healthcare, anytime
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                Your Health,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Our Priority
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                Complete hospital management system with appointments, telemedicine, pharmacy, lab tests, and more — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:flex-wrap justify-center lg:justify-start">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all text-base font-semibold flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="tel:911"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all text-base font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Emergency</span>
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-x-6 sm:gap-y-2 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> HIPAA compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> 24/7 support</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Verified doctors</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mt-4 sm:mt-0 px-2 sm:px-0"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/login-hero.png" alt="Healthcare illustration" className="w-full h-auto" />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: 0.5 }, scale: { delay: 0.5 }, y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
                className="absolute top-2 left-2 sm:-top-5 sm:-left-5 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-none dark:border dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-[calc(100%-1rem)]"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">Top Rated</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">4.8 / 5 stars</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 0.7 }, scale: { delay: 0.7 }, y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } }}
                className="absolute bottom-2 right-2 sm:-bottom-5 sm:-right-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-none dark:border dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-[calc(100%-1rem)]"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">24/7 Care</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Always available</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-3 sm:p-4 text-center hover:shadow-xl dark:hover:shadow-none transition-shadow min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-lg sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                <CountUp value={stat.value} />
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-14"
        >
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">What we offer</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-3 sm:mb-4 px-2">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            Everything you need for complete health management, in one seamless platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => {
            const colors = colorClasses[feature.color];
            return (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-7 shadow-lg dark:shadow-none dark:border dark:border-gray-700 hover:shadow-xl dark:hover:shadow-none transition-all"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.bg100} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.text600}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{feature.desc}</p>
            </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Role Cards */}
      <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-14"
        >
          <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Tailored experiences</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-3 sm:mb-4">Access Your Portal</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-2">Different roles, purpose-built dashboards</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {roleCards.map((card) => (
            <motion.button
              key={card.role}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/login?role=${card.role}`)}
              className="text-left rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all w-full"
            >
              <div className={`relative bg-gradient-to-br ${card.color} p-5 sm:p-7 text-white h-full min-h-[160px] sm:min-h-0`}>
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <card.icon className="w-10 h-10 sm:w-14 sm:h-14 mb-3 sm:mb-4 relative z-10" />
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 relative z-10">{card.title}</h3>
                <p className="text-white/90 text-sm sm:text-base relative z-10 line-clamp-2">{card.desc}</p>
                <span className="mt-4 sm:mt-5 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold relative z-10">
                  Open portal <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* About / Why us */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 order-2 lg:order-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/login-hero.png" alt="Why MediCare Plus" className="w-full h-auto" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Why MediCare Plus</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-4 sm:mb-6">
              Healthcare designed around you
            </h2>
            <div className="space-y-4 sm:space-y-5">
              {[
                { title: 'All-in-one platform', desc: 'Appointments, telemedicine, pharmacy and labs in a single account.' },
                { title: 'Secure & compliant', desc: 'Bank-grade encryption keeps your medical data private and safe.' },
                { title: 'Care that fits your life', desc: 'Consult from home, get reminders, and reorder medicines in a tap.' }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 sm:gap-4 text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/signup')}
              className="mt-6 sm:mt-8 w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Create your account <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 text-center text-white shadow-2xl"
        >
          <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of patients managing their health digitally with MediCare Plus.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all text-base sm:text-xl font-semibold inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 transform"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-10 sm:pt-16 pb-6 sm:pb-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-red-500 shrink-0" />
                <span className="text-lg sm:text-xl font-bold">MediCare Plus</span>
              </div>
              <p className="text-gray-400 mb-5 text-sm sm:text-base">
                Complete hospital management system for modern healthcare.
              </p>
              <div className="flex items-center gap-3">
                {[Globe, MessageCircle, Send, AtSign].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Portals & Services — side by side on all screen sizes */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 sm:col-span-2 lg:contents min-w-0">
              <div className="min-w-0">
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Portals</h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                  {roleCards.map((card) => (
                    <li key={card.role}>
                      <button
                        onClick={() => router.push(`/login?role=${card.role}`)}
                        className="hover:text-white transition-colors text-left break-words"
                      >
                        {card.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                  <li><a href="#services" className="hover:text-white transition-colors">Appointments</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Telemedicine</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Pharmacy</a></li>
                  <li><a href="#services" className="hover:text-white transition-colors">Lab Tests</a></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="break-all">support@medicareplus.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>123 Health Ave, Medical City</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} MediCare Plus. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;