'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unitPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const initialProducts: Product[] = [
  { id: 'p1', name: 'Ibuprofen 400mg', category: 'Pain Relief', sku: 'IBU-400', stock: 2500, unitPrice: 2.5, status: 'in-stock' },
  { id: 'p2', name: 'Amoxicillin 500mg', category: 'Antibiotics', sku: 'AMX-500', stock: 180, unitPrice: 4.2, status: 'low-stock' },
  { id: 'p3', name: 'Paracetamol 500mg', category: 'Pain Relief', sku: 'PAR-500', stock: 4200, unitPrice: 1.8, status: 'in-stock' },
  { id: 'p4', name: 'Insulin Pens', category: 'Diabetes', sku: 'INS-PEN', stock: 0, unitPrice: 62, status: 'out-of-stock' },
  { id: 'p5', name: 'Vitamin B Complex', category: 'Supplements', sku: 'VIT-B', stock: 890, unitPrice: 3.1, status: 'in-stock' },
  { id: 'p6', name: 'Surgical Gloves (box)', category: 'Supplies', sku: 'GLV-100', stock: 320, unitPrice: 12, status: 'in-stock' }
];

const statusStyle: Record<Product['status'], string> = {
  'in-stock': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'low-stock': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  'out-of-stock': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
};

const SupplierProducts: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <DashboardLayout role="supplier">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Product Catalog</h1>
              <p className="text-gray-600 dark:text-gray-400">Stock offered to hospital pharmacy partners</p>
            </motion.div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === c ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                  }`}
                >
                  {c === 'all' ? 'All Categories' : c}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">SKU</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Stock</th>
                    <th className="py-3 px-4 font-medium">Unit Price</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.sku}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{product.stock.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">${product.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[product.status]}`}>
                          {product.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SupplierProducts;
