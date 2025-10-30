export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  rating: number;
  notes: string;
  readingStatus: "Not Started" | "Reading" | "Completed";
  coverUrl: string;
  created_at?: string;
}

// Helper to convert Supabase DB format to App format
export function dbToBook(dbBook: any): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    category: dbBook.category || 'Fiction',
    description: dbBook.description || '',
    rating: dbBook.rating || 0,
    notes: dbBook.notes || '',
    readingStatus: dbBook.reading_status || 'Not Started',
    coverUrl: dbBook.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    created_at: dbBook.created_at
  };
}

// Helper to convert App format to Supabase DB format
export function bookToDb(book: Partial<Book>, excludeId: boolean = false) {
  const dbBook: any = {
    title: book.title || '',
    author: book.author || '',
    category: book.category || 'Fiction',
    description: book.description || '',
    rating: book.rating || 0,
    notes: book.notes || '',
    reading_status: book.readingStatus || 'Not Started',
    cover_url: book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
  };
  
  // Only include id if it exists and we're not excluding it
  if (!excludeId && book.id) {
    dbBook.id = book.id;
  }
  
  return dbBook;
}

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    description: "A tragic love story set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    rating: 5,
    notes: "A masterpiece of American literature. The symbolism is incredible.",
    readingStatus: "Completed",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic Literature",
    description: "A gripping tale of racial inequality and childhood innocence in the American South.",
    rating: 5,
    notes: "Powerful story about justice and morality. Atticus Finch is an inspiring character.",
    readingStatus: "Completed",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    description: "A dystopian novel about totalitarianism and surveillance in a future world.",
    rating: 4,
    notes: "Chilling and prophetic. Makes you think about privacy and freedom.",
    readingStatus: "Reading",
    coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    rating: 4,
    notes: "Witty dialogue and complex characters. Elizabeth Bennet is wonderful.",
    readingStatus: "Completed",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop"
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description: "A fantasy novel about a hobbit's unexpected journey to help reclaim a treasure.",
    rating: 5,
    notes: "An enchanting adventure! Perfect for escaping into Middle-earth.",
    readingStatus: "Reading",
    coverUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop"
  },
  {
    id: "6",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    description: "A practical guide to building good habits and breaking bad ones through small changes.",
    rating: 4,
    notes: "Very actionable advice. The 1% improvement concept is powerful.",
    readingStatus: "Not Started",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop"
  }
];

