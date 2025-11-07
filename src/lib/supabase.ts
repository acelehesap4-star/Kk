import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Use a consistent environment variable name for Supabase anon/public key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check if Supabase credentials are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseUrl !== 'your_supabase_url' &&
  supabaseAnonKey !== 'your-public-anon-key' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

// Create a mock client if Supabase is not configured
const createMockSupabaseClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  })
});

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      token_purchases: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          price: number;
          total: number;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          price: number;
          total: number;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          price?: number;
          total?: number;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      watchlist_items: {
        Row: {
          id: string;
          watchlist_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          watchlist_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          watchlist_id?: string;
          market_type?: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol?: string;
          created_at?: string;
        };
      };
      trading_alerts: {
        Row: {
          id: string;
          user_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          alert_type: 'price' | 'percent_change' | 'volume' | 'technical';
          condition: 'above' | 'below' | 'crosses_up' | 'crosses_down';
          value: number;
          status: 'active' | 'triggered' | 'disabled';
          created_at: string;
          triggered_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          alert_type: 'price' | 'percent_change' | 'volume' | 'technical';
          condition: 'above' | 'below' | 'crosses_up' | 'crosses_down';
          value: number;
          status?: 'active' | 'triggered' | 'disabled';
          created_at?: string;
          triggered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          market_type?: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol?: string;
          alert_type?: 'price' | 'percent_change' | 'volume' | 'technical';
          condition?: 'above' | 'below' | 'crosses_up' | 'crosses_down';
          value?: number;
          status?: 'active' | 'triggered' | 'disabled';
          created_at?: string;
          triggered_at?: string;
        };
      };
      market_analysis: {
        Row: {
          id: string;
          user_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          timeframe: string;
          analysis_type: 'technical' | 'fundamental' | 'sentiment';
          indicators?: Record<string, any>;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          market_type: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol: string;
          timeframe: string;
          analysis_type: 'technical' | 'fundamental' | 'sentiment';
          indicators?: Record<string, any>;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          market_type?: 'crypto' | 'forex' | 'stocks' | 'indices';
          symbol?: string;
          timeframe?: string;
          analysis_type?: 'technical' | 'fundamental' | 'sentiment';
          indicators?: Record<string, any>;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};