'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Download, FileText, Stethoscope, ShoppingCart } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockPrescriptions } from '@/data/mockData';

const PatientPrescriptions: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Prescriptions</h1>
            <p className="text-gray-600 dark:text-gray-400">View and download your prescriptions</p>
          </motion.div>

          {mockPrescriptions.map((prescription, idx) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-none"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">Prescription #{prescription.id}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Date: {prescription.date}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                      <Stethoscope className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                      Diagnosis: {prescription.diagnosis}
                    </p>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Medicines</h5>
                <div className="space-y-3">
                  {prescription.medicines.map((med, i) => (
                    <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-blue-900 dark:text-blue-300">{med.name}</p>
                        <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                        <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                        <p><span className="font-medium">Duration:</span> {med.duration}</p>
                        {med.instructions && (
                          <p className="col-span-2"><span className="font-medium">Instructions:</span> {med.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-medium">Doctor&apos;s Notes:</span> {prescription.notes}</p>
                </div>
              )}

              <button className="mt-4 w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Order These Medicines
              </button>
            </motion.div>
          ))}

          {mockPrescriptions.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No prescriptions yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Your prescriptions will appear here after consultations.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientPrescriptions;
