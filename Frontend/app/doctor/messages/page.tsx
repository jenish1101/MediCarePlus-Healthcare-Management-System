'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Search, Circle, ArrowLeft, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ApiError } from '@/lib/api';
import { listMessageThreads, sendMessage as sendMessageApi, mapThread, Conversation } from '@/api/messages';

const DoctorMessages: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [chatData, setChatData] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listMessageThreads();
      const mapped = data.map(mapThread);
      setChatData(mapped);
      setActiveId((prev) => prev ?? mapped[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const active = chatData.find((c) => c.id === activeId) || chatData[0];

  const filtered = chatData.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    const text = draft.trim();
    setDraft('');
    setSending(true);
    try {
      const updated = await sendMessageApi(active.id, text);
      const mapped = mapThread(updated);
      setChatData((prev) => prev.map((c) => (c.id === mapped.id ? mapped : c)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout role="doctor">
        <div className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Messages</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Secure messaging with your patients</p>
          </motion.div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading messages...
            </div>
          ) : !active ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No conversations yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Patient conversations will appear here.</p>
            </div>
          ) : (
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
                  disabled={!draft.trim() || sending}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
          )}

          {!loading && active && filtered.length === 0 && (
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
