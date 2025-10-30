"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Edit, Save, X, Trash2, Eye, TrendingUp } from "lucide-react";
import { Book } from "@/data/sampleBooks";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onUpdateBook: (id: string, updatedBook: Book) => void;
  onDeleteBook: (id: string) => void;
  onViewDetails: (book: Book) => void;
}

export default function BookCardV2({ book, onUpdateBook, onDeleteBook, onViewDetails }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Book>(book);

  const handleSave = () => {
    onUpdateBook(book.id, editedBook);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBook(book);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Book, value: string | number) => {
    setEditedBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleRatingClick = (rating: number) => {
    if (!isEditing) {
      const updatedBook = { ...book, rating };
      onUpdateBook(book.id, updatedBook);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(e.target.value);
    handleChange("progress", progress);
  };

  const renderClickableStars = (rating: number, editable: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => editable && handleRatingClick(star)}
            className={cn(
              "transition-all",
              editable ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
            disabled={!editable}
          >
            <Star
              className={cn(
                "w-5 h-5",
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : editable
                  ? "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"
                  : "fill-gray-200 text-gray-200"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Book Cover */}
      <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative group/cover">
        <img
          src={isEditing ? editedBook.coverUrl : book.coverUrl}
          alt={isEditing ? editedBook.title : book.title}
          className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => onViewDetails(book)}
            className="opacity-0 group-hover/cover:opacity-100 transition-opacity px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4" />
            View Details
          </motion.button>
        </div>
        {/* Delete Button */}
        {!isEditing && (
          <button
            onClick={() => onDeleteBook(book.id)}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover/cover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            title="Delete Book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Book Info */}
      <div className="p-5 space-y-3">
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          )}
        </div>

        {/* Title & Author */}
        <div>
          {!isEditing ? (
            <>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={editedBook.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 text-lg font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Book Title"
              />
              <input
                type="text"
                value={editedBook.author}
                onChange={(e) => handleChange("author", e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Author Name"
              />
            </div>
          )}
        </div>

        {/* Genre & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isEditing ? (
            <>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                {book.genre}
              </span>
              <span className={cn("px-3 py-1 text-xs font-medium rounded-full", getStatusColor(book.readingStatus))}>
                {book.readingStatus}
              </span>
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <select
                value={editedBook.genre}
                onChange={(e) => handleChange("genre", e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Romance">Romance</option>
                <option value="Mystery">Mystery</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Classic Literature">Classic Literature</option>
              </select>
              <select
                value={editedBook.readingStatus}
                onChange={(e) => handleChange("readingStatus", e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Not Started">Not Started</option>
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </div>
            <span className="text-sm font-semibold text-orange-600">{isEditing ? editedBook.progress : book.progress}%</span>
          </div>
          {isEditing ? (
            <input
              type="range"
              min="0"
              max="100"
              value={editedBook.progress}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          ) : (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${book.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              />
            </div>
          )}
        </div>

        {/* Rating - Clickable! */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          {isEditing ? (
            renderClickableStars(editedBook.rating, true)
          ) : (
            <div className="group/rating">
              {renderClickableStars(book.rating, true)}
              <span className="text-xs text-gray-500 opacity-0 group-hover/rating:opacity-100 transition-opacity">
                Click to rate
              </span>
            </div>
          )}
        </div>

        {/* Cover URL - Only in edit mode */}
        {isEditing && (
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Cover Image URL:</label>
            <input
              type="url"
              value={editedBook.coverUrl}
              onChange={(e) => handleChange("coverUrl", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        )}

        {/* Description Preview */}
        {!isEditing && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
          </div>
        )}

        {/* Edit Mode: Description & Notes */}
        {isEditing && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Description:</label>
              <textarea
                value={editedBook.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Book description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes:</label>
              <textarea
                value={editedBook.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Add your notes here..."
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

