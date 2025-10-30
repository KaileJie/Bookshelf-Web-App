"use client";

import { Book } from "@/data/sampleBooks";
import { X, Star, Calendar, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookDetailsDialogProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDetailsDialog({ book, isOpen, onClose }: BookDetailsDialogProps) {
  if (!book) return null;

  const getStatusColor = (status: Book["readingStatus"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Reading":
        return "bg-blue-100 text-blue-800";
      case "Not Started":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover opacity-40"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Title & Author */}
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
                  <p className="text-lg text-gray-600">by {book.author}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                    {book.genre}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(book.readingStatus)}`}>
                    {book.readingStatus}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= book.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({book.rating}/5)</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Reading Progress</span>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{book.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${book.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">My Notes</h3>
                  <div className="bg-amber-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 italic">
                      {book.notes || "No notes yet. Add some thoughts about this book!"}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                {book.last_updated && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Last updated: {new Date(book.last_updated).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

