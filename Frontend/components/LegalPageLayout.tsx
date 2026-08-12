'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediCare Plus
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-8">
          <h1 className="text-xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: {lastUpdated}</p>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            {children}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
          <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link href="/terms-of-service" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Home
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default LegalPageLayout;
