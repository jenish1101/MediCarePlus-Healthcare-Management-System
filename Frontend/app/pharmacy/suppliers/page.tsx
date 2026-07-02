'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MapPin, Building2, Star, Plus, Package } from 'lucide-react';
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

const suppliers: Supplier[] = [
  { id: 's1', name: 'PharmaCorp', contact: 'Daniel Reed', phone: '+1 555-2001', email: 'sales@pharmacorp.com', location: 'New Jersey, NJ', products: 124, rating: 4.7, status: 'active' },
  { id: 's2', name: 'MedSupply Inc', contact: 'Karen Liu', phone: '+1 555-2002', email: 'orders@medsupply.com', location: 'Boston, MA', products: 98, rating: 4.5, status: 'active' },
  { id: 's3', name: 'HealthPlus', contact: 'Tom Becker', phone: '+1 555-2003', email: 'info@healthplus.com', location: 'Chicago, IL', products: 76, rating: 4.8, status: 'active' },
  { id: 's4', name: 'BioMed Distributors', contact: 'Sara Khan', phone: '+1 555-2004', email: 'contact@biomed.com', location: 'Austin, TX', products: 54, rating: 4.2, status: 'inactive' }
];

const PharmacySuppliers: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['pharmacist']}>
      <DashboardLayout role="pharmacist">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Suppliers</h1>
              <p className="text-gray-600">{suppliers.length} registered suppliers</p>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              <Plus className="w-5 h-5" /> Add Supplier
            </button>
          </motion.div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{s.name}</h4>
                      <p className="text-sm text-gray-500">{s.contact}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {s.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" />{s.phone}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-purple-600" />{s.email}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />{s.location}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Package className="w-4 h-4" /> {s.products} products
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {s.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-600">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PharmacySuppliers;
