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
  AtSign
} from 'lucide-react';

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

  const features = [
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
    { role: 'lab_tech', title: 'Laboratory', desc: 'Manage tests, reports, and appointments', icon: TestTube, color: 'from-indigo-500 to-purple-500' }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#top" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediCare Plus
              </span>
            </a>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="top" className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                Trusted healthcare, anytime
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Our Priority
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl">
                Complete hospital management system with appointments, telemedicine, pharmacy, lab tests, and more — all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/signup')}
                  className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all text-base font-semibold flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="tel:911"
                  className="px-7 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-base font-semibold flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Emergency</span>
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> HIPAA compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> 24/7 support</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Verified doctors</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/login-hero.png" alt="Healthcare illustration" className="w-full" />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{ opacity: { delay: 0.5 }, scale: { delay: 0.5 }, y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
                className="absolute -top-5 -left-5 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Top Rated</p>
                  <p className="text-xs text-gray-500">4.8 / 5 stars</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 0.7 }, scale: { delay: 0.7 }, y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } }}
                className="absolute -bottom-5 -right-3 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">24/7 Care</p>
                  <p className="text-xs text-gray-500">Always available</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                <CountUp value={stat.value} />
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What we offer</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for complete health management, in one seamless platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Role Cards */}
      <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Tailored experiences</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">Access Your Portal</h2>
          <p className="text-lg text-gray-600">Different roles, purpose-built dashboards</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {roleCards.map((card) => (
            <motion.button
              key={card.role}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/login?role=${card.role}`)}
              className="text-left rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
            >
              <div className={`relative bg-gradient-to-br ${card.color} p-7 text-white h-full`}>
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <card.icon className="w-14 h-14 mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">{card.title}</h3>
                <p className="text-white/90 relative z-10">{card.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold relative z-10">
                  Open portal <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* About / Why us */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/login-hero.png" alt="Why MediCare Plus" className="w-full" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Why MediCare Plus</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Healthcare designed around you
            </h2>
            <div className="space-y-5">
              {[
                { title: 'All-in-one platform', desc: 'Appointments, telemedicine, pharmacy and labs in a single account.' },
                { title: 'Secure & compliant', desc: 'Bank-grade encryption keeps your medical data private and safe.' },
                { title: 'Care that fits your life', desc: 'Consult from home, get reminders, and reorder medicines in a tap.' }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/signup')}
              className="mt-8 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold inline-flex items-center gap-2"
            >
              Create your account <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl"
        >
          <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of patients managing their health digitally with MediCare Plus.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all text-lg font-semibold inline-flex items-center gap-2 hover:-translate-y-0.5 transform"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-xl font-bold">MediCare Plus</span>
              </div>
              <p className="text-gray-400 mb-5">
                Complete hospital management system for modern healthcare.
              </p>
              <div className="flex items-center gap-3">
                {[Globe, MessageCircle, Send, AtSign].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Social link"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Appointments</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Telemedicine</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Pharmacy</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Lab Tests</a></li>
              </ul>
            </div>

            {/* For Professionals */}
            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li><Link href="/login?role=doctor" className="hover:text-blue-400 transition-colors">Doctor Portal</Link></li>
                <li><Link href="/login?role=admin" className="hover:text-blue-400 transition-colors">Admin Panel</Link></li>
                <li><Link href="/login?role=pharmacist" className="hover:text-blue-400 transition-colors">Pharmacy Module</Link></li>
                <li><Link href="/login?role=lab_tech" className="hover:text-blue-400 transition-colors">Lab Module</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2.5 text-gray-400">
                <li>
                  <a href="tel:911" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <Phone className="w-4 h-4" /> Emergency: 911
                  </a>
                </li>
                <li>
                  <a href="tel:1-800-633-4227" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <Phone className="w-4 h-4" /> 1-800-MEDICARE
                  </a>
                </li>
                <li>
                  <a href="mailto:support@medicareplus.com" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <Mail className="w-4 h-4" /> support@medicareplus.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> 500 Health Ave, NY
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} MediCare Plus. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <Link href="/login" className="hover:text-blue-400 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
