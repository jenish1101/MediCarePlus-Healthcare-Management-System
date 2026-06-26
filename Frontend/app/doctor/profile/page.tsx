'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Stethoscope, Award, DollarSign, Star, Pencil, Check, Briefcase } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? 'Dr. Sarah Wilson',
    email: user?.email ?? 'sarah.wilson@hospital.com',
    phone: user?.phone ?? '+1234567891',
    location: 'New York, NY',
    specialization: 'Cardiology',
    experience: '15 years',
    fees: '500',
    about: 'Board-certified cardiologist with 15 years of experience in interventional cardiology and preventive heart care.'
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const qualifications = ['MBBS', 'MD Cardiology', 'Fellowship in Interventional Cardiology'];

  const contactFields: { key: keyof typeof form; label: string; icon: React.ElementType }[] = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'location', label: 'Location', icon: MapPin }
  ];

  const proFields: { key: keyof typeof form; label: string; icon: React.ElementType }[] = [
    { key: 'specialization', label: 'Specialization', icon: Stethoscope },
    { key: 'experience', label: 'Experience', icon: Briefcase },
    { key: 'fees', label: 'Consultation Fees ($)', icon: DollarSign }
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-gray-600">Manage your professional information</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="h-28 bg-gradient-to-r from-blue-500 to-purple-600" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'}
                  alt={form.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{form.name}</h2>
                  <p className="text-gray-500">{form.specialization}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-gray-900">4.8</span>
                    <span className="text-gray-400">(234 reviews)</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing((e) => !e)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    editing ? 'bg-green-600 text-white hover:bg-green-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {editing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <textarea
              value={form.about}
              disabled={!editing}
              onChange={(e) => update('about', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-5">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {contactFields.map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form[key]}
                      disabled={!editing}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Professional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold">Professional Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {proFields.map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={form[key]}
                      disabled={!editing}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">Qualifications</label>
              <div className="flex flex-wrap gap-2">
                {qualifications.map((q) => (
                  <span key={q} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorProfile;
