'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, Circle, ArrowLeft } from 'lucide-react';
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
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const active = chatData.find((c) => c.id === activeId) || chatData[0];

  const filtered = chatData.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
  };

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
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Messages</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Secure messaging with your patients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden flex flex-col md:flex-row h-[calc(100dvh-11rem)] sm:h-[calc(100dvh-12rem)] md:h-[calc(100vh-220px)] min-h-[420px] md:min-h-[500px]"
          >
            {/* Conversation list — hidden on mobile when chat is open */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 ${
              mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}>
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patients..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full text-left p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      activeId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.patientName}`}
                        alt={conv.patientName}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">{conv.patientName}</p>
                          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 shrink-0">{conv.lastTime}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">
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

            {/* Chat pane — full width on mobile when open */}
            <div className={`flex-1 flex flex-col min-w-0 min-h-0 ${
              mobileShowChat ? 'flex' : 'hidden md:flex'
            }`}>
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${active.patientName}`}
                  alt={active.patientName}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">{active.patientName}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current" /> Online
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 sm:space-y-6 bg-gray-50 dark:bg-gray-900/40 min-h-0">
                {active.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                        msg.sender === 'doctor'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm dark:shadow-none rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-[10px] sm:text-xs mt-1 ${msg.sender === 'doctor' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-3 sm:p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 flex gap-2 sm:gap-3 shrink-0">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>

          {filtered.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No conversations found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try a different search term.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DoctorMessages;
