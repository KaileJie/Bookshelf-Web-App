# 🗄️ Supabase Setup Guide for Bookshelf App

This guide will walk you through setting up Supabase for your Bookshelf App.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Your Bookshelf App repository cloned locally

## 🚀 Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `bookshelf-app` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the closest region to you
4. Click "Create new project"
5. Wait 1-2 minutes for the project to be provisioned

## 🔑 Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on "Settings" (⚙️ icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. Keep this tab open—you'll need these values in the next step

## 📝 Step 3: Configure Environment Variables

1. In your project root, create a file named `.env.local`:

```bash
cd "/Users/dallylovely/Desktop/Jie/AI/Bookshelf App"
touch .env.local
```

2. Open `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Important**: Replace the placeholder values with your actual credentials from Step 2

4. Save the file

> ⚠️ **Security Note**: `.env.local` is already in `.gitignore` and won't be committed to GitHub.

## 🗃️ Step 4: Create the Database Table

You have two options to create the `books` table:

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the SQL from `supabase/migrations/001_create_books_table.sql`:

```sql
-- Create books table for Bookshelf App
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'Fiction',
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  rating FLOAT DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reading_status TEXT DEFAULT 'Not Started' CHECK (reading_status IN ('Not Started', 'Reading', 'Completed')),
  cover_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS books_created_at_idx ON books (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (single-user mode)
CREATE POLICY "Allow all operations for everyone" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" or press `Ctrl/Cmd + Enter`
5. You should see "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migration
supabase db push
```

## ✅ Step 5: Verify the Setup

1. In Supabase dashboard, click "Table Editor"
2. You should see a `books` table with the following columns:
   - `id` (uuid)
   - `title` (text)
   - `author` (text)
   - `category` (text)
   - `description` (text)
   - `notes` (text)
   - `rating` (float8)
   - `reading_status` (text)
   - `cover_url` (text)
   - `created_at` (timestamptz)

## 🏃 Step 6: Run Your App

1. Restart your development server (if it's already running):

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. Your app should now:
   - Load books from Supabase (initially empty unless you added sample data)
   - Save new books to Supabase when you add them
   - Update books in Supabase when you edit them
   - Delete books from Supabase when you remove them

## 🧪 Step 7: Test the Integration

1. **Add a book**: Click "Add New Book", fill in the form, and submit
2. **Refresh the page**: The book should still be there (persisted!)
3. **Edit the book**: Click "Edit", make changes, and save
4. **Check Supabase**: Go to Table Editor in Supabase—you should see your data
5. **Delete the book**: Hover over the cover and click delete

## 🎯 Optional: Add Sample Data

If you want to start with some sample books, run this in SQL Editor:

```sql
INSERT INTO books (title, author, category, description, rating, reading_status, cover_url, notes) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature', 'A tragic love story set in the Jazz Age.', 5, 'Completed', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 'A masterpiece!'),
  ('1984', 'George Orwell', 'Science Fiction', 'A dystopian novel about totalitarianism.', 4, 'Reading', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop', 'Very relevant today'),
  ('Pride and Prejudice', 'Jane Austen', 'Romance', 'A romantic novel critiquing British society.', 4, 'Completed', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop', 'Witty and charming');
```

---

## 🔧 Troubleshooting

### Error: "Failed to fetch books"

1. Check that your `.env.local` file exists and has the correct values
2. Verify the Supabase URL and key are correct
3. Make sure the table `books` exists in Supabase
4. Check browser console for detailed error messages

### Error: "relation 'books' does not exist"

- The table hasn't been created. Go back to Step 4

### Books don't persist after refresh

1. Open browser DevTools → Network tab
2. Look for failed requests to Supabase
3. Check that RLS policies are set correctly

### Error: "new row violates row-level security policy"

- Run this in SQL Editor:
```sql
DROP POLICY IF EXISTS "Allow all operations for everyone" ON books;
CREATE POLICY "Allow all operations for everyone" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

## 🗑️ How to Reset the Database

If you want to start fresh:

```sql
-- Delete all books
DELETE FROM books;

-- Or drop and recreate the table
DROP TABLE IF EXISTS books CASCADE;

-- Then re-run the CREATE TABLE script from Step 4
```

---

## 👥 Migrating to Multi-User (Future)

Currently, the app is in single-user mode (anyone can access all books). To add user authentication:

### 1. Update the Schema

```sql
-- Add user_id column
ALTER TABLE books ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY "Allow all operations for everyone" ON books;

-- Users can only see their own books
CREATE POLICY "Users can view own books" ON books
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own books
CREATE POLICY "Users can insert own books" ON books
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own books
CREATE POLICY "Users can update own books" ON books
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own books
CREATE POLICY "Users can delete own books" ON books
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Add Authentication to Your App

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 3. Update Your Code

- Add Supabase Auth components
- Pass `user_id` when inserting books
- Filter books by `user_id` when fetching

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Got API credentials (URL & anon key)
- [ ] Created `.env.local` with credentials
- [ ] Created `books` table in Supabase
- [ ] Verified table structure
- [ ] Tested adding a book
- [ ] Tested editing a book
- [ ] Tested deleting a book
- [ ] Verified data persists after refresh

**Congratulations! Your Bookshelf App is now connected to Supabase! 🎉**

