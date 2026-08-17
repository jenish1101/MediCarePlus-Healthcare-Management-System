'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Stethoscope, Users, X, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DoctorCard from '@/components/DoctorCard';
import { ApiError } from '@/lib/api';
import { listDoctors, mapDoctor } from '@/api/doctors';
import { Doctor } from '@/types';

type SortOption = 'rating' | 'experience' | 'fees-asc' | 'fees-desc';

const FindDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listDoctors();
      setDoctors(data.map(mapDoctor));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load doctors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const specializations = useMemo(
    () => [...new Set(doctors.map((d) => d.specialization))].sort(),
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    let list = doctors.filter((doctor) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialization.toLowerCase().includes(q) ||
        doctor.qualifications.some((qual) => qual.toLowerCase().includes(q));
      const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
      const matchesLocation = !selectedLocation || doctor.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesSearch && matchesSpecialization && matchesLocation;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'fees-asc') return a.fees - b.fees;
      return b.fees - a.fees;
    });

    return list;
  }, [doctors, searchTerm, selectedSpecialization, selectedLocation, sortBy]);

  const hasFilters = searchTerm || selectedSpecialization || selectedLocation;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedLocation('');
  };

  const avgRating = doctors.length
    ? (doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1)
    : '0.0';

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6 max-w-6xl mx-auto pb-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Find Doctors</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Search and book appointments with top specialists</p>
          </motion.div>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'Specialists', value: String(doctors.length), icon: Stethoscope },
              { label: 'Specializations', value: String(specializations.length), icon: Users },
              { label: 'Avg. Rating', value: avgRating, icon: Search },
              { label: 'Showing', value: String(filteredDoctors.length), icon: MapPin }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700 p-5 sm:p-6 space-y-4"
          >
            <div className="grid lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, specialization, qualification..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="City or state..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                />
              </div>
            </div>

            {/* Quick specialization chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSpecialization('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !selectedSpecialization
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {specializations.slice(0, 6).map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec === selectedSpecialization ? '' : spec)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialization === spec
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Sort + clear */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Top rated</option>
                  <option value="experience">Most experienced</option>
                  <option value="fees-asc">Fee: low to high</option>
                  <option value="fees-desc">Fee: high to low</option>
                </select>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Doctor grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading doctors...
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDoctors.map((doctor: Doctor, i) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700 p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No doctors found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Try a different specialization, location, or search term.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default FindDoctors;
