"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import BookCardV2 from "@/components/BookCardV2";
import AddBookForm from "@/components/AddBookForm";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import StatsOverview from "@/components/StatsOverview";
import BookDetailsDialog from "@/components/BookDetailsDialog";
import { Book, dbToBook, bookToDb } from "@/data/sampleBooks";
import { supabase } from "@/lib/supabase";

export default function BookshelfV2() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch books from Supabase on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedBooks = data?.map(dbToBook) || [];
      setBooks(formattedBooks);
    } catch (err: any) {
      console.error("Error fetching books:", err);
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook: Omit<Book, "id">) => {
    try {
      // Optimistic update
      const tempId = Date.now().toString();
      const bookWithId: Book = { ...newBook, id: tempId, progress: 0, genre: newBook.category };
      setBooks((prev) => [bookWithId, ...prev]);

      // Insert into Supabase (exclude id to let database generate it)
      const dbBook = bookToDb(newBook, true);
      const { data, error: insertError } = await supabase
        .from("books")
        .insert([dbBook])
        .select()
        .single();

      if (insertError) throw insertError;

      // Replace temp book with real one
      setBooks((prev) => prev.map((book) => (book.id === tempId ? dbToBook(data) : book)));
    } catch (err: any) {
      console.error("Error adding book:", err);
      setError(err.message || "Failed to add book");
      // Rollback optimistic update
      fetchBooks();
    }
  };

  const handleUpdateBook = async (id: string, updatedBook: Book) => {
    try {
      // Optimistic update
      setBooks((prev) => prev.map((book) => (book.id === id ? updatedBook : book)));

      // Update in Supabase
      const dbBook = bookToDb(updatedBook);
      const { error: updateError } = await supabase.from("books").update(dbBook).eq("id", id);

      if (updateError) throw updateError;
    } catch (err: any) {
      console.error("Error updating book:", err);
      setError(err.message || "Failed to update book");
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
      const { error: deleteError } = await supabase.from("books").delete().eq("id", id);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error("Error deleting book:", err);
      setError(err.message || "Failed to delete book");
      // Rollback optimistic update
      fetchBooks();
    }
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  // Get unique genres
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(books.map((book) => book.genre)));
    return uniqueGenres.sort();
  }, [books]);

  // Filter books based on search and genre
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = books.length;
    const reading = books.filter((b) => b.readingStatus === "Reading").length;
    const completed = books.filter((b) => b.readingStatus === "Completed").length;
    const avgProgress = total > 0 ? Math.round(books.reduce((sum, b) => sum + b.progress, 0) / total) : 0;

    return { total, reading, completed, avgProgress };
  }, [books]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-800"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              ✕
            </button>
          </motion.div>
        )}

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div>
            <CategoryFilter value={selectedGenre} onChange={setSelectedGenre} categories={genres} />
          </div>
        </div>

        {/* Add Book Form */}
        <div className="mb-8">
          <AddBookForm onAddBook={handleAddBook} />
        </div>

        {/* Stats Overview */}
        <StatsOverview
          total={stats.total}
          reading={stats.reading}
          completed={stats.completed}
          avgProgress={stats.avgProgress}
        />

        {/* Results Count */}
        {(searchQuery || selectedGenre !== "All") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-sm text-gray-600"
          >
            Showing {filteredBooks.length} of {books.length} books
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedGenre !== "All" && ` in ${selectedGenre}`}
          </motion.div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600 mb-2">
              {searchQuery || selectedGenre !== "All" ? "No books found" : "Your bookshelf is empty"}
            </p>
            <p className="text-gray-500">
              {searchQuery || selectedGenre !== "All"
                ? "Try adjusting your search or filter"
                : "Add your first book to get started!"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book, index) => (
                <BookCardV2
                  key={book.id}
                  book={book}
                  onUpdateBook={handleUpdateBook}
                  onDeleteBook={handleDeleteBook}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Book Details Dialog */}
      <BookDetailsDialog book={selectedBook} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}

