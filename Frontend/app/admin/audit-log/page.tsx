'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Search, User, Settings, Shield, FileText } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AuditEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'user' | 'settings' | 'security' | 'billing';
}

const auditEntries: AuditEntry[] = [
  { id: 'a1', user: 'Admin User', role: 'admin', action: 'Approved doctor registration', target: 'Dr. Anita Kapoor', timestamp: '2024-02-15 09:32', category: 'user' },
  { id: 'a2', user: 'Admin User', role: 'admin', action: 'Updated user role', target: 'Mark Lab Tech → lab_tech', timestamp: '2024-02-15 08:15', category: 'user' },
  { id: 'a3', user: 'Lisa Pharmacist', role: 'pharmacist', action: 'Adjusted inventory quantity', target: 'Amoxicillin 500mg (-50 units)', timestamp: '2024-02-14 16:45', category: 'settings' },
  { id: 'a4', user: 'Admin User', role: 'admin', action: 'Exported billing report', target: 'February 2024 invoices', timestamp: '2024-02-14 14:20', category: 'billing' },
  { id: 'a5', user: 'System', role: 'system', action: 'Failed login attempt blocked', target: 'unknown@email.com', timestamp: '2024-02-14 11:08', category: 'security' },
  { id: 'a6', user: 'Admin User', role: 'admin', action: 'Created announcement', target: 'System maintenance Feb 20', timestamp: '2024-02-13 17:30', category: 'settings' },
  { id: 'a7', user: 'Dr. Sarah Wilson', role: 'doctor', action: 'Updated patient prescription', target: 'John Patient - rx1', timestamp: '2024-02-13 10:22', category: 'user' },
  { id: 'a8', user: 'Admin User', role: 'admin', action: 'Deactivated user account', target: 'Mark Lab Tech', timestamp: '2024-02-12 15:55', category: 'security' }
];

const categoryIcon = (cat: string) => {
  const icons: Record<string, React.ElementType> = {
    user: User,
    settings: Settings,
    security: Shield,
    billing: FileText
  };
  return icons[cat] || ScrollText;
};

const categoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    user: 'bg-blue-100 text-blue-600',
    settings: 'bg-purple-100 text-purple-600',
    security: 'bg-red-100 text-red-600',
    billing: 'bg-green-100 text-green-600'
  };
  return colors[cat] || 'bg-gray-100 text-gray-600';
};

const AdminAuditLog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'user', 'settings', 'security', 'billing'];

  const filtered = auditEntries.filter(
    (e) =>
      (categoryFilter === 'all' || e.category === categoryFilter) &&
      (e.user.toLowerCase().includes(search.toLowerCase()) ||
        e.action.toLowerCase().includes(search.toLowerCase()) ||
        e.target.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Audit Log</h1>
            <p className="text-gray-600">Track who changed what across the system</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    categoryFilter === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit entries..."
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
                    <th className="py-3 px-4 font-medium">Timestamp</th>
                    <th className="py-3 px-4 font-medium">User</th>
                    <th className="py-3 px-4 font-medium">Action</th>
                    <th className="py-3 px-4 font-medium">Target</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((entry) => {
                    const Icon = categoryIcon(entry.category);
                    return (
                      <tr key={entry.id} className="text-sm hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{entry.timestamp}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{entry.user}</p>
                            <p className="text-xs text-gray-500 capitalize">{entry.role.replace('_', ' ')}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{entry.action}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.target}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${categoryColor(entry.category)}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {entry.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <ScrollText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No audit entries found</h3>
                <p className="text-gray-600">Try a different search or category filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminAuditLog;
