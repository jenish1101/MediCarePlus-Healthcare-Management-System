'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  DollarSign,
  Stethoscope,
  Video,
  User,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listDoctors, mapDoctor } from '@/api/doctors';
import { createAppointment } from '@/api/appointments';
import { Doctor } from '@/types';

const STEPS = ['Select Doctor', 'Date', 'Time', 'Confirm'] as const;

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

const getAvailableDates = () => {
  const dates: { value: string; label: string; day: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      day: d.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  return dates;
};

const BookAppointmentForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'video'>('in-person');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorsError('');
    try {
      const data = await listDoctors();
      const mapped = data.map(mapDoctor);
      setDoctors(mapped);

      const doctorId = searchParams.get('doctor');
      if (doctorId) {
        const doctor = mapped.find((d) => d.id === doctorId);
        if (doctor) setSelectedDoctor(doctor);
      }
    } catch (err) {
      setDoctorsError(err instanceof ApiError ? err.message : 'Could not load doctors.');
    } finally {
      setDoctorsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'video') setAppointmentType('video');
  }, [searchParams]);

  const availableDates = getAvailableDates();

  const canProceed = () => {
    if (step === 0) return !!selectedDoctor;
    if (step === 1) return !!selectedDate;
    if (step === 2) return !!selectedTime;
    return true;
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    if (!selectedDoctor) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await createAppointment({
        doctor_id: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        reason,
        appointment_type: appointmentType
      });
      setConfirmed(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  if (confirmed && selectedDoctor) {
    return (
      <ProtectedRoute allowedRoles={['patient']}>
        <DashboardLayout role="patient">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-none dark:border dark:border-gray-700 p-10 text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your appointment with {selectedDoctor.name} has been confirmed.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-5 text-left space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Doctor</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Time</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{appointmentType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Fee</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">${selectedDoctor.fees}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmed(false);
                  setStep(0);
                  setSelectedDoctor(null);
                  setSelectedDate('');
                  setSelectedTime('');
                  setReason('');
                }}
                className="flex-1 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => router.push('/patient/appointments')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </motion.div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Book Appointment</h1>
            <p className="text-gray-600 dark:text-gray-400">Schedule a visit with your preferred doctor</p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        i < step
                          ? 'bg-green-600 text-white'
                          : i === step
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden sm:block ${
                        i <= step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-colors ${
                        i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-6"
            >
              {step === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Select a Doctor
                  </h3>
                  {doctorsError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                      {doctorsError}
                    </div>
                  )}
                  {doctorsLoading ? (
                    <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading doctors...
                    </div>
                  ) : (
                  <div className="grid sm:grid-cols-2 gap-6 max-h-[420px] overflow-y-auto pr-1">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-700 shadow"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{doctor.name}</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{doctor.specialization}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {doctor.rating}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-0.5 text-green-600 dark:text-green-400" />
                                {doctor.fees}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Select Date
                  </h3>
                  {selectedDoctor && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Available days for {selectedDoctor.name}:{' '}
                      {selectedDoctor.availability.join(', ')}
                    </p>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
                    {availableDates.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          selectedDate === d.value
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400">{d.day}</p>
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{d.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Select Time
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedTime === slot
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Appointment Type</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setAppointmentType('in-person')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                          appointmentType === 'in-person'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        In-Person
                      </button>
                      <button
                        onClick={() => setAppointmentType('video')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                          appointmentType === 'video'
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Video className="w-5 h-5" />
                        Video Call
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2">Reason for Visit</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your symptoms or reason for visit..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {step === 3 && selectedDoctor && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Confirm Appointment
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                    <div className="flex items-start gap-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedDoctor.avatar}
                        alt={selectedDoctor.name}
                        className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-700 shadow"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedDoctor.name}</h4>
                        <p className="text-blue-600 dark:text-blue-400">{selectedDoctor.specialization}</p>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-4 h-4" />
                          {selectedDoctor.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {selectedDate}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {selectedTime}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{appointmentType}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">${selectedDoctor.fees}</p>
                    </div>
                  </div>

                  {reason && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
                      <p className="text-gray-800 dark:text-gray-200">{reason}</p>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between gap-6">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 3 ? (submitting ? 'Booking...' : 'Confirm Booking') : 'Continue'}
              {step < 3 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

const BookAppointment: React.FC = () => (
  <Suspense fallback={
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  }>
    <BookAppointmentForm />
  </Suspense>
);

export default BookAppointment;
