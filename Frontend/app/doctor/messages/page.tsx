'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, Circle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  patientName: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

const conversations: Conversation[] = [
  {
    id: 'c1',
    patientName: 'John Patient',
    lastMessage: 'Thank you, doctor. I will take the medication as prescribed.',
    lastTime: '10:32 AM',
    unread: 0,
    messages: [
      { id: 'm1', sender: 'patient', text: 'Hello Dr. Wilson, I have a question about my blood pressure medication.', time: '10:15 AM' },
      { id: 'm2', sender: 'doctor', text: 'Hello John. Of course — what would you like to know?', time: '10:18 AM' },
      { id: 'm3', sender: 'patient', text: 'Should I take it in the morning or evening?', time: '10:22 AM' },
      { id: 'm4', sender: 'doctor', text: 'Take Amlodipine in the morning with breakfast for best results.', time: '10:28 AM' },
      { id: 'm5', sender: 'patient', text: 'Thank you, doctor. I will take the medication as prescribed.', time: '10:32 AM' }
    ]
  },
  {
    id: 'c2',
    patientName: 'Emma Thompson',
    lastMessage: 'The palpitations have reduced since starting the new medication.',
    lastTime: 'Yesterday',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'patient', text: 'Dr. Wilson, I wanted to update you on my symptoms.', time: 'Yesterday 3:00 PM' },
      { id: 'm2', sender: 'patient', text: 'The palpitations have reduced since starting the new medication.', time: 'Yesterday 3:01 PM' }
    ]
  },
  {
    id: 'c3',
    patientName: 'Sophia Davis',
    lastMessage: 'When should I schedule my follow-up lipid panel?',
    lastTime: 'Feb 12',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'patient', text: 'When should I schedule my follow-up lipid panel?', time: 'Feb 12 9:45 AM' }
    ]
  },
  {
    id: 'c4',
    patientName: 'James Wilson',
    lastMessage: 'Cardiac rehab is going well. See you at the next appointment.',
    lastTime: 'Feb 10',
    unread: 0,
    messages: [
      { id: 'm1', sender: 'doctor', text: 'How is your recovery progressing after surgery?', time: 'Feb 10 11:00 AM' },
      { id: 'm2', sender: 'patient', text: 'Cardiac rehab is going well. See you at the next appointment.', time: 'Feb 10 11:15 AM' }
    ]
  }
];

const DoctorMessages: React.FC = () => {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [chatData, setChatData] = useState(conversations);

  const active = chatData.find((c) => c.id === activeId) || chatData[0];

  const filtered = chatData.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatData((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: draft.trim(),
              lastTime: now,
              unread: 0,
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, sender: 'doctor' as const, text: draft.trim(), time: now }
              ]
            }
          : c
      )
    );
    setDraft('');
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Messages</h1>
            <p className="text-gray-600">Secure messaging with your patients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[calc(100vh-220px)] min-h-[500px]"
          >
            {/* Conversation list */}
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patients..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveId(conv.id)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      activeId === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.patientName}`}
                        alt={conv.patientName}
                        className="w-10 h-10 rounded-full bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{conv.patientName}</p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.lastTime}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat pane */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${active.patientName}`}
                  alt={active.patientName}
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <div>
                  <p className="font-semibold text-gray-900">{active.patientName}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" /> Online
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                {active.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                        msg.sender === 'doctor'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'doctor' ? 'text-blue-200' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-6 border-t border-gray-200 flex gap-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorMessages;
