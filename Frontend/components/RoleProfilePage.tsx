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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone
      });
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditing(false);
  };

  const accentBtn =
    theme.accent === 'blue'
      ? 'border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      : theme.accent === 'purple'
        ? 'border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
        : theme.accent === 'red'
          ? 'border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          : theme.accent === 'green'
            ? 'border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            : theme.accent === 'indigo'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              : theme.accent === 'teal'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20'
                : theme.accent === 'rose'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  : 'border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20';

  const renderField = (field: ProfileFieldConfig) => {
    const Icon = field.icon;
    const value = form[field.key] ?? '';
    const spanClass = field.span === 2 ? 'sm:col-span-2' : '';

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className={spanClass}>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{field.label}</label>
          {editing ? (
            <textarea
              value={value}
              onChange={(e) => update(field.key, e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none ${theme.ring}`}
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/40 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
              {value}
            </p>
          )}
        </div>
      );
    }

    if (editing && !field.readOnly) {
      return (
        <div key={field.key} className={spanClass}>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{field.label}</label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              value={value}
              onChange={(e) => update(field.key, e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${theme.ring}`}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        key={field.key}
        className={`flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-colors ${spanClass}`}
      >
        <div className={`w-10 h-10 rounded-xl ${theme.accentLight} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${theme.accentText}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{field.label}</p>
          <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100 break-words">{value || '—'}</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800"
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
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
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl bg-white object-cover"
                  />
                  <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" title="Active" />
                </div>

                <div className="flex-1 min-w-0 pt-1 lg:pt-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{form.name}</h2>
                  <p className={`inline-flex items-center gap-1.5 mt-1 text-sm font-semibold ${theme.accentText}`}>
                    <RoleIcon className="w-4 h-4" />
                    {roleLabel}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5 truncate">
                    <span className="text-gray-400 dark:text-gray-500">ID</span>
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{user?.id ?? '—'}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 lg:pb-1">
                  {saveError && <p className="text-xs text-red-600 dark:text-red-400">{saveError}</p>}
                  <div className="flex flex-wrap gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
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
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700"
                    >
                      <div className={`w-9 h-9 rounded-lg ${theme.accentLight} flex items-center justify-center shrink-0`}>
                        <StatIcon className={`w-4 h-4 ${theme.accentText}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{stat.value}</p>
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className={`w-10 h-10 rounded-xl ${theme.accentLight} flex items-center justify-center`}>
                    <SectionIcon className={`w-5 h-5 ${theme.accentText}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.title}</h3>
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Qualifications</h3>
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
