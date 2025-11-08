import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase bağlantısının yapılandırılıp yapılandırılmadığını kontrol et
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'berkecansuskun1998@gmail.com',
  password: '7892858a'
};

// Create a demo client with working authentication
const createMockSupabaseClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Sign up disabled' } }),
    signInWithPassword: ({ email, password }: { email: string; password: string }) => {
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const mockUser = {
          id: 'demo-admin-id',
          email: DEMO_ADMIN.email,
          user_metadata: { role: 'admin' },
          created_at: new Date().toISOString()
        };
        const mockSession = {
          access_token: 'demo-access-token',
          refresh_token: 'demo-refresh-token',
          user: mockUser,
          expires_at: Date.now() + 3600000 // 1 hour
        };
        
        // Store session in localStorage for persistence
        localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
        
        return Promise.resolve({ 
          data: { user: mockUser, session: mockSession }, 
          error: null 
        });
      }
      return Promise.resolve({ 
        data: null, 
        error: { message: 'Invalid email or password' } 
      });
    },
    signOut: () => {
      localStorage.removeItem('supabase.auth.token');
      return Promise.resolve({ error: null });
    },
    getSession: () => {
      const stored = localStorage.getItem('supabase.auth.token');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          if (session.expires_at > Date.now()) {
            return Promise.resolve({ data: { session }, error: null });
          }
        } catch (e) {
          localStorage.removeItem('supabase.auth.token');
        }
      }
      return Promise.resolve({ data: { session: null }, error: null });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Check for existing session on load
      const stored = localStorage.getItem('supabase.auth.token');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          if (session.expires_at > Date.now()) {
            setTimeout(() => callback('SIGNED_IN', session), 0);
          }
        } catch (e) {
          localStorage.removeItem('supabase.auth.token');
        }
      }
      
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    }
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Database operations disabled' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Database operations disabled' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Database operations disabled' } })
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