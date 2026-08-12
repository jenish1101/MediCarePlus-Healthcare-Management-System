'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'follow-up': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const DoctorPatients: React.FC = () => {
  const router = useRouter();
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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Patients</h1>
              <p className="text-gray-600 dark:text-gray-400">{patients.length} patients under your care</p>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or condition..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                      alt={p.name}
                      className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{p.age} yrs · {p.gender}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium capitalize shrink-0 ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /><span className="truncate">{p.condition}</span></p>
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />Last visit: {p.lastVisit}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />{p.phone}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />{p.email}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => router.push(`/doctor/patients/${p.id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Records
                  </button>
                  <button
                    onClick={() => router.push('/doctor/prescriptions')}
                    className="flex-1 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                  >
                    New Rx
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No patients found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorPatients;
