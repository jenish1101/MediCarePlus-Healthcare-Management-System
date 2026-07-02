'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed as BedIcon, UserPlus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockBeds } from '@/data/mockData';
import { Bed } from '@/types';

const statusStyle: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  available: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500', label: 'Available' },
  occupied: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Occupied' },
  maintenance: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Maintenance' }
};

const patientNames = ['John Patient', 'Maria Garcia', 'James Lee', '', 'Anna Patel', '', 'Robert Kim', ''];

const ReceptionRooms: React.FC = () => {
  const [beds, setBeds] = useState<(Bed & { patientName?: string })[]>(
    mockBeds.map((b, i) => ({
      ...b,
      patientName: b.status === 'occupied' ? patientNames[i] || 'Assigned Patient' : undefined
    }))
  );
  const [assignId, setAssignId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');

  const summary = [
    { label: 'Total Rooms', value: beds.length, color: 'blue' },
    { label: 'Available', value: beds.filter((b) => b.status === 'available').length, color: 'green' },
    { label: 'Occupied', value: beds.filter((b) => b.status === 'occupied').length, color: 'red' }
  ];

  const assignPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignId || !patientName.trim()) return;
    setBeds((prev) =>
      prev.map((b) =>
        b.id === assignId ? { ...b, status: 'occupied' as const, patientName: patientName.trim() } : b
      )
    );
    setAssignId(null);
    setPatientName('');
  };

  const releaseRoom = (id: string) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'available' as const, patientName: undefined } : b))
    );
  };

  return (
    <ProtectedRoute allowedRoles={['receptionist']}>
      <DashboardLayout role="receptionist">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Room Assignment</h1>
            <p className="text-gray-600">Assign beds and rooms to admitted patients</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 sm:gap-6">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {beds.map((bed, i) => {
              const style = statusStyle[bed.status];
              return (
                <motion.div
                  key={bed.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-2 rounded-xl p-5 ${style.bg}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <BedIcon className={`w-6 h-6 ${style.text}`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  </div>
                  <p className="font-bold text-gray-900">Room {bed.roomNumber}</p>
                  <p className="text-xs text-gray-500 mb-1">{bed.type}</p>
                  <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                  {bed.patientName && (
                    <p className="text-sm text-gray-700 mt-2 font-medium">{bed.patientName}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    {bed.status === 'available' && (
                      <button
                        onClick={() => setAssignId(bed.id)}
                        className="flex-1 text-xs font-medium py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 inline-flex items-center justify-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Assign
                      </button>
                    )}
                    {bed.status === 'occupied' && (
                      <button
                        onClick={() => releaseRoom(bed.id)}
                        className="flex-1 text-xs font-medium py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Release
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {assignId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Assign Patient to Room</h3>
              <form onSubmit={assignPatient} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setAssignId(null)} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                    Assign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ReceptionRooms;
