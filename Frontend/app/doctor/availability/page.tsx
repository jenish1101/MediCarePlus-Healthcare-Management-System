'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Save } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const DoctorAvailability: React.FC = () => {
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: false,
    Friday: true,
    Saturday: false,
    Sunday: false
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [slots, setSlots] = useState<Record<string, string[]>>({
    Monday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
    Tuesday: ['09:00 AM', '10:00 AM', '03:00 PM'],
    Wednesday: ['10:00 AM', '11:00 AM', '04:00 PM'],
    Friday: ['09:00 AM', '02:00 PM', '03:00 PM']
  });
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) =>
    setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }));

  const toggleSlot = (slot: string) => {
    setSlots((prev) => {
      const current = prev[selectedDay] || [];
      return {
        ...prev,
        [selectedDay]: current.includes(slot)
          ? current.filter((s) => s !== slot)
          : [...current, slot]
      };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Availability</h1>
              <p className="text-gray-600">Set your working days and consultation hours</p>
            </div>
            <button
              onClick={handleSave}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </motion.div>

          {/* Working days */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Working Days</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    activeDays[day]
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
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
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold">Time Slots</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {days.filter((d) => activeDays[d]).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {activeDays[selectedDay] ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot) => {
                  const selected = (slots[selectedDay] || []).includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`py-3 rounded-lg text-sm font-medium border-2 transition-colors flex items-center justify-center gap-1 ${
                        selected
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {selected && <Check className="w-4 h-4" />}
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Enable {selectedDay} in Working Days to set time slots.</p>
            )}
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorAvailability;
