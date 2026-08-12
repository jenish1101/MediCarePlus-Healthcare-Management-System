'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill, Search, CheckCircle, Clock, Package } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockPrescriptions } from '@/data/mockData';

interface FulfillmentRx {
  id: string;
  rxId: string;
  patientName: string;
  doctorName: string;
  date: string;
  medicines: string[];
  status: 'pending' | 'dispensing' | 'dispensed';
}

const doctorNames: Record<string, string> = {
  d1: 'Dr. Sarah Wilson',
  d2: 'Dr. Michael Chen',
  d3: 'Dr. Emily Rodriguez'
};

const patientNames: Record<string, string> = {
  p1: 'John Patient',
  p2: 'Emma Thompson'
};

const initialRx: FulfillmentRx[] = [
  {
    id: 'frx1',
    rxId: 'rx1',
    patientName: patientNames.p1,
    doctorName: doctorNames.d2,
    date: '2024-01-28',
    medicines: ['Ibuprofen 400mg', 'Vitamin B Complex'],
    status: 'pending'
  },
  {
    id: 'frx2',
    rxId: 'rx2',
    patientName: 'Emma Thompson',
    doctorName: doctorNames.d1,
    date: '2024-02-14',
    medicines: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
    status: 'pending'
  },
  {
    id: 'frx3',
    rxId: 'rx3',
    patientName: 'Michael Brown',
    doctorName: doctorNames.d3,
    date: '2024-02-13',
    medicines: ['Aspirin 75mg'],
    status: 'dispensing'
  },
  {
    id: 'frx4',
    rxId: 'rx4',
    patientName: 'Sophia Davis',
    doctorName: doctorNames.d1,
    date: '2024-02-10',
    medicines: ['Vitamin B Complex', 'Ibuprofen 400mg'],
    status: 'dispensed'
  }
];

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    dispensing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    dispensed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const nextStatus: Record<string, FulfillmentRx['status']> = {
  pending: 'dispensing',
  dispensing: 'dispensed'
};

const PharmacyPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<FulfillmentRx[]>(initialRx);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const advance = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id !== id) return rx;
        const next = nextStatus[rx.status];
        return next ? { ...rx, status: next } : rx;
      })
    );
  };

  const filtered = prescriptions.filter(
    (rx) =>
      (filter === 'all' || rx.status === filter) &&
      (rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
        rx.rxId.toLowerCase().includes(search.toLowerCase()))
  );

  const pending = prescriptions.filter((r) => r.status === 'pending').length;

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Prescription Fulfillment</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Link doctor prescriptions to dispense orders</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{pending}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Pending</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{prescriptions.filter((r) => r.status === 'dispensing').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Dispensing</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{prescriptions.filter((r) => r.status === 'dispensed').length}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">Dispensed</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['all', 'pending', 'dispensing', 'dispensed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                    filter === f ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prescriptions..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filtered.map((rx, i) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">Rx #{rx.rxId}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(rx.status)}`}>
                          {rx.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Patient: {rx.patientName}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Prescribed by: {rx.doctorName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Date: {rx.date}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                        {rx.medicines.map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-lg">
                            <Pill className="w-3 h-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {rx.status !== 'dispensed' && (
                    <button
                      onClick={() => advance(rx.id)}
                      className="w-full sm:w-auto sm:self-end px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      {rx.status === 'pending' ? 'Start Dispensing' : 'Mark Dispensed'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No prescriptions found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try a different search or filter.</p>
              </div>
            )}
          </div>

          {mockPrescriptions.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Linked to {mockPrescriptions.length} doctor prescription(s) in system
            </p>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacyPrescriptions;
