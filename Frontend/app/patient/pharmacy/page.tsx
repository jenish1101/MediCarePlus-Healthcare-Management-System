'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Pill,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Truck
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import MedicineCard from '@/components/MedicineCard';
import CartItemRow from '@/components/CartItemRow';
import { getMedicineCategory } from '@/components/medicineUtils';
import { mockOrders, mockInventory } from '@/data/mockData';

type Tab = 'browse' | 'orders' | 'cart';
type CategoryFilter = 'all' | 'pain' | 'antibiotic' | 'vitamin';
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

const orderStatusColor: Record<string, string> = {
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  confirmed: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
};

const orderStatusIcon: Record<string, string> = {
  delivered: '✓ Delivered',
  shipped: '↗ Shipped',
  confirmed: '◷ Confirmed',
  pending: '◷ Pending',
  cancelled: '✕ Cancelled'
};

const PatientPharmacy: React.FC = () => {
  const [tab, setTab] = useState<Tab>('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCartToast, setShowCartToast] = useState(false);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const med = mockInventory.find((m) => m.id === id);
      return sum + (med ? med.price * qty : 0);
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const medicine = mockInventory.find((m) => m.id === id);
        if (!medicine) return null;
        return { medicine, quantity: qty, lineTotal: medicine.price * qty };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [cart]);

  const medicines = useMemo(() => {
    let list = mockInventory.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        m.medicineName.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q) ||
        m.batchNumber.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || getMedicineCategory(m.medicineName) === category;
      return matchesSearch && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') return b.quantity - a.quantity;
      return a.medicineName.localeCompare(b.medicineName);
    });

    return list;
  }, [search, category, sortBy]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setShowCartToast(true);
    window.setTimeout(() => setShowCartToast(false), 2000);
  };

  const increaseQty = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  const decreaseQty = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return next;
      if (next[id] <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clearCart = () => setCart({});

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pain', label: 'Pain Relief' },
    { id: 'antibiotic', label: 'Antibiotics' },
    { id: 'vitamin', label: 'Vitamins' }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="mx-auto max-w-6xl space-y-6 pb-24">
          {/* Header + tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">Pharmacy</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Order medicines and track your deliveries</p>
            </div>

            <div className="inline-flex flex-wrap self-end rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-sm sm:self-auto">
              {([
                { id: 'browse' as Tab, label: 'Browse Medicines', badge: 0 },
                { id: 'cart' as Tab, label: 'My Cart', badge: cartCount },
                { id: 'orders' as Tab, label: 'My Orders', badge: 0 }
              ]).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:px-5 sm:py-2.5 ${
                    tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.label}
                  {t.badge > 0 && (
                    <span
                      className={`ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                        tab === t.id ? 'bg-white/25 text-white' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { label: 'Medicines', value: String(mockInventory.length), icon: Pill },
              { label: 'Your Orders', value: String(mockOrders.length), icon: Package },
              { label: 'In Cart', value: String(cartCount), icon: ShoppingCart },
              { label: 'Cart Total', value: `$${cartTotal.toFixed(2)}`, icon: Truck }
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm dark:shadow-none"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {tab === 'browse' && (
            <div className="space-y-5">
              {/* Filters */}
              <div className="space-y-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-none">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, supplier, or batch..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 py-3 pl-11 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:text-gray-100 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        category === c.id
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-medium">{medicines.length} medicine{medicines.length !== 1 ? 's' : ''}</span>
                  </p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  >
                    <option value="name">Name A–Z</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="stock">Most in stock</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {medicines.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {medicines.map((med, i) => (
                    <MedicineCard
                      key={med.id}
                      medicine={med}
                      quantity={cart[med.id] ?? 0}
                      index={i}
                      onAdd={() => addToCart(med.id)}
                      onIncrease={() => increaseQty(med.id)}
                      onDecrease={() => decreaseQty(med.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-sm dark:shadow-none">
                  <Search className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No medicines found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search or category.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'cart' && (
            <div>
              {cartItems.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Cart Items <span className="font-normal text-gray-500 dark:text-gray-400">({cartCount})</span>
                      </h2>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map(({ medicine, quantity, lineTotal }, i) => (
                        <CartItemRow
                          key={medicine.id}
                          medicine={medicine}
                          quantity={quantity}
                          lineTotal={lineTotal}
                          index={i}
                          onIncrease={() => increaseQty(medicine.id)}
                          onDecrease={() => decreaseQty(medicine.id)}
                          onRemove={() => removeFromCart(medicine.id)}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setTab('browse')}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      ← Continue shopping
                    </button>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-none">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Order Summary</h2>

                      <div className="space-y-3 border-b border-gray-100 dark:border-gray-700 pb-4 text-sm">
                        {cartItems.map(({ medicine, quantity, lineTotal }) => (
                          <div key={medicine.id} className="flex justify-between gap-3">
                            <span className="truncate text-gray-600 dark:text-gray-400">
                              {medicine.medicineName}{' '}
                              <span className="text-gray-400 dark:text-gray-500">× {quantity}</span>
                            </span>
                            <span className="shrink-0 font-medium text-gray-900 dark:text-gray-100">${lineTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Subtotal</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Delivery</span>
                          <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${cartTotal.toFixed(2)}</span>
                      </div>

                      <button
                        type="button"
                        className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        Proceed to Checkout
                      </button>

                      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                        Secure checkout · Prescription may be required for some items
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-sm dark:shadow-none">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
                    <ShoppingBag className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your cart is empty</h3>
                  <p className="mx-auto mt-2 max-w-sm text-gray-500 dark:text-gray-400">
                    You haven&apos;t added any medicines yet. Browse our catalog and add items to your cart.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('browse')}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Pill className="h-4 w-4" />
                    Browse Medicines
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {mockOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm dark:shadow-none"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                          <Package className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">Order #{order.id.toUpperCase()}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Placed on {order.date}</p>
                          <p className="mt-1 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Truck className="h-4 w-4 shrink-0" />
                            {order.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            orderStatusColor[order.status] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {orderStatusIcon[order.status] ?? order.status}
                        </span>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${order.total}</p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-5">
                      {order.medicines.map((med, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                              <Pill className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-900 dark:text-gray-100">{med.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {med.quantity} × ${med.price}</p>
                            </div>
                          </div>
                          <p className="shrink-0 font-bold text-gray-900 dark:text-gray-100">${(med.price * med.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {order.status === 'shipped' && (
                      <button
                        type="button"
                        className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        Track Delivery
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Sticky cart bar — quick access while browsing */}
          <AnimatePresence>
            {cartCount > 0 && tab === 'browse' && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-800 p-4 shadow-2xl sm:left-auto sm:right-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setTab('cart')}
                    className="text-left transition-opacity hover:opacity-80"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
                    </p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${cartTotal.toFixed(2)}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Tap to view cart</p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('cart')}
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Added toast */}
          <AnimatePresence>
            {showCartToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
              >
                Added to cart
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientPharmacy;
