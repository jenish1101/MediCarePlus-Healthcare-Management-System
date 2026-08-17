'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bed as BedIcon, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listBeds, updateBed, mapBed } from '@/api/beds';
import { Bed } from '@/types';
import { colorClasses, ThemeColor } from '@/lib/colorClasses';

const statusStyle: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  available: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500', label: 'Available' },
  occupied: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', label: 'Occupied' },
  maintenance: { bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', label: 'Maintenance' }
};

const AdminBeds: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBeds = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listBeds();
      setBeds(data.map(mapBed));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load beds.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBeds();
  }, [loadBeds]);

  const cycleStatus = async (id: string) => {
    const order: Bed['status'][] = ['available', 'occupied', 'maintenance'];
    const current = beds.find((b) => b.id === id);
    if (!current) return;
    const nextStatus = order[(order.indexOf(current.status) + 1) % order.length];
    setUpdatingId(id);
    try {
      const updated = await updateBed(id, { status: nextStatus });
      const mapped = mapBed(updated);
      setBeds((prev) => prev.map((b) => (b.id === id ? mapped : b)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update bed status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const types = ['all', 'ICU', 'Private', 'General'];
  const filtered = typeFilter === 'all' ? beds : beds.filter((b) => b.type === typeFilter);

  const summary: Array<{ label: string; value: number; color: ThemeColor }> = [
    { label: 'Total Beds', value: beds.length, color: 'blue' },
    { label: 'Available', value: beds.filter((b) => b.status === 'available').length, color: 'green' },
    { label: 'Occupied', value: beds.filter((b) => b.status === 'occupied').length, color: 'red' },
    { label: 'Maintenance', value: beds.filter((b) => b.status === 'maintenance').length, color: 'yellow' }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout role="admin">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Bed Management</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Monitor and update bed availability. Tap a bed to change its status.</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {summary.map((s, i) => {
              const colors = colorClasses[s.color];
              return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center min-w-0"
              >
                <p className={`text-xl sm:text-2xl font-bold ${colors.text600}`}>{s.value}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">{s.label}</p>
              </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading beds...
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filtered.map((bed, i) => {
              const style = statusStyle[bed.status];
              return (
                <motion.button
                  key={bed.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => cycleStatus(bed.id)}
                  disabled={updatingId === bed.id}
                  className={`text-left border-2 rounded-xl p-5 transition-colors ${style.bg} hover:shadow-md disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <BedIcon className={`w-6 h-6 ${style.text}`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">Room {bed.roomNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{bed.type}</p>
                  <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                </motion.button>
              );
            })}
          </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default AdminBeds;
