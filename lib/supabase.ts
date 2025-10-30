import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please add them to .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          category: string;
          description: string;
          notes: string;
          rating: number;
          reading_status: 'Not Started' | 'Reading' | 'Completed';
          cover_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          category?: string;
          description?: string;
          notes?: string;
          rating?: number;
          reading_status?: 'Not Started' | 'Reading' | 'Completed';
          cover_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          category?: string;
          description?: string;
          notes?: string;
          rating?: number;
          reading_status?: 'Not Started' | 'Reading' | 'Completed';
          cover_url?: string;
          created_at?: string;
        };
      };
    };
  };
}

