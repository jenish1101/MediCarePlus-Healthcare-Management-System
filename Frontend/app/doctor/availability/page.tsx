'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Save, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { getMyAvailability, updateMyAvailability } from '@/api/doctors';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const DoctorAvailability: React.FC = () => {
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({});
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyAvailability();
      const dayMap: Record<string, boolean> = {};
      days.forEach((d) => {
        dayMap[d] = data.availability_days.includes(d);
      });
      setActiveDays(dayMap);
      setSlots(data.availability_slots || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load availability.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const toggleDay = (day: string) =>
    setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }));

  const toggleSlot = (slot: string) => {
    setSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const availability_days = days.filter((d) => activeDays[d]);
      const updated = await updateMyAvailability({
        availability_days,
        availability_slots: slots
      });
      const dayMap: Record<string, boolean> = {};
      days.forEach((d) => {
        dayMap[d] = updated.availability_days.includes(d);
      });
      setActiveDays(dayMap);
      setSlots(updated.availability_slots || []);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save availability.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Availability</h1>
              <p className="text-gray-600 dark:text-gray-400">Set your working days and consultation hours</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base disabled:opacity-50 ${
                saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading availability...
            </div>
          ) : (
          <>
          {/* Working days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Working Days</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    activeDays[day]
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-gray-900/40 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time slots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Consultation Hours</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              These hours apply across all your working days.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {timeSlots.map((slot) => {
                const selected = slots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(slot)}
                    className={`py-3 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-1 ${
                      selected
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                        : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {selected && <Check className="w-4 h-4" />}
                    {slot}
                  </button>
                );
              })}
            </div>
          </motion.div>
          </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorAvailability;
