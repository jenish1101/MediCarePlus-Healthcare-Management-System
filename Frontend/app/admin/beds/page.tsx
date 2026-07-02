'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed as BedIcon } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockBeds } from '@/data/mockData';
import { Bed } from '@/types';

const statusStyle: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  available: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500', label: 'Available' },
  occupied: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Occupied' },
  maintenance: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Maintenance' }
};

const AdminBeds: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const cycleStatus = (id: string) => {
    const order: Bed['status'][] = ['available', 'occupied', 'maintenance'];
    setBeds((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: order[(order.indexOf(b.status) + 1) % order.length] } : b
      )
    );
  };

  const types = ['all', 'ICU', 'Private', 'General'];
  const filtered = typeFilter === 'all' ? beds : beds.filter((b) => b.type === typeFilter);

  const summary = [
    { label: 'Total Beds', value: beds.length, color: 'blue' },
    { label: 'Available', value: beds.filter((b) => b.status === 'available').length, color: 'green' },
    { label: 'Occupied', value: beds.filter((b) => b.status === 'occupied').length, color: 'red' },
    { label: 'Maintenance', value: beds.filter((b) => b.status === 'maintenance').length, color: 'yellow' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bed Management</h1>
            <p className="text-gray-600">Monitor and update bed availability. Click a bed to change its status.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {summary.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <p className={`text-xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className="text-gray-600 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filtered.map((bed, i) => {
              const style = statusStyle[bed.status];
              return (
                <motion.button
                  key={bed.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => cycleStatus(bed.id)}
                  className={`text-left border-2 rounded-xl p-5 transition-colors ${style.bg} hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <BedIcon className={`w-6 h-6 ${style.text}`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  </div>
                  <p className="font-bold text-gray-900">Room {bed.roomNumber}</p>
                  <p className="text-xs text-gray-500 mb-2">{bed.type}</p>
                  <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminBeds;
