-- Create books table for Bookshelf App
-- Single-user mode (no authentication required for now)

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

-- Create policy to allow all operations for now (single-user mode)
-- For public access without authentication
CREATE POLICY "Allow all operations for everyone" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Add some sample data
INSERT INTO books (title, author, category, description, rating, reading_status, cover_url, notes) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature', 'A tragic love story set in the Jazz Age, exploring themes of wealth, love, and the American Dream.', 5, 'Completed', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 'A masterpiece of American literature. The symbolism is incredible.'),
  ('To Kill a Mockingbird', 'Harper Lee', 'Classic Literature', 'A gripping tale of racial inequality and childhood innocence in the American South.', 5, 'Completed', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', 'Powerful story about justice and morality. Atticus Finch is an inspiring character.'),
  ('1984', 'George Orwell', 'Science Fiction', 'A dystopian novel about totalitarianism and surveillance in a future world.', 4, 'Reading', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop', 'Chilling and prophetic. Makes you think about privacy and freedom.');

