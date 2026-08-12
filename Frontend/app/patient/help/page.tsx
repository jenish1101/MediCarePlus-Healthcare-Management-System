'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  MessageCircle,
  Clock,
  Shield
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'How do I book an appointment?',
    answer:
      'Navigate to "Book Appointment" from the sidebar or dashboard. Follow the 4-step wizard: select your doctor, choose a date, pick a time slot, and confirm your booking. You can choose between in-person and video consultations.'
  },
  {
    question: 'How do I access my lab reports?',
    answer:
      'Go to "Lab Reports" in the sidebar. Completed reports are available for download. You will also receive a notification when new results are ready.'
  },
  {
    question: 'Can I add family members to my account?',
    answer:
      'Yes! Visit the "Family Members" page to add dependents such as spouse, children, or parents. Each member gets their own health profile under your account.'
  },
  {
    question: 'How do I pay my medical bills?',
    answer:
      'Go to "Billing & Payments" to view all invoices. Click "Pay Now" on any pending or overdue invoice to process payment. Paid invoices will show a green confirmation badge.'
  },
  {
    question: 'What is telemedicine / video consultation?',
    answer:
      'Video consultations let you meet with your doctor remotely. When you book a video appointment, you can join the call from your Appointments page or the consultation room link sent via notification.'
  },
  {
    question: 'How do I refill my prescriptions?',
    answer:
      'View your active prescriptions under "Prescriptions". Click "Order These Medicines" to place a pharmacy order, or visit the Pharmacy page to order directly.'
  },
  {
    question: 'Is my health data secure?',
    answer:
      'Yes. We use industry-standard encryption and comply with HIPAA regulations. Your data is never shared with third parties without your consent.'
  },
  {
    question: 'How do I update my insurance information?',
    answer:
      'Visit the "Insurance" page to view your current coverage. To update policy details, contact member services at the number listed on your insurance card or call our support line.'
  }
];

const PatientHelp: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <DashboardLayout role="patient">
        <div className="space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Help & Support</h1>
            <p className="text-gray-600 dark:text-gray-400">Find answers to common questions and get help when you need it</p>
          </motion.div>

          {/* Emergency Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">Medical Emergency?</h3>
                <p className="text-red-700 dark:text-red-400 text-sm mb-3">
                  If you are experiencing a life-threatening emergency, call 911 immediately. Do not use this app for emergency care.
                </p>
                <div className="flex flex-wrap gap-6">
                  <a
                    href="tel:911"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call 911
                  </a>
                  <a
                    href="tel:18005550199"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-600 text-red-700 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    24/7 Nurse Hotline
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: 'Phone Support', value: '1-800-555-0100', sub: 'Mon–Fri, 8am–8pm', color: 'blue' },
              { icon: Mail, label: 'Email Support', value: 'support@healthcare.com', sub: 'Response within 24hrs', color: 'purple' },
              { icon: MapPin, label: 'Hospital Address', value: '123 Medical Center Dr', sub: 'New York, NY 10001', color: 'green' }
            ].map((contact, i) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 p-5 text-center"
              >
                <div className={`w-12 h-12 bg-${contact.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <contact.icon className={`w-6 h-6 text-${contact.color}-600`} />
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{contact.label}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{contact.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{contact.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none dark:border dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Frequently Asked Questions</h3>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {faqItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-8 h-8 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Still need help?</h3>
                  <p className="text-white/80 text-sm mt-1">
                    Our support team is ready to assist you with any questions.
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shrink-0">
                <MessageCircle className="w-5 h-5" />
                Start Live Chat
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-white/20 text-sm">
              <span className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                Avg. response: 2 minutes
              </span>
              <span className="flex items-center gap-2 text-white/80">
                <Shield className="w-4 h-4" />
                HIPAA compliant support
              </span>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PatientHelp;
