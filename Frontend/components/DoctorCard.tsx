'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Star,
  Stethoscope,
  Video
} from 'lucide-react';
import { Doctor } from '@/types';

const specGradients: Record<string, string> = {
  Cardiology: 'from-rose-500 to-orange-500',
  Neurology: 'from-violet-500 to-indigo-500',
  Pediatrics: 'from-sky-500 to-cyan-500',
  Orthopedics: 'from-amber-500 to-yellow-500',
  Dermatology: 'from-pink-500 to-fuchsia-500',
  'General Medicine': 'from-emerald-500 to-green-500'
};

const specAccent: Record<string, string> = {
  Cardiology: 'text-rose-600 bg-rose-50 border-rose-100',
  Neurology: 'text-violet-600 bg-violet-50 border-violet-100',
  Pediatrics: 'text-sky-600 bg-sky-50 border-sky-100',
  Orthopedics: 'text-amber-600 bg-amber-50 border-amber-100',
  Dermatology: 'text-pink-600 bg-pink-50 border-pink-100',
  'General Medicine': 'text-emerald-600 bg-emerald-50 border-emerald-100'
};

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, index = 0 }) => {
  const router = useRouter();
  const gradient = specGradients[doctor.specialization] ?? 'from-blue-500 to-indigo-500';
  const accent = specAccent[doctor.specialization] ?? 'text-blue-600 bg-blue-50 border-blue-100';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Top accent — no overflow clipping */}
      <div className={`h-1.5 rounded-t-2xl bg-gradient-to-r ${gradient}`} />

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        {/* Doctor identity — avatar fully visible, side by side */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="h-[88px] w-[88px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 object-cover object-center shadow-sm sm:h-24 sm:w-24"
            />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <span
              className={`mb-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${accent}`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              {doctor.specialization}
            </span>
            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-xl">
              {doctor.name}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {doctor.rating}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{doctor.reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* Key details */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Experience</p>
            <p className="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">{doctor.experience} yrs</p>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Fee</p>
            <p className="mt-0.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">${doctor.fees}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Location</p>
            <p className="mt-0.5 flex items-center justify-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100 sm:justify-start">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              <span className="truncate">{doctor.location}</span>
            </p>
          </div>
        </div>

        {/* Qualifications */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Qualifications</p>
          <div className="flex flex-wrap gap-1.5">
            {doctor.qualifications.map((qual) => (
              <span
                key={qual}
                className="rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400"
              >
                {qual}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Available days</p>
          <div className="flex flex-wrap gap-1.5">
            {doctor.availability.map((day) => (
              <span
                key={day}
                className="rounded-lg border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Actions — always fully visible */}
        <div className="mt-auto flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/patient/book-appointment?doctor=${doctor.id}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </button>
          <button
            type="button"
            onClick={() => router.push(`/patient/book-appointment?doctor=${doctor.id}&type=video`)}
            className="inline-flex items-center justify-center rounded-xl border-2 border-purple-200 dark:border-purple-800 px-4 py-3 text-purple-600 dark:text-purple-400 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
            aria-label={`Video consultation with ${doctor.name}`}
            title="Video consultation"
          >
            <Video className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default DoctorCard;
