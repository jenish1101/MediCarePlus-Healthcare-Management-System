'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Mail, MapPin, Building2, Star, Plus, Package, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
  products: number;
  rating: number;
  status: 'active' | 'inactive';
}

const initialSuppliers: Supplier[] = [
  { id: 's1', name: 'PharmaCorp', contact: 'Daniel Reed', phone: '+1 555-2001', email: 'sales@pharmacorp.com', location: 'New Jersey, NJ', products: 124, rating: 4.7, status: 'active' },
  { id: 's2', name: 'MedSupply Inc', contact: 'Karen Liu', phone: '+1 555-2002', email: 'orders@medsupply.com', location: 'Boston, MA', products: 98, rating: 4.5, status: 'active' },
  { id: 's3', name: 'HealthPlus', contact: 'Tom Becker', phone: '+1 555-2003', email: 'info@healthplus.com', location: 'Chicago, IL', products: 76, rating: 4.8, status: 'active' },
  { id: 's4', name: 'BioMed Distributors', contact: 'Sara Khan', phone: '+1 555-2004', email: 'contact@biomed.com', location: 'Austin, TX', products: 54, rating: 4.2, status: 'inactive' }
];

const emptyForm = {
  name: '',
  contact: '',
  phone: '',
  email: '',
  location: '',
  status: 'active' as Supplier['status']
};

const PharmacySuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;

    setSuppliers((prev) => [
      {
        id: `s${Date.now()}`,
        name: form.name,
        contact: form.contact,
        phone: form.phone || 'N/A',
        email: form.email || 'N/A',
        location: form.location || 'N/A',
        products: 0,
        rating: 0,
        status: form.status
      },
      ...prev
    ]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Suppliers</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{suppliers.length} registered suppliers</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Supplier
            </button>
          </motion.div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{s.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{s.contact}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium shrink-0 ${s.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" /><span className="truncate">{s.phone}</span></p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 shrink-0" /><span className="truncate">{s.email}</span></p>
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-400 shrink-0" /><span className="truncate">{s.location}</span></p>
                </div>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {s.products} products
                  </span>
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" /> {s.rating || '—'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6 sm:p-8 text-center">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No suppliers found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Try a different search term.</p>
            </div>
          )}
        </div>

        {/* Add Supplier Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Add Supplier</h3>
                  <button onClick={closeModal} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" aria-label="Close">
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Supplier Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="e.g. PharmaCorp"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Contact Person</label>
                    <input
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      required
                      placeholder="e.g. Daniel Reed"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555-0000"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="sales@company.com"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="City, State"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Supplier['status'] })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Add Supplier
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

export default PharmacySuppliers;
