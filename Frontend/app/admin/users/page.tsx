'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Users, Trash2, Pencil, Shield } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'lab_tech' | 'admin';
  status: 'active' | 'inactive';
  joined: string;
}

const users: SystemUser[] = [
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
    patient: 'bg-blue-100 text-blue-700',
    doctor: 'bg-green-100 text-green-700',
    pharmacist: 'bg-purple-100 text-purple-700',
    lab_tech: 'bg-orange-100 text-orange-700',
    admin: 'bg-red-100 text-red-700'
  };
  return colors[role] || 'bg-gray-100 text-gray-700';
};

const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = users.filter(
    (u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const roles = ['all', 'patient', 'doctor', 'pharmacist', 'lab_tech', 'admin'];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">User Management</h1>
              <p className="text-gray-600">{users.length} users in the system</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              <UserPlus className="w-5 h-5" /> Add User
            </button>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    roleFilter === r ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {r === 'all' ? 'All' : r.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-500">
                  <tr>
                    <th className="py-3 px-4 font-medium">User</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Joined</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="text-sm hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                            alt={u.name}
                            className="w-9 h-9 rounded-full bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.joined}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-purple-50 text-purple-600" title="Permissions">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-50 text-red-600" title="Delete">
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
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try a different search or filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminUsers;
