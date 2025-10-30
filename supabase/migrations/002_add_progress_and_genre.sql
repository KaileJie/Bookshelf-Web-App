-- Upgrade books table for v2.0
-- Add progress tracking, genre classification, and last_updated timestamp

-- Add new columns if they don't exist
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);

ALTER TABLE books 
ADD COLUMN IF NOT EXISTS genre TEXT DEFAULT 'Fiction';

ALTER TABLE books 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for genre filtering
CREATE INDEX IF NOT EXISTS books_genre_idx ON books (genre);

-- Create index for last_updated
CREATE INDEX IF NOT EXISTS books_last_updated_idx ON books (last_updated DESC);

-- Update existing books to have default values
UPDATE books 
SET progress = 0 
WHERE progress IS NULL;

UPDATE books 
SET genre = category 
WHERE genre IS NULL OR genre = 'Fiction';

UPDATE books 
SET last_updated = created_at 
WHERE last_updated IS NULL;

-- Create trigger to auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_books_last_updated ON books;

CREATE TRIGGER update_books_last_updated
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();

-- Add some sample data with progress
UPDATE books SET progress = 100 WHERE reading_status = 'Completed';
UPDATE books SET progress = 50 WHERE reading_status = 'Reading';
UPDATE books SET progress = 0 WHERE reading_status = 'Not Started';

