'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users, Trash2, Pencil, Shield, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'lab_tech' | 'admin';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joined: string;
}

const initialUsers: SystemUser[] = [
  { id: 'u1', name: 'John Patient', email: 'john@demo.com', role: 'patient', status: 'active', joined: '2023-11-02' },
  { id: 'u2', name: 'Dr. Sarah Wilson', email: 'sarah.wilson@hospital.com', role: 'doctor', status: 'active', joined: '2022-06-15' },
  { id: 'u3', name: 'Dr. Michael Chen', email: 'michael.chen@hospital.com', role: 'doctor', status: 'active', joined: '2022-09-20' },
  { id: 'u4', name: 'Lisa Pharmacist', email: 'lisa@hospital.com', role: 'pharmacist', status: 'active', joined: '2023-01-10' },
  { id: 'u5', name: 'Mark Lab Tech', email: 'mark@hospital.com', role: 'lab_tech', status: 'inactive', joined: '2023-03-05' },
  { id: 'u6', name: 'Admin User', email: 'admin@demo.com', role: 'admin', status: 'active', joined: '2021-12-01' },
  { id: 'u7', name: 'Emma Thompson', email: 'emma@demo.com', role: 'patient', status: 'active', joined: '2024-01-18' }
];

const roleColor = (role: string) => {
  const colors: Record<string, string> = {
    patient: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    doctor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pharmacist: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    lab_tech: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  };
  return colors[role] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const emptyForm = { name: '', email: '', role: 'patient' as UserRole, status: 'active' as 'active' | 'inactive' };

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const roles: UserRole[] = ['patient', 'doctor', 'pharmacist', 'lab_tech', 'admin'];
  const roleFilters = ['all', ...roles];

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (user: SystemUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId ? { ...u, name: form.name, email: form.email, role: form.role, status: form.status } : u
        )
      );
    } else {
      setUsers((prev) => [
        {
          id: `u${Date.now()}`,
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          joined: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const removeUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400">{users.length} users in the system</p>
            </div>
            <button
              onClick={openCreate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <UserPlus className="w-5 h-5" /> Add User
            </button>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {roleFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    roleFilter === r ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {r === 'all' ? 'All' : r.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            {/* Mobile user cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((u) => (
                <div key={u.id} className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{u.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{u.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize shrink-0 ${roleColor(u.role)}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pl-12">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      {u.status}
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(u.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">User</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Joined</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((u) => (
                    <tr key={u.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                            alt={u.name}
                            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{u.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          {u.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{u.joined}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => toggleStatus(u.id)} className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400" title="Toggle status">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(u.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No users found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try a different search or filter.</p>
              </div>
            )}
          </motion.div>
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
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{editingId ? 'Edit User' : 'Add User'}</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                      {editingId ? 'Save Changes' : 'Create User'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete user?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone in the demo.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button onClick={() => removeUser(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminUsers;
