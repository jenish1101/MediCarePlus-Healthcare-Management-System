'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Shield, Briefcase, Calendar, Pencil, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? 'Admin User',
    email: user?.email ?? 'admin@demo.com',
    phone: user?.phone ?? '+1 (800) 555-0199',
    location: 'New York, NY',
    department: 'Hospital Administration',
    joined: 'December 2021'
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fields: { key: keyof typeof form; label: string; icon: React.ElementType }[] = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'department', label: 'Department', icon: Briefcase }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-gray-600">Manage your administrator account</p>
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
                  src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                  alt={form.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{form.name}</h2>
                  <p className="inline-flex items-center gap-1 text-sm text-red-600 font-medium mt-1">
                    <Shield className="w-4 h-4" /> Administrator
                  </p>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-5">Account Information</h3>
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
              {fields.map(({ key, label, icon: Icon }) => (
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={form.joined}
                    disabled
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminProfile;
