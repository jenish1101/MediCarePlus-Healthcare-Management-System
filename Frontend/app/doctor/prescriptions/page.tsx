'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Pill, X, Stethoscope } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface DoctorPrescription {
  id: string;
  patientName: string;
  date: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; frequency: string }[];
}

const initialPrescriptions: DoctorPrescription[] = [
  {
    id: 'rx1',
    patientName: 'John Patient',
    date: '2024-02-12',
    diagnosis: 'Hypertension',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily' },
      { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily' }
    ]
  },
  {
    id: 'rx2',
    patientName: 'Emma Thompson',
    date: '2024-02-08',
    diagnosis: 'Arrhythmia',
    medicines: [{ name: 'Metoprolol 25mg', dosage: '1 tablet', frequency: 'Twice daily' }]
  },
  {
    id: 'rx3',
    patientName: 'Sophia Davis',
    date: '2024-01-30',
    diagnosis: 'High cholesterol',
    medicines: [{ name: 'Atorvastatin 10mg', dosage: '1 tablet', frequency: 'At night' }]
  }
];

const DoctorPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', diagnosis: '', medicine: '', dosage: '', frequency: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.diagnosis) return;
    setPrescriptions((prev) => [
      {
        id: `rx${Date.now()}`,
        patientName: form.patientName,
        date: new Date().toISOString().slice(0, 10),
        diagnosis: form.diagnosis,
        medicines: form.medicine
          ? [{ name: form.medicine, dosage: form.dosage || '1 tablet', frequency: form.frequency || 'Once daily' }]
          : []
      },
      ...prev
    ]);
    setForm({ patientName: '', diagnosis: '', medicine: '', dosage: '', frequency: '' });
    setShowModal(false);
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Prescriptions</h1>
              <p className="text-gray-600">Prescriptions you&apos;ve issued to patients</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" /> New Prescription
            </button>
          </motion.div>

          <div className="space-y-6">
            {prescriptions.map((rx, idx) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{rx.patientName}</h4>
                      <p className="text-sm text-gray-500">Date: {rx.date}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Stethoscope className="w-4 h-4 mr-1 text-blue-600" /> {rx.diagnosis}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  {rx.medicines.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">{m.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{m.dosage} · {m.frequency}</span>
                    </div>
                  ))}
                  {rx.medicines.length === 0 && (
                    <p className="text-sm text-gray-400">No medicines added.</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* New Prescription Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold">New Prescription</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                    <input
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      placeholder="e.g. John Patient"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis</label>
                    <input
                      value={form.diagnosis}
                      onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                      placeholder="e.g. Hypertension"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Medicine</label>
                    <input
                      value={form.medicine}
                      onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                      placeholder="e.g. Amlodipine 5mg"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Dosage</label>
                      <input
                        value={form.dosage}
                        onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                        placeholder="1 tablet"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
                      <input
                        value={form.frequency}
                        onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        placeholder="Once daily"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorPrescriptions;
