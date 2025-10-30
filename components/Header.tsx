"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <BookOpen className="w-12 h-12 text-orange-600" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
          My Bookshelf
        </h1>
      </div>
      <p className="text-lg text-gray-600">
        Track your reading journey with enhanced progress tracking
      </p>
      <div className="mt-2 inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
        v2.0 - Enhanced Edition
      </div>
    </motion.div>
  );
}

