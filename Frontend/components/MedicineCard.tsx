'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Package, Pill, Plus } from 'lucide-react';
import { Inventory } from '@/types';
import { getMedicineCategory, type MedicineCategory } from '@/components/medicineUtils';

const categoryStyles: Record<MedicineCategory, { label: string; chip: string; icon: string; accent: string }> = {
  all: { label: 'All', chip: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300', icon: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300', accent: 'from-gray-400 to-gray-500' },
  pain: { label: 'Pain Relief', chip: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', icon: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', accent: 'from-blue-500 to-indigo-500' },
  antibiotic: { label: 'Antibiotics', chip: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400', accent: 'from-amber-500 to-orange-500' },
  vitamin: { label: 'Vitamins', chip: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', accent: 'from-emerald-500 to-green-500' },
  other: { label: 'General', chip: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', icon: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', accent: 'from-purple-500 to-violet-500' }
};

function stockInfo(quantity: number) {
  if (quantity < 200) return { label: 'Low stock', className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' };
  if (quantity < 500) return { label: 'Limited', className: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' };
  return { label: 'In stock', className: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' };
}

interface MedicineCardProps {
  medicine: Inventory;
  quantity: number;
  index?: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  quantity,
  index = 0,
  onAdd,
  onIncrease,
  onDecrease
}) => {
  const category = getMedicineCategory(medicine.medicineName);
  const cat = categoryStyles[category];
  const stock = stockInfo(medicine.quantity);
  const inCart = quantity > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
    >
      <div className={`h-1 bg-gradient-to-r ${cat.accent}`} />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cat.icon}`}>
              <Pill className="h-5 w-5" />
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.chip}`}>{cat.label}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stock.className}`}>{stock.label}</span>
        </div>

        <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-gray-100">{medicine.medicineName}</h3>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
          <p className="col-span-2 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{medicine.supplier}</span>
          </p>
          <p>
            <span className="text-gray-400 dark:text-gray-500">Batch</span>{' '}
            <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{medicine.batchNumber}</span>
          </p>
          <p>
            <span className="text-gray-400 dark:text-gray-500">Expires</span>{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{medicine.expiryDate}</span>
          </p>
          <p className="col-span-2">
            <span className="text-gray-400 dark:text-gray-500">Available</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{medicine.quantity.toLocaleString()} units</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${medicine.price.toFixed(2)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">per unit</p>
          </div>

          {inCart ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 px-2 text-sm font-bold text-blue-700 dark:text-blue-400">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          )}
        </div>

        {inCart && (
          <p className="mt-2 flex items-center justify-end gap-1 text-xs font-medium text-green-600 dark:text-green-400">
            <Check className="h-3.5 w-3.5" />
            ${(medicine.price * quantity).toFixed(2)} in cart
          </p>
        )}
      </div>
    </motion.article>
  );
};

export default MedicineCard;
