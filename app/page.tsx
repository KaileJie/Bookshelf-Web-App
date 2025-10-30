"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import { Book, sampleBooks } from "@/data/sampleBooks";

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>(sampleBooks);

  const handleAddBook = (newBook: Omit<Book, "id">) => {
    const bookWithId: Book = {
      ...newBook,
      id: Date.now().toString(),
    };
    setBooks((prev) => [bookWithId, ...prev]);
  };

  const handleUpdateBook = (id: string, updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? updatedBook : book))
    );
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-orange-600" />
            <h1 className="text-5xl font-bold text-gray-900">My Bookshelf</h1>
          </div>
          <p className="text-lg text-gray-600">
            Track your reading journey and manage your personal library
          </p>
        </motion.div>

        {/* Add Book Form */}
        <div className="mb-12">
          <AddBookForm onAddBook={handleAddBook} />
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {books.length}
            </p>
            <p className="text-gray-600 mt-1">Total Books</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {books.filter((b) => b.readingStatus === "Reading").length}
            </p>
            <p className="text-gray-600 mt-1">Currently Reading</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {books.filter((b) => b.readingStatus === "Completed").length}
            </p>
            <p className="text-gray-600 mt-1">Completed</p>
          </div>
        </motion.div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              Your bookshelf is empty. Add your first book!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <BookCard 
                  book={book} 
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

