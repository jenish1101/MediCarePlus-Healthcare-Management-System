'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Monitor,
  ArrowLeft,
  Clock,
  User
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Consultation {
  id: string;
  patientName: string;
  reason: string;
  date: string;
  time: string;
  duration: string;
}

const consultations: Record<string, Consultation> = {
  a2: {
    id: 'a2',
    patientName: 'Emma Thompson',
    reason: 'Follow-up consultation',
    date: '2024-02-15',
    time: '11:30 AM',
    duration: '30 min'
  },
  a4: {
    id: 'a4',
    patientName: 'Sophia Davis',
    reason: 'Blood pressure review',
    date: '2024-02-16',
    time: '09:00 AM',
    duration: '20 min'
  },
  a7: {
    id: 'a7',
    patientName: 'Liam Garcia',
    reason: 'Cancelled by patient',
    date: '2024-02-09',
    time: '04:00 PM',
    duration: '30 min'
  },
  apt2: {
    id: 'apt2',
    patientName: 'John Patient',
    reason: 'Vaccination',
    date: '2024-02-20',
    time: '2:30 PM',
    duration: '30 min'
  }
};

const DoctorConsultation: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;
  const consultation = consultations[consultationId];

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  React.useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [joined]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!consultation) {
    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <DashboardLayout role="doctor">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation not found</h3>
            <p className="text-gray-600 mb-6">No video session exists for ID &quot;{consultationId}&quot;.</p>
            <button
              onClick={() => router.push('/doctor/appointments')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Appointments
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => router.push('/doctor/appointments')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Appointments
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Video Consultation</h1>
            <p className="text-gray-600">{consultation.patientName} · {consultation.reason}</p>
          </motion.div>

          {!joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-5 max-w-lg mx-auto text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.patientName}`}
                alt={consultation.patientName}
                className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4"
              />
              <h2 className="text-lg font-bold text-gray-900 mb-1">{consultation.patientName}</h2>
              <p className="text-gray-600 mb-1">{consultation.reason}</p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{consultation.date} · {consultation.time}</span>
                <span className="flex items-center gap-1"><User className="w-4 h-4" />{consultation.duration}</span>
              </div>

              <div className="bg-gray-900 rounded-xl aspect-video mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-white">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-60" />
                  <p className="text-sm opacity-80">Camera preview</p>
                </div>
                <div className="absolute bottom-3 right-3 w-28 h-20 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-600">
                  <span className="text-xs text-gray-400">You</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-3 rounded-full transition-colors ${micOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`p-3 rounded-full transition-colors ${camOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}
                >
                  {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={() => setJoined(true)}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-6 h-6" /> Join Call
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-xl aspect-video relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.patientName}`}
                    alt={consultation.patientName}
                    className="w-32 h-32 rounded-full bg-gray-800"
                  />
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
                  </span>
                  <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full">{formatTime(elapsed)}</span>
                </div>
                <div className="absolute top-4 right-4 text-white text-sm font-medium">{consultation.patientName}</div>
                <div className="absolute bottom-4 right-4 w-36 h-24 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-600">
                  <span className="text-xs text-gray-400">Dr. Wilson</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-6">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-4 rounded-full transition-colors ${micOn ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'}`}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`p-4 rounded-full transition-colors ${camOn ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'}`}
                >
                  {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button className="p-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-4 rounded-full transition-colors ${showChat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setJoined(false); setElapsed(0); }}
                  className="p-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>

              {showChat && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-white rounded-xl shadow-lg p-4 max-w-md ml-auto"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">In-call chat</p>
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    <div className="text-sm bg-gray-100 rounded-lg p-2">
                      <span className="font-medium">{consultation.patientName}:</span> Can you see my latest test results?
                    </div>
                    <div className="text-sm bg-blue-50 rounded-lg p-2">
                      <span className="font-medium">You:</span> Yes, everything looks good so far.
                    </div>
                  </div>
                  <input
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorConsultation;
