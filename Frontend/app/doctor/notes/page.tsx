'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, Calendar, User, Stethoscope } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface MedicalNote {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  title: string;
  content: string;
  createdAt: string;
}

const initialNotes: MedicalNote[] = [
  {
    id: 'n1',
    patientName: 'John Patient',
    appointmentDate: '2024-02-12',
    appointmentTime: '10:00 AM',
    reason: 'Regular checkup',
    title: 'Hypertension follow-up',
    content: 'BP well controlled on current medication. Patient compliant. Continue Amlodipine 5mg daily.',
    createdAt: '2024-02-12'
  },
  {
    id: 'n2',
    patientName: 'Emma Thompson',
    appointmentDate: '2024-02-08',
    appointmentTime: '11:30 AM',
    reason: 'Follow-up consultation',
    title: 'Arrhythmia review',
    content: 'Holter results show occasional PVCs. Symptoms improved on Metoprolol. No medication change.',
    createdAt: '2024-02-08'
  },
  {
    id: 'n3',
    patientName: 'Michael Brown',
    appointmentDate: '2024-02-14',
    appointmentTime: '02:00 PM',
    reason: 'Chest pain evaluation',
    title: 'Chest pain workup',
    content: 'Atypical chest pain, non-exertional. ECG normal. Stress test ordered. Advised ER if worsening.',
    createdAt: '2024-02-14'
  },
  {
    id: 'n4',
    patientName: 'Sophia Davis',
    appointmentDate: '2024-01-30',
    appointmentTime: '09:00 AM',
    reason: 'Blood pressure review',
    title: 'Lipid management',
    content: 'LDL elevated at 145. Started Atorvastatin 10mg. Dietary counseling provided.',
    createdAt: '2024-01-30'
  }
];

const DoctorNotes: React.FC = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    title: '',
    content: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.title || !form.content) return;
    setNotes((prev) => [
      {
        id: `n${Date.now()}`,
        patientName: form.patientName,
        appointmentDate: form.appointmentDate || new Date().toISOString().slice(0, 10),
        appointmentTime: form.appointmentTime || '—',
        reason: form.reason || 'General consultation',
        title: form.title,
        content: form.content,
        createdAt: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);
    setForm({ patientName: '', appointmentDate: '', appointmentTime: '', reason: '', title: '', content: '' });
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Medical Notes</h1>
              <p className="text-gray-600 dark:text-gray-400">EMR notes linked to patient appointments</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" /> Add Note
            </button>
          </motion.div>

          <div className="space-y-6">
            {notes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{note.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <User className="w-4 h-4" /> {note.patientName}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Created {note.createdAt}</span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    {note.appointmentDate} at {note.appointmentTime}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {note.reason}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">{note.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

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
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Medical Note</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Patient Name</label>
                    <input
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      placeholder="e.g. John Patient"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Appointment Date</label>
                      <input
                        type="date"
                        value={form.appointmentDate}
                        onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Time</label>
                      <input
                        value={form.appointmentTime}
                        onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                        placeholder="10:00 AM"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Appointment Reason</label>
                    <input
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="e.g. Regular checkup"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Note Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Hypertension follow-up"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Clinical Notes</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="Enter clinical observations, diagnosis, and plan..."
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      Save Note
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

export default DoctorNotes;
