'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageCircle,
  Send,
  User,
  Clock,
  Monitor
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockAppointments, mockDoctors } from '@/data/mockData';

interface ChatMessage {
  id: number;
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  { id: 1, sender: 'doctor', text: 'Hello! I can see you now. How are you feeling today?', time: '2:28 PM' },
  { id: 2, sender: 'patient', text: 'Hi Dr. Rodriguez, I have been having some mild symptoms.', time: '2:29 PM' },
  { id: 3, sender: 'doctor', text: 'Can you describe the symptoms in more detail?', time: '2:29 PM' }
];

const VideoConsultation: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const appointment = mockAppointments.find((a) => a.id === consultationId) ||
    mockAppointments.find((a) => a.type === 'video');
  const doctor = mockDoctors.find((d) => d.id === appointment?.doctorId) || mockDoctors[2];

  useEffect(() => {
    if (callEnded) return;
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [callEnded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'patient',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }
    ]);
    setNewMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'doctor',
          text: 'Thank you for sharing. Let me review your records and provide recommendations.',
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  const endCall = () => {
    setCallEnded(true);
  };

  if (callEnded) {
    return (
      <ProtectedRoute allowedRoles={['patient']}>
        <DashboardLayout role="patient">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-10 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneOff className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Consultation Ended</h2>
            <p className="text-gray-600 mb-2">
              Your video consultation with {doctor.name} has ended.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Duration: {formatDuration(callDuration)} · ID: {consultationId}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/patient/appointments')}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Appointments
              </button>
              <button
                onClick={() => router.push('/patient/dashboard')}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Dashboard
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
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <h1 className="text-lg font-bold text-gray-900">Video Consultation</h1>
              <p className="text-gray-600 text-sm">
                Session {consultationId} · {appointment?.reason || 'General consultation'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live
              </span>
              <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                {formatDuration(callDuration)}
              </span>
            </div>
          </motion.div>

          <div className={`grid gap-6 ${chatOpen ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
            {/* Video Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${chatOpen ? 'lg:col-span-2' : 'col-span-1'} space-y-6`}
            >
              {/* Doctor Video (main) */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-xl">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full border-4 border-white/20 mb-4"
                  />
                  <p className="text-white font-semibold text-lg">{doctor.name}</p>
                  <p className="text-white/60 text-sm">{doctor.specialization}</p>
                  <div className="mt-4 flex items-center gap-2 text-white/40 text-sm">
                    <Monitor className="w-4 h-4" />
                    Video feed placeholder
                  </div>
                </div>

                {/* Self view (PIP) */}
                <div className="absolute bottom-4 right-4 w-36 h-28 bg-gray-800 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {videoEnabled ? (
                      <>
                        <User className="w-8 h-8 text-white/60 mb-1" />
                        <p className="text-white/40 text-xs">You</p>
                      </>
                    ) : (
                      <VideoOff className="w-8 h-8 text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-6">
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-4 rounded-full transition-colors ${
                    micEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                  }`}
                  aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-4 rounded-full transition-colors ${
                    videoEnabled ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                  }`}
                  aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={endCall}
                  className="p-6 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  aria-label="End call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`p-4 rounded-full transition-colors lg:hidden ${
                    chatOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  aria-label="Toggle chat"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* Chat Sidebar */}
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl shadow-lg flex flex-col h-[500px] lg:h-auto lg:min-h-[480px]"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Chat</h3>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 lg:hidden"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                          msg.sender === 'patient'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            msg.sender === 'patient' ? 'text-blue-200' : 'text-gray-400'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-6 border-t border-gray-100 flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default VideoConsultation;
