'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, X, Users, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
  beds: number;
  status: 'active' | 'inactive';
}

const initialDepartments: Department[] = [
  { id: 'dept1', name: 'Cardiology', head: 'Dr. Sarah Wilson', staffCount: 24, beds: 30, status: 'active' },
  { id: 'dept2', name: 'Neurology', head: 'Dr. Michael Chen', staffCount: 18, beds: 20, status: 'active' },
  { id: 'dept3', name: 'Pediatrics', head: 'Dr. Emily Rodriguez', staffCount: 22, beds: 25, status: 'active' },
  { id: 'dept4', name: 'Orthopedics', head: 'Dr. James Anderson', staffCount: 20, beds: 22, status: 'active' },
  { id: 'dept5', name: 'Dermatology', head: 'Dr. Priya Sharma', staffCount: 12, beds: 8, status: 'active' },
  { id: 'dept6', name: 'General Medicine', head: 'Dr. Robert Taylor', staffCount: 30, beds: 40, status: 'active' },
  { id: 'dept7', name: 'Radiology', head: 'Dr. Helen Wright', staffCount: 15, beds: 0, status: 'inactive' }
];

const AdminDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', head: '', staffCount: '', beds: '', status: 'active' as 'active' | 'inactive' });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', head: '', staffCount: '', beds: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (dept: Department) => {
    setEditingId(dept.id);
    setForm({
      name: dept.name,
      head: dept.head,
      staffCount: String(dept.staffCount),
      beds: String(dept.beds),
      status: dept.status
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const data = {
      name: form.name,
      head: form.head || 'TBD',
      staffCount: Number(form.staffCount) || 0,
      beds: Number(form.beds) || 0,
      status: form.status
    };
    if (editingId) {
      setDepartments((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...data } : d)));
    } else {
      setDepartments((prev) => [{ id: `dept${Date.now()}`, ...data }, ...prev]);
    }
    setShowModal(false);
  };

  const remove = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  const totalStaff = departments.reduce((s, d) => s + d.staffCount, 0);
  const totalBeds = departments.reduce((s, d) => s + d.beds, 0);

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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Departments</h1>
              <p className="text-gray-600">Manage hospital departments and units</p>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Department
            </button>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6 max-w-2xl">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <p className="text-lg font-bold text-blue-600">{departments.length}</p>
              <p className="text-gray-600 text-sm mt-1">Departments</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <p className="text-lg font-bold text-green-600">{totalStaff}</p>
              <p className="text-gray-600 text-sm mt-1">Total Staff</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <p className="text-lg font-bold text-purple-600">{totalBeds}</p>
              <p className="text-gray-600 text-sm mt-1">Total Beds</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${dept.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {dept.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{dept.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Head: {dept.head}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    {dept.staffCount} staff
                  </span>
                  <span>{dept.beds} beds</span>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => openEdit(dept)}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => remove(dept.id)}
                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
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
                className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold">{editingId ? 'Edit Department' : 'Add Department'}</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Department Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Department Head</label>
                    <input value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Staff Count</label>
                      <input type="number" value={form.staffCount} onChange={(e) => setForm({ ...form, staffCount: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Beds</label>
                      <input type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                      {editingId ? 'Save' : 'Add'}
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

export default AdminDepartments;
