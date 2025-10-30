# 📚 Bookshelf App

A beautiful, fully functional bookshelf web application built with React, Next.js, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Display Books**: Grid layout with book cards showing cover, title, author, category, rating, description, notes, and reading status
- **Add Books**: Dynamic form to add new books with validation (title and author required)
- **Edit All Fields**: Full inline editing capability for ALL book information:
  - ✏️ Title & Author
  - 📚 Category & Reading Status
  - ⭐ Rating (click stars to change)
  - 📖 Description & Notes
  - 🖼️ Cover Image URL
- **Delete Books**: Remove books with confirmation dialog (hover over cover to see delete button)
- **Star Ratings**: Visual 0-5 star rating display with interactive editing
- **Reading Status**: Track books as "Not Started", "Reading", or "Completed"
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion animations for card appearances and interactions
- **Statistics Dashboard**: Quick overview of total books, currently reading, and completed

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React useState + Supabase Client

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed on your machine

### Installation

1. Navigate to the project directory:
```bash
cd "Bookshelf App"
```

2. Install dependencies:
```bash
npm install
```

3. **Set up Supabase** (Required for data persistence):
   - Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```
http://localhost:3000
```

## 📁 Project Structure

```
Bookshelf App/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main Bookshelf page with Supabase
├── components/
│   ├── BookCard.tsx         # Book card with full edit capabilities
│   └── AddBookForm.tsx      # Add book form with validation
├── data/
│   └── sampleBooks.ts       # Type definitions & data transformers
├── lib/
│   ├── utils.ts             # Utility functions
│   └── supabase.ts          # Supabase client configuration
├── supabase/
│   └── migrations/
│       └── 001_create_books_table.sql  # Database schema
├── .env.local               # Environment variables (gitignored)
├── package.json             # Dependencies and scripts
├── README.md                # This file
└── SUPABASE_SETUP.md        # Detailed Supabase setup guide
```

## 🎨 Design Features

- **Color Palette**: Warm orange and white gradient background
- **Card Design**: Rounded-2xl cards with soft shadows
- **Typography**: Clean Tailwind defaults
- **Hover Effects**: Smooth transitions on buttons and cards
- **Responsive Grid**: 1 column on mobile, 2-3 columns on larger screens

## 📋 Usage Guide

### Adding a Book

1. Click the "Add New Book" button
2. Fill in the required fields (Title and Author are mandatory)
3. Optionally add category, description, notes, cover image URL, rating, and reading status
4. Click "Add Book" to save

### Editing Book Information

1. Locate the book card you want to edit
2. Click the **"Edit"** button in the top right
3. Update ANY field you want:
   - **Title & Author**: Edit directly in text fields
   - **Category**: Choose from dropdown menu
   - **Reading Status**: Select from dropdown
   - **Rating**: Click on stars to set 0-5 star rating
   - **Cover URL**: Update the image link
   - **Description**: Edit in expandable text area
   - **Notes**: Add or modify your personal notes
4. Click **"Save"** to save all changes
5. Click **"Cancel"** to discard changes

### Deleting Books

1. Hover over any book card's cover image
2. A red "Delete" button will appear in the top right corner
3. Click it and confirm to permanently remove the book

### Book Information Display

Each book card shows:
- Cover image
- Title and author
- Category badge
- Reading status badge
- Star rating (0-5 stars)
- Description
- Personal notes

## 🗄️ Database Integration

This app uses **Supabase** for data persistence:

- ✅ All books are stored in PostgreSQL via Supabase
- ✅ Changes are saved automatically (optimistic updates + server sync)
- ✅ Data persists across page refreshes and browser sessions
- ✅ No backend code needed - direct client-to-database connection
- ✅ Row Level Security enabled for future multi-user support

**See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete setup instructions.**

## 🔮 Future Enhancements

Ready to add these features:

### Category Filter
```typescript
// Add to page.tsx
const [selectedCategory, setSelectedCategory] = useState<string>("All");
const filteredBooks = selectedCategory === "All" 
  ? books 
  : books.filter(b => b.category === selectedCategory);
```

### LocalStorage Persistence
```typescript
// Add to page.tsx
useEffect(() => {
  const saved = localStorage.getItem('books');
  if (saved) setBooks(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem('books', JSON.stringify(books));
}, [books]);
```

### Reading Progress Bar
```typescript
// Add to Book interface
progress: number; // 0-100

// Add to BookCard component
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-orange-500 h-2 rounded-full transition-all"
    style={{ width: `${book.progress}%` }}
  />
</div>
```

### Search Functionality
```typescript
const [searchQuery, setSearchQuery] = useState("");
const searchedBooks = books.filter(b => 
  b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  b.author.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### Sort Options
```typescript
const sortBooks = (books: Book[], sortBy: 'title' | 'author' | 'rating') => {
  return [...books].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    return a[sortBy].localeCompare(b[sortBy]);
  });
};
```

## 🧪 Testing

The app includes:
- Form validation (title and author required)
- Responsive design testing across devices
- Animation performance
- State management integrity

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your needs!

---

Built with ❤️ using React, Next.js, and Tailwind CSS

