'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, DollarSign, Clock, TestTube } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CatalogTest {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaround: string;
  sampleType: string;
  status: 'available' | 'limited';
}

const catalogTests: CatalogTest[] = [
  { id: 't1', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 45, turnaround: '4 hrs', sampleType: 'Blood', status: 'available' },
  { id: 't2', name: 'Lipid Profile', category: 'Biochemistry', price: 65, turnaround: '6 hrs', sampleType: 'Blood', status: 'available' },
  { id: 't3', name: 'Liver Function Test', category: 'Biochemistry', price: 55, turnaround: '6 hrs', sampleType: 'Blood', status: 'available' },
  { id: 't4', name: 'Thyroid Panel (T3, T4, TSH)', category: 'Endocrinology', price: 80, turnaround: '24 hrs', sampleType: 'Blood', status: 'available' },
  { id: 't5', name: 'Blood Glucose (Fasting)', category: 'Biochemistry', price: 25, turnaround: '2 hrs', sampleType: 'Blood', status: 'available' },
  { id: 't6', name: 'Urinalysis', category: 'Clinical Pathology', price: 30, turnaround: '3 hrs', sampleType: 'Urine', status: 'available' },
  { id: 't7', name: 'HbA1c', category: 'Diabetes', price: 50, turnaround: '24 hrs', sampleType: 'Blood', status: 'limited' },
  { id: 't8', name: 'Vitamin D', category: 'Biochemistry', price: 95, turnaround: '48 hrs', sampleType: 'Blood', status: 'available' }
];

const LabCatalog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(catalogTests.map((t) => t.category)))];
  const filtered = catalogTests.filter(
    (t) =>
      (category === 'all' || t.category === category) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['lab_tech']}>
      <DashboardLayout role="lab_tech">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Test Catalog</h1>
            <p className="text-gray-600 dark:text-gray-400">Available tests and pricing</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center">
              <p className="text-lg font-bold text-purple-600">{catalogTests.length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tests</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center">
              <p className="text-lg font-bold text-green-600">{categories.length - 1}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Categories</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-none dark:border dark:border-gray-700 text-center">
              <p className="text-lg font-bold text-blue-600">${Math.round(catalogTests.reduce((s, t) => s + t.price, 0) / catalogTests.length)}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg. Price</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === c ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm dark:shadow-none dark:border dark:border-gray-700'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((test, i) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <TestTube className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{test.name}</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">{test.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sample: {test.sampleType}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${test.status === 'available' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                    {test.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" /> {test.turnaround}
                  </span>
                  <span className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    {test.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No tests found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try a different search or category.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default LabCatalog;
