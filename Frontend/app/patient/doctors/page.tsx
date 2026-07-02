'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Stethoscope, Users, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DoctorCard from '@/components/DoctorCard';
import { mockDoctors, specializations } from '@/data/mockData';
import { Doctor } from '@/types';

type SortOption = 'rating' | 'experience' | 'fees-asc' | 'fees-desc';

const FindDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const filteredDoctors = useMemo(() => {
    let list = mockDoctors.filter((doctor) => {
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
  }, [searchTerm, selectedSpecialization, selectedLocation, sortBy]);

  const hasFilters = searchTerm || selectedSpecialization || selectedLocation;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedLocation('');
  };

  const avgRating = (mockDoctors.reduce((s, d) => s + d.rating, 0) / mockDoctors.length).toFixed(1);

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6 max-w-6xl mx-auto pb-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Find Doctors</h1>
            <p className="text-gray-500 mt-1">Search and book appointments with top specialists</p>
          </motion.div>

          {/* Summary strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { label: 'Specialists', value: String(mockDoctors.length), icon: Stethoscope },
              { label: 'Specializations', value: String(specializations.length), icon: Users },
              { label: 'Avg. Rating', value: avgRating, icon: Search },
              { label: 'Showing', value: String(filteredDoctors.length), icon: MapPin }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 space-y-4"
          >
            <div className="grid lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, specialization, qualification..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50"
                />
              </div>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-700"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="City or state..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
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
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Sort + clear */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Top rated</option>
                  <option value="experience">Most experienced</option>
                  <option value="fees-asc">Fee: low to high</option>
                  <option value="fees-desc">Fee: high to low</option>
                </select>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Doctor grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDoctors.map((doctor: Doctor, i) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
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
