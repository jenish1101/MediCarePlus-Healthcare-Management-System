import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ArrowRight
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Calendar, title: 'Book Appointments', desc: 'Schedule with top doctors instantly' },
    { icon: Video, title: 'Telemedicine', desc: '24/7 video consultations' },
    { icon: Pill, title: 'Online Pharmacy', desc: 'Order medicines to your doorstep' },
    { icon: TestTube, title: 'Lab Tests', desc: 'Book tests and get reports online' },
    { icon: Activity, title: 'Health Records', desc: 'Access all medical records anytime' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is safe with us' }
  ];

  const stats = [
    { value: '50K+', label: 'Patients' },
    { value: '500+', label: 'Doctors' },
    { value: '100K+', label: 'Appointments' },
    { value: '4.8', label: 'Rating' }
  ];

  const roleCards = [
    { role: 'patient', title: 'Patient Portal', desc: 'Book appointments, view records, order medicines', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { role: 'doctor', title: 'Doctor Dashboard', desc: 'Manage patients, prescriptions, and appointments', icon: Stethoscope, color: 'from-purple-500 to-pink-500' },
    { role: 'admin', title: 'Admin Panel', desc: 'Complete hospital management and analytics', icon: Shield, color: 'from-orange-500 to-red-500' },
    { role: 'pharmacist', title: 'Pharmacy Module', desc: 'Manage inventory, orders, and sales', icon: Pill, color: 'from-green-500 to-emerald-500' },
    { role: 'lab_tech', title: 'Laboratory', desc: 'Manage tests, reports, and appointments', icon: TestTube, color: 'from-indigo-500 to-purple-500' }
  ];

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
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediCare Plus
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Health,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Our Priority
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Complete hospital management system with appointments, telemedicine, pharmacy, lab tests, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-lg font-semibold flex items-center space-x-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-lg font-semibold flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Emergency</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[Activity, Calendar, Pill, TestTube].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-6 flex items-center justify-center"
                  >
                    <Icon className="w-12 h-12 text-white" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-4 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-4 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need for complete health management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Role Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Access Your Portal
          </h2>
          <p className="text-xl text-gray-600">
            Different roles, tailored experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roleCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/login', { state: { role: card.role } })}
              className="cursor-pointer rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
            >
              <div className={`bg-gradient-to-br ${card.color} p-8 text-white`}>
                <card.icon className="w-16 h-16 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/90">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of patients managing their health digitally
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all text-lg font-semibold inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-xl font-bold">MediCare Plus</span>
              </div>
              <p className="text-gray-400">
                Complete hospital management system for modern healthcare.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Appointments</li>
                <li>Telemedicine</li>
                <li>Pharmacy</li>
                <li>Lab Tests</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Doctor Portal</li>
                <li>Admin Panel</li>
                <li>Pharmacy Module</li>
                <li>Lab Module</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: 911</li>
                <li>Support: 1-800-MEDICARE</li>
                <li>Email: support@medicareplus.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediCare Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
