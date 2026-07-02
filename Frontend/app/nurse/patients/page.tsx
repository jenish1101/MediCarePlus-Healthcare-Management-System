'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface WardPatient {
  id: string;
  name: string;
  room: string;
  ward: string;
  vitals: { time: string; bp: string; pulse: string; temp: string }[];
}

const wardPatients: WardPatient[] = [
  {
    id: 'wp1', name: 'Maria Garcia', room: '204', ward: 'General Ward A',
    vitals: [
      { time: '8:00 AM', bp: '120/80', pulse: '72', temp: '98.6°F' },
      { time: '10:00 AM', bp: '118/78', pulse: '70', temp: '98.4°F' }
    ]
  },
  {
    id: 'wp2', name: 'James Lee', room: '108', ward: 'General Ward A',
    vitals: [
      { time: '7:30 AM', bp: '130/85', pulse: '88', temp: '99.1°F' },
      { time: '9:30 AM', bp: '128/82', pulse: '84', temp: '98.8°F' }
    ]
  },
  {
    id: 'wp3', name: 'Anna Patel', room: '312', ward: 'ICU',
    vitals: [
      { time: '8:15 AM', bp: '115/75', pulse: '68', temp: '98.2°F' }
    ]
  },
  {
    id: 'wp4', name: 'Robert Kim', room: '115', ward: 'General Ward B',
    vitals: [
      { time: '9:00 AM', bp: '122/79', pulse: '74', temp: '98.5°F' }
    ]
  }
];

const NursePatients: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(wardPatients[0]?.id ?? null);
  const [wardFilter, setWardFilter] = useState('all');

  const wards = ['all', ...Array.from(new Set(wardPatients.map((p) => p.ward)))];
  const filtered = wardFilter === 'all' ? wardPatients : wardPatients.filter((p) => p.ward === wardFilter);

  return (
    <ProtectedRoute allowedRoles={['nurse']}>
      <DashboardLayout role="nurse">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Ward Patients</h1>
            <p className="text-gray-600">Ward list and vitals history</p>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {wards.map((w) => (
              <button
                key={w}
                onClick={() => setWardFilter(w)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  wardFilter === w ? 'bg-rose-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {w === 'all' ? 'All Wards' : w}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === patient.id ? null : patient.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">Room {patient.room} · {patient.ward}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{patient.vitals.length} readings</span>
                    {expanded === patient.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                {expanded === patient.id && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 mt-4 mb-3">
                      <HeartPulse className="w-5 h-5 text-rose-600" />
                      <h4 className="font-medium text-gray-900">Vitals History</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-500">
                          <tr>
                            <th className="py-2 pr-4 font-medium">Time</th>
                            <th className="py-2 pr-4 font-medium">Blood Pressure</th>
                            <th className="py-2 pr-4 font-medium">Pulse</th>
                            <th className="py-2 font-medium">Temperature</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {patient.vitals.map((v, j) => (
                            <tr key={j}>
                              <td className="py-2 pr-4 text-gray-900">{v.time}</td>
                              <td className="py-2 pr-4">{v.bp}</td>
                              <td className="py-2 pr-4">{v.pulse} bpm</td>
                              <td className="py-2">{v.temp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button className="mt-4 text-sm font-medium text-rose-600 hover:text-rose-800">+ Add new vitals reading</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default NursePatients;
