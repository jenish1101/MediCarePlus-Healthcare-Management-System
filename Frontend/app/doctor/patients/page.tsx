'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, Calendar, FileText, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  condition: string;
  lastVisit: string;
  status: 'active' | 'follow-up' | 'new';
}

const patients: PatientRecord[] = [
  { id: 'p1', name: 'John Patient', age: 34, gender: 'Male', phone: '+1 555-0101', email: 'john@demo.com', condition: 'Hypertension', lastVisit: '2024-02-12', status: 'active' },
  { id: 'p2', name: 'Emma Thompson', age: 28, gender: 'Female', phone: '+1 555-0102', email: 'emma@demo.com', condition: 'Arrhythmia', lastVisit: '2024-02-08', status: 'follow-up' },
  { id: 'p3', name: 'Michael Brown', age: 45, gender: 'Male', phone: '+1 555-0103', email: 'michael@demo.com', condition: 'Coronary check', lastVisit: '2024-02-14', status: 'new' },
  { id: 'p4', name: 'Sophia Davis', age: 52, gender: 'Female', phone: '+1 555-0104', email: 'sophia@demo.com', condition: 'High cholesterol', lastVisit: '2024-01-30', status: 'follow-up' },
  { id: 'p5', name: 'James Wilson', age: 61, gender: 'Male', phone: '+1 555-0105', email: 'james@demo.com', condition: 'Post bypass', lastVisit: '2024-02-12', status: 'active' },
  { id: 'p6', name: 'Olivia Martin', age: 39, gender: 'Female', phone: '+1 555-0106', email: 'olivia@demo.com', condition: 'Palpitations', lastVisit: '2024-02-10', status: 'active' }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    'follow-up': 'bg-yellow-100 text-yellow-700',
    new: 'bg-blue-100 text-blue-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const DoctorPatients: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
  );

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
              <h1 className="text-3xl font-bold text-gray-900 mb-1">My Patients</h1>
              <p className="text-gray-600">{patients.length} patients under your care</p>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or condition..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                      alt={p.name}
                      className="w-14 h-14 rounded-full bg-gray-100"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{p.name}</h4>
                      <p className="text-sm text-gray-500">{p.age} yrs · {p.gender}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" />{p.condition}</p>
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600" />Last visit: {p.lastVisit}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" />{p.phone}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-orange-600" />{p.email}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Records
                  </button>
                  <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    New Rx
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorPatients;
