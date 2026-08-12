'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, X, Heart, Calendar, Phone } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  phone: string;
  bloodGroup: string;
}

const initialMembers: FamilyMember[] = [
  {
    id: 'fm1',
    name: 'Jane Patient',
    relationship: 'Spouse',
    dateOfBirth: '1990-05-15',
    phone: '+1 (555) 234-5678',
    bloodGroup: 'A+'
  },
  {
    id: 'fm2',
    name: 'Tommy Patient',
    relationship: 'Son',
    dateOfBirth: '2015-08-22',
    phone: '+1 (555) 234-5679',
    bloodGroup: 'O+'
  }
];

const relationshipOptions = ['Spouse', 'Son', 'Daughter', 'Parent', 'Sibling', 'Other'];

const FamilyMembers: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    dateOfBirth: '',
    phone: '',
    bloodGroup: ''
  });

  const stats = [
    { label: 'Total Members', value: members.length + 1, color: 'blue' },
    { label: 'Dependents', value: members.length, color: 'purple' },
    { label: 'Active Profiles', value: members.length + 1, color: 'green' }
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.relationship) return;

    setMembers((prev) => [
      ...prev,
      {
        id: `fm${Date.now()}`,
        ...form
      }
    ]);
    setForm({ name: '', relationship: '', dateOfBirth: '', phone: '', bloodGroup: '' });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Family Members</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage dependents under your account</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Add Member
            </button>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Primary Account Holder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-white/80">Primary Account Holder</p>
                <h3 className="text-xl font-bold">John Patient</h3>
                <p className="text-sm text-white/80 mt-1">Blood Group: B+ · DOB: 1988-03-10</p>
              </div>
            </div>
          </motion.div>

          {/* Add Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleAdd}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Add Family Member
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
                      <select
                        required
                        value={form.relationship}
                        onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select relationship</option>
                        {relationshipOptions.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
                      <select
                        value={form.bloodGroup}
                        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select blood group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Members List */}
          <div className="space-y-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{member.name}</h4>
                      <span className="inline-block px-2.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium mt-1">
                        {member.relationship}
                      </span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {member.dateOfBirth && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {member.dateOfBirth}
                          </span>
                        )}
                        {member.phone && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {member.phone}
                          </span>
                        )}
                        {member.bloodGroup && (
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1 text-red-500 dark:text-red-400" />
                            {member.bloodGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label={`Remove ${member.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {members.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No family members yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Add dependents to manage their health records.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add First Member
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default FamilyMembers;
