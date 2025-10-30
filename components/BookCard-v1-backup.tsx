"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Edit, Save, X, Trash2 } from "lucide-react";
import { Book } from "@/data/sampleBooks";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onUpdateBook: (id: string, updatedBook: Book) => void;
  onDeleteBook: (id: string) => void;
}

export default function BookCard({ book, onUpdateBook, onDeleteBook }: BookCardProps) {
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

  const handleChange = (
    field: keyof Book,
    value: string | number
  ) => {
    setEditedBook((prev) => ({ ...prev, [field]: value }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Book Cover */}
      <div className="h-64 w-full overflow-hidden bg-gray-100 relative group">
        <img
          src={isEditing ? editedBook.coverUrl : book.coverUrl}
          alt={isEditing ? editedBook.title : book.title}
          className="w-full h-full object-cover"
        />
        {!isEditing && (
          <button
            onClick={() => onDeleteBook(book.id)}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Delete Book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Book Info */}
      <div className="p-6 space-y-3">
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
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
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{book.author}</p>
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={editedBook.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Book Title"
              />
              <input
                type="text"
                value={editedBook.author}
                onChange={(e) => handleChange("author", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Author Name"
              />
            </div>
          )}
        </div>

        {/* Category & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isEditing ? (
            <>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                {book.category}
              </span>
              <span
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  getStatusColor(book.readingStatus)
                )}
              >
                {book.readingStatus}
              </span>
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <select
                value={editedBook.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Not Started">Not Started</option>
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          {!isEditing ? (
            renderStars(book.rating)
          ) : (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange("rating", star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      "w-5 h-5 cursor-pointer transition-colors",
                      star <= editedBook.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cover URL - Only in edit mode */}
        {isEditing && (
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Cover Image URL:
            </label>
            <input
              type="url"
              value={editedBook.coverUrl}
              onChange={(e) => handleChange("coverUrl", e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <span className="text-sm font-medium text-gray-700 block mb-1">Description:</span>
          {!isEditing ? (
            <p className="text-sm text-gray-700 line-clamp-3">
              {book.description}
            </p>
          ) : (
            <textarea
              value={editedBook.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Book description"
            />
          )}
        </div>

        {/* Notes Section */}
        <div className="pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700 block mb-2">Notes:</span>
          {!isEditing ? (
            <p className="text-sm text-gray-600 italic">
              {book.notes || "No notes yet..."}
            </p>
          ) : (
            <textarea
              value={editedBook.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add your notes here..."
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

