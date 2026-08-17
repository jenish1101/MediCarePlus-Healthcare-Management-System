'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Plus, X, Users, Send, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listAnnouncements, createAnnouncement, archiveAnnouncement, mapAnnouncement, Announcement } from '@/api/announcements';

const roleOptions = ['all', 'patient', 'doctor', 'pharmacist', 'lab_tech', 'nurse', 'receptionist', 'supplier'];

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', targetRoles: ['all'] as string[] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listAnnouncements();
      setAnnouncements(data.map(mapAnnouncement));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load announcements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const toggleRole = (role: string) => {
    setForm((prev) => {
      if (role === 'all') return { ...prev, targetRoles: ['all'] };
      const withoutAll = prev.targetRoles.filter((r) => r !== 'all');
      const next = withoutAll.includes(role)
        ? withoutAll.filter((r) => r !== role)
        : [...withoutAll, role];
      return { ...prev, targetRoles: next.length ? next : ['all'] };
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setSaving(true);
    setError('');
    try {
      const created = await createAnnouncement({
        title: form.title,
        message: form.message,
        target_roles: form.targetRoles
      });
      setAnnouncements((prev) => [mapAnnouncement(created), ...prev]);
      setForm({ title: '', message: '', targetRoles: ['all'] });
      setShowModal(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    setArchivingId(id);
    try {
      const updated = await archiveAnnouncement(id);
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? mapAnnouncement(updated) : a)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not archive announcement.');
    } finally {
      setArchivingId(null);
    }
  };

  const active = announcements.filter((a) => a.status === 'active');

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Announcements</h1>
              <p className="text-gray-600 dark:text-gray-400">Broadcast messages to hospital roles</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" /> New Announcement
            </button>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{active.length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-6">
              <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{announcements.length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading announcements...
            </div>
          ) : (
          <div className="space-y-6">
            {announcements.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white dark:bg-gray-800 border rounded-xl p-4 shadow-sm dark:shadow-none ${ann.status === 'archived' ? 'border-gray-200 dark:border-gray-700 opacity-75' : 'border-blue-200 dark:border-blue-800'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${ann.status === 'active' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <Megaphone className={`w-6 h-6 ${ann.status === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{ann.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ann.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                          {ann.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{ann.message}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {ann.targetRoles.map((r) => (
                          <span key={r} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full capitalize">
                            {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Posted: {ann.createdAt}</p>
                    </div>
                  </div>
                  {ann.status === 'active' && (
                    <button
                      onClick={() => archive(ann.id)}
                      disabled={archivingId === ann.id}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm shrink-0 disabled:opacity-50"
                    >
                      {archivingId === ann.id ? 'Archiving...' : 'Archive'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">New Announcement</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Target Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {roleOptions.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => toggleRole(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                            form.targetRoles.includes(r)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {r === 'all' ? 'All' : r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      <Send className="w-4 h-4" /> {saving ? 'Broadcasting...' : 'Broadcast'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAnnouncements;
