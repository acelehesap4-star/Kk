import { supabase } from '@/lib/supabase';

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  description: string;
  createdAt: Date;
  processedBy?: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface CoinSystemStats {
  totalSupply: number;
  circulatingSupply: number;
  distributionRate: number;
  totalTransactions: number;
  activeUsers: number;
}

export class CoinSystem {
  private readonly TOTAL_SUPPLY = 100_000_000_000_000; // 100 Trilyon

  async getStats(): Promise<CoinSystemStats> {
    const { data: settings } = await supabase
      .from('system_settings')
      .select('value')
      .match({ key: 'coin_settings' })
      .single();

    const { data: transactions } = await supabase
      .from('coin_distribution_history')
      .select('amount');

    const circulatingSupply = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

    const { data: userCount } = await supabase
      .from('profiles')
      .select('id')
      .gt('coin_balance', 0);

    return {
      totalSupply: this.TOTAL_SUPPLY,
      circulatingSupply,
      distributionRate: (circulatingSupply / this.TOTAL_SUPPLY) * 100,
      totalTransactions: transactions?.length || 0,
      activeUsers: userCount?.length || 0
    };
  }

  async distributeCoins(
    userId: string,
    amount: number,
    description: string,
    adminId: string
  ): Promise<void> {
    const { error: transactionError } = await supabase.from('coin_distribution_history').insert([
      {
        user_id: userId,
        amount,
        transaction_type: 'credit',
        description,
        processed_by: adminId,
        status: 'completed',
        created_at: new Date().toISOString()
      }
    ]);

    if (transactionError) throw transactionError;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coin_balance: supabase.raw('coin_balance + ?', [amount]) })
      .match({ id: userId });

    if (updateError) throw updateError;
  }

  async getUserTransactions(userId: string): Promise<CoinTransaction[]> {
    const { data, error } = await supabase
      .from('coin_distribution_history')
      .select('*')
      .match({ user_id: userId })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      amount: tx.amount,
      transactionType: tx.transaction_type,
      description: tx.description,
      createdAt: new Date(tx.created_at),
      processedBy: tx.processed_by,
      txHash: tx.tx_hash,
      status: tx.status
    })) || [];
  }

  async getUserBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .select('coin_balance')
      .match({ id: userId })
      .single();

    if (error) throw error;
    return data?.coin_balance || 0;
  }

  async getRecentTransactions(limit: number = 10): Promise<CoinTransaction[]> {
    const { data, error } = await supabase
      .from('coin_distribution_history')
      .select(\`
        *,
        profiles:user_id (
          email
        )
      \`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data?.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      amount: tx.amount,
      transactionType: tx.transaction_type,
      description: tx.description,
      createdAt: new Date(tx.created_at),
      processedBy: tx.processed_by,
      txHash: tx.tx_hash,
      status: tx.status
    })) || [];
  }
}

export const coinSystem = new CoinSystem();