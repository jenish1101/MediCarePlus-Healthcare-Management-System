'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pencil, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileConfig, ProfileFieldConfig } from '@/lib/profileConfig';
import { UserRole } from '@/types';

interface RoleProfilePageProps {
  role: UserRole;
}

const RoleProfilePage: React.FC<RoleProfilePageProps> = ({ role }) => {
  const { user, updateProfile } = useAuth();
  const config = getProfileConfig(role);
  const { theme, roleLabel, roleIcon: RoleIcon, subtitle, stats, sections, tags, defaults } = config;

  const initialForm = useMemo(() => {
    return {
      ...defaults,
      name: user?.name ?? defaults.name,
      email: user?.email ?? defaults.email,
      phone: user?.phone ?? defaults.phone
    };
  }, [defaults, user]);

  const [form, setForm] = useState<Record<string, string>>(initialForm);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone
    });
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditing(false);
  };

  const accentBtn =
    theme.accent === 'blue'
      ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
      : theme.accent === 'purple'
        ? 'border-purple-600 text-purple-600 hover:bg-purple-50'
        : theme.accent === 'red'
          ? 'border-red-600 text-red-600 hover:bg-red-50'
          : theme.accent === 'green'
            ? 'border-green-600 text-green-600 hover:bg-green-50'
            : theme.accent === 'indigo'
              ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
              : theme.accent === 'teal'
                ? 'border-teal-600 text-teal-600 hover:bg-teal-50'
                : theme.accent === 'rose'
                  ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                  : 'border-amber-600 text-amber-600 hover:bg-amber-50';

  const renderField = (field: ProfileFieldConfig) => {
    const Icon = field.icon;
    const value = form[field.key] ?? '';
    const spanClass = field.span === 2 ? 'sm:col-span-2' : '';

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className={spanClass}>
          <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
          {editing ? (
            <textarea
              value={value}
              onChange={(e) => update(field.key, e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 resize-none ${theme.ring}`}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {value}
            </p>
          )}
        </div>
      );
    }

    if (editing && !field.readOnly) {
      return (
        <div key={field.key} className={spanClass}>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={value}
              onChange={(e) => update(field.key, e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 ${theme.ring}`}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        key={field.key}
        className={`flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/80 hover:bg-gray-50 transition-colors ${spanClass}`}
      >
        <div className={`w-10 h-10 rounded-xl ${theme.accentLight} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${theme.accentText}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{field.label}</p>
          <p className="mt-0.5 font-medium text-gray-900 break-words">{value || '—'}</p>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <DashboardLayout role={role}>
        <div className="max-w-5xl mx-auto space-y-6 pb-8">
          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 mt-1">{subtitle}</p>
            </div>
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"
                >
                  <Check className="w-4 h-4" /> Profile saved
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className={`relative h-36 sm:h-40 bg-gradient-to-r ${theme.gradient}`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-14 sm:-mt-16">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.name)}`}
                    alt={form.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl bg-white object-cover"
                  />
                  <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white" title="Active" />
                </div>

                <div className="flex-1 min-w-0 pt-1 lg:pt-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{form.name}</h2>
                  <p className={`inline-flex items-center gap-1.5 mt-1 text-sm font-semibold ${theme.accentText}`}>
                    <RoleIcon className="w-4 h-4" />
                    {roleLabel}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5 truncate">
                    <span className="text-gray-400">ID</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{user?.id ?? '—'}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:pb-1">
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-sm transition-colors"
                      >
                        <Check className="w-4 h-4" /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${accentBtn}`}
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className={`w-9 h-9 rounded-lg ${theme.accentLight} flex items-center justify-center shrink-0`}>
                        <StatIcon className={`w-4 h-4 ${theme.accentText}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Sections */}
          {sections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (index + 1) }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className={`w-10 h-10 rounded-xl ${theme.accentLight} flex items-center justify-center`}>
                    <SectionIcon className={`w-5 h-5 ${theme.accentText}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">{section.fields.map(renderField)}</div>
              </motion.div>
            );
          })}

          {/* Qualification tags (doctor) */}
          {tags && tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${theme.accentLight} ${theme.accentText} border border-current/10`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default RoleProfilePage;
