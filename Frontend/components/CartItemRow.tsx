'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Pill, Plus, Trash2 } from 'lucide-react';
import { Inventory } from '@/types';
import { getMedicineCategory, categoryAccentClass } from '@/components/medicineUtils';

interface CartItemRowProps {
  medicine: Inventory;
  quantity: number;
  lineTotal: number;
  index?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  medicine,
  quantity,
  lineTotal,
  index = 0,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  const category = getMedicineCategory(medicine.medicineName);
  const accent = categoryAccentClass(category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-colors hover:border-gray-300 dark:hover:border-gray-600 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`}>
          <Pill className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">{medicine.medicineName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.supplier}</p>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
            ${medicine.price.toFixed(2)} <span className="text-gray-400 dark:text-gray-500">each</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            onClick={onDecrease}
            className="flex h-9 w-9 items-center justify-center text-gray-600 dark:text-gray-300 transition-colors hover:bg-white dark:hover:bg-gray-700"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-9 min-w-[2.5rem] items-center justify-center border-x border-gray-200 dark:border-gray-700 px-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="flex h-9 w-9 items-center justify-center text-gray-600 dark:text-gray-300 transition-colors hover:bg-white dark:hover:bg-gray-700"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p className="min-w-[4.5rem] text-right text-lg font-bold text-gray-900 dark:text-gray-100">${lineTotal.toFixed(2)}</p>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
          aria-label="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItemRow;
