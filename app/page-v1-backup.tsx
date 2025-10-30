"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, AlertCircle } from "lucide-react";
import BookCard from "@/components/BookCard";
import AddBookForm from "@/components/AddBookForm";
import { Book, dbToBook, bookToDb } from "@/data/sampleBooks";
import { supabase } from "@/lib/supabase";

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from Supabase on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedBooks = data?.map(dbToBook) || [];
      setBooks(formattedBooks);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, "id">) => {
    try {
      // Optimistic update
      const tempId = Date.now().toString();
      const bookWithId: Book = { ...newBook, id: tempId };
      setBooks((prev) => [bookWithId, ...prev]);

      // Insert into Supabase (exclude id to let database generate it)
      const dbBook = bookToDb(newBook, true);
      const { data, error: insertError } = await supabase
        .from('books')
        .insert([dbBook])
        .select()
        .single();

      if (insertError) throw insertError;

      // Replace temp book with real one
      setBooks((prev) =>
        prev.map((book) => (book.id === tempId ? dbToBook(data) : book))
      );
    } catch (err: any) {
      console.error('Error adding book:', err);
      setError(err.message || 'Failed to add book');
      // Rollback optimistic update
      fetchBooks();
    }
  };

  const handleUpdateBook = async (id: string, updatedBook: Book) => {
    try {
      // Optimistic update
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );

      // Update in Supabase
      const dbBook = bookToDb(updatedBook);
      const { error: updateError } = await supabase
        .from('books')
        .update(dbBook)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('Error updating book:', err);
      setError(err.message || 'Failed to update book');
      // Rollback optimistic update
      fetchBooks();
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      // Optimistic update
      setBooks((prev) => prev.filter((book) => book.id !== id));

      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setError(err.message || 'Failed to delete book');
      // Rollback optimistic update
      fetchBooks();
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

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </motion.div>
        )}

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          </div>
        ) : books.length === 0 ? (
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

