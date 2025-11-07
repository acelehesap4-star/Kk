import { supabase } from '@/integrations/supabase/client';
import { Exchange } from '@/types/trading';

export interface UserProfile {
  id: string;
  email: string;
  nxt_balance: number;
  total_trades: number;
  total_volume: number;
  total_commission_paid: number;
  created_at: string;
  updated_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  network: string;
  crypto_amount: string;
  nxt_amount: number;
  wallet_address: string;
  tx_hash: string;
  status: 'pending' | 'confirmed' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TradingOrder {
  id: string;
  user_id: string;
  exchange: Exchange;
  symbol: string;
  side: 'buy' | 'sell';
  order_type: 'market' | 'limit';
  amount: number;
  price: number;
  total: number;
  commission: number;
  nxt_used: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filled_amount?: number;
  filled_price?: number;
  created_at: string;
  updated_at: string;
}

export interface TradingSignal {
  id: string;
  exchange: Exchange;
  symbol: string;
  signal_type: 'buy' | 'sell' | 'hold';
  confidence: number;
  target_price: number;
  stop_loss: number;
  reasoning: string;
  ai_generated: boolean;
  created_at: string;
  expires_at: string;
}

export interface ArbitrageOpportunity {
  id: string;
  symbol: string;
  buy_exchange: Exchange;
  sell_exchange: Exchange;
  buy_price: number;
  sell_price: number;
  profit_percentage: number;
  volume_available: number;
  created_at: string;
  expires_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact_score: number;
  related_symbols: string[];
  created_at: string;
}

class SupabaseAPI {
  // User Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  }

  async updateNXTBalance(userId: string, amount: number, operation: 'add' | 'subtract'): Promise<boolean> {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nxt_balance')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const newBalance = operation === 'add' 
      ? profile.nxt_balance + amount 
      : profile.nxt_balance - amount;

    if (newBalance < 0) return false; // Insufficient balance

    return await this.updateUserProfile(userId, { nxt_balance: newBalance });
  }

  // Token Transactions
  async createTokenTransaction(transaction: Omit<TokenTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('token_transactions')
      .insert({
        ...transaction,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating token transaction:', error);
      return null;
    }

    return data.id;
  }

  async getTokenTransactions(userId?: string, status?: string): Promise<TokenTransaction[]> {
    let query = supabase.from('token_transactions').select('*');

    if (userId) query = query.eq('user_id', userId);
    if (status) query = query.eq('status', status);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching token transactions:', error);
      return [];
    }

    return data || [];
  }

  async updateTokenTransactionStatus(
    transactionId: string, 
    status: 'confirmed' | 'rejected', 
    adminNotes?: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from('token_transactions')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (error) {
      console.error('Error updating token transaction:', error);
      return false;
    }

    // If confirmed, add NXT to user balance
    if (status === 'confirmed') {
      const { data: transaction } = await supabase
        .from('token_transactions')
        .select('user_id, nxt_amount')
        .eq('id', transactionId)
        .single();

      if (transaction) {
        await this.updateNXTBalance(transaction.user_id, transaction.nxt_amount, 'add');
      }
    }

    return true;
  }

  // Trading Orders
  async createTradingOrder(order: Omit<TradingOrder, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    // Check if user has sufficient NXT balance
    const profile = await this.getUserProfile(order.user_id);
    if (!profile || profile.nxt_balance < order.nxt_used) {
      return null; // Insufficient balance
    }

    // Deduct NXT from user balance
    await this.updateNXTBalance(order.user_id, order.nxt_used, 'subtract');

    const { data, error } = await supabase
      .from('trading_orders')
      .insert({
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating trading order:', error);
      // Refund NXT if order creation failed
      await this.updateNXTBalance(order.user_id, order.nxt_used, 'add');
      return null;
    }

    // Update user stats
    await this.updateUserProfile(order.user_id, {
      total_trades: (profile.total_trades || 0) + 1,
      total_volume: (profile.total_volume || 0) + order.total,
      total_commission_paid: (profile.total_commission_paid || 0) + order.commission
    });

    return data.id;
  }

  async getTradingOrders(userId?: string, exchange?: Exchange): Promise<TradingOrder[]> {
    let query = supabase.from('trading_orders').select('*');

    if (userId) query = query.eq('user_id', userId);
    if (exchange) query = query.eq('exchange', exchange);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trading orders:', error);
      return [];
    }

    return data || [];
  }

  async updateTradingOrderStatus(
    orderId: string, 
    status: 'filled' | 'cancelled' | 'rejected',
    filledAmount?: number,
    filledPrice?: number
  ): Promise<boolean> {
    const { error } = await supabase
      .from('trading_orders')
      .update({
        status,
        filled_amount: filledAmount,
        filled_price: filledPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating trading order:', error);
      return false;
    }

    return true;
  }

  // Trading Signals
  async createTradingSignal(signal: Omit<TradingSignal, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('trading_signals')
      .insert({
        ...signal,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating trading signal:', error);
      return null;
    }

    return data.id;
  }

  async getTradingSignals(exchange?: Exchange, symbol?: string): Promise<TradingSignal[]> {
    let query = supabase
      .from('trading_signals')
      .select('*')
      .gt('expires_at', new Date().toISOString());

    if (exchange) query = query.eq('exchange', exchange);
    if (symbol) query = query.eq('symbol', symbol);

    query = query.order('confidence', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trading signals:', error);
      return [];
    }

    return data || [];
  }

  // Arbitrage Opportunities
  async createArbitrageOpportunity(opportunity: Omit<ArbitrageOpportunity, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('arbitrage_opportunities')
      .insert({
        ...opportunity,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating arbitrage opportunity:', error);
      return null;
    }

    return data.id;
  }

  async getArbitrageOpportunities(symbol?: string): Promise<ArbitrageOpportunity[]> {
    let query = supabase
      .from('arbitrage_opportunities')
      .select('*')
      .gt('expires_at', new Date().toISOString());

    if (symbol) query = query.eq('symbol', symbol);

    query = query.order('profit_percentage', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching arbitrage opportunities:', error);
      return [];
    }

    return data || [];
  }

  // News and Sentiment
  async createNewsItem(news: Omit<NewsItem, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('news_items')
      .insert({
        ...news,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating news item:', error);
      return null;
    }

    return data.id;
  }

  async getNewsItems(symbols?: string[], limit: number = 50): Promise<NewsItem[]> {
    let query = supabase
      .from('news_items')
      .select('*');

    if (symbols && symbols.length > 0) {
      query = query.overlaps('related_symbols', symbols);
    }

    query = query
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news items:', error);
      return [];
    }

    return data || [];
  }

  // Analytics and Statistics
  async getPlatformStats(): Promise<any> {
    const [
      { count: totalUsers },
      { count: totalTransactions },
      { count: totalOrders },
      { data: volumeData }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('token_transactions').select('*', { count: 'exact', head: true }),
      supabase.from('trading_orders').select('*', { count: 'exact', head: true }),
      supabase.from('trading_orders').select('total').eq('status', 'filled')
    ]);

    const totalVolume = volumeData?.reduce((sum, order) => sum + order.total, 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalTransactions: totalTransactions || 0,
      totalOrders: totalOrders || 0,
      totalVolume: totalVolume,
      timestamp: new Date().toISOString()
    };
  }

  async getUserTradingStats(userId: string): Promise<any> {
    const [
      { data: orders },
      { data: profile }
    ] = await Promise.all([
      supabase.from('trading_orders').select('*').eq('user_id', userId),
      supabase.from('user_profiles').select('*').eq('id', userId).single()
    ]);

    const filledOrders = orders?.filter(order => order.status === 'filled') || [];
    const totalPnL = filledOrders.reduce((sum, order) => {
      // Simplified P&L calculation - in reality, you'd need current prices
      return sum + (order.side === 'buy' ? -order.total : order.total);
    }, 0);

    return {
      totalOrders: orders?.length || 0,
      filledOrders: filledOrders.length,
      totalVolume: profile?.data?.total_volume || 0,
      totalCommissionPaid: profile?.data?.total_commission_paid || 0,
      estimatedPnL: totalPnL,
      nxtBalance: profile?.data?.nxt_balance || 0
    };
  }

  // Real-time subscriptions
  subscribeToTokenTransactions(callback: (payload: any) => void) {
    return supabase
      .channel('token_transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'token_transactions' }, 
        callback
      )
      .subscribe();
  }

  subscribeToPriceAlerts(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`price_alerts_${userId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'price_alerts', filter: `user_id=eq.${userId}` }, 
        callback
      )
      .subscribe();
  }
}

export const supabaseAPI = new SupabaseAPI();