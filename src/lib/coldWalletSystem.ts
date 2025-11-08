import { supabase } from '@/lib/supabase';
import { coinSystem } from './coinSystem';

export interface ColdWalletSettings {
  networks: {
    [key: string]: {
      address: string;
      minAmount: number;
      coinRate: number;
    };
  };
  verificationConfirmations: {
    [key: string]: number;
  };
}

export interface ColdWalletTransaction {
  id: string;
  userId: string;
  walletAddress: string;
  network: string;
  amount: number;
  coinAmount: number;
  txHash?: string;
  status: 'pending' | 'verified' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  completedAt?: Date;
}

export class ColdWalletSystem {
  private settings: ColdWalletSettings | null = null;

  private async loadSettings(): Promise<ColdWalletSettings> {
    if (this.settings) return this.settings;

    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .match({ key: 'cold_wallet_settings' })
      .single();

    if (error) throw error;

    const settings: ColdWalletSettings = {
      networks: {},
      verificationConfirmations: {}
    };

    Object.entries(data.value.networks).forEach(([network, config]: [string, any]) => {
      settings.networks[network] = {
        address: config.address,
        minAmount: config.min_amount,
        coinRate: config.coin_rate
      };
    });

    settings.verificationConfirmations = data.value.verification_confirmations;
    this.settings = settings;

    return settings;
  }

  async getNetworkAddresses(): Promise<{ [key: string]: { address: string; minAmount: number; coinRate: number } }> {
    const settings = await this.loadSettings();
    return settings.networks;
  }

  async submitTransaction(
    userId: string,
    network: string,
    amount: number,
    walletAddress: string,
    txHash?: string
  ): Promise<ColdWalletTransaction> {
    // Doğrulama sistemini başlat
    const verificationSystem = PaymentVerificationSystem.getInstance();
    const settings = await this.loadSettings();
    const networkConfig = settings.networks[network];

    if (!networkConfig) {
      throw new Error(\`Geçersiz ağ: \${network}\`);
    }

    if (amount < networkConfig.minAmount) {
      throw new Error(\`Minimum miktar: \${networkConfig.minAmount} \${network}\`);
    }

    const coinAmount = Math.floor(amount * networkConfig.coinRate);

    const { data, error } = await supabase
      .from('cold_wallet_transactions')
      .insert([
        {
          user_id: userId,
          network,
          amount,
          coin_amount: coinAmount,
          wallet_address: walletAddress,
          tx_hash: txHash,
          status: txHash ? 'pending' : 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      walletAddress: data.wallet_address,
      network: data.network,
      amount: data.amount,
      coinAmount: data.coin_amount,
      txHash: data.tx_hash,
      status: data.status,
      adminNotes: data.admin_notes,
      createdAt: new Date(data.created_at),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      verifiedBy: data.verified_by,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined
    };
  }

  async verifyTransaction(
    transactionId: string,
    adminId: string,
    verified: boolean,
    notes?: string
  ): Promise<void> {
    const { data: transaction, error: fetchError } = await supabase
      .from('cold_wallet_transactions')
      .select('*')
      .match({ id: transactionId })
      .single();

    if (fetchError) throw fetchError;

    if (transaction.status !== 'pending') {
      throw new Error('Bu işlem zaten doğrulanmış veya reddedilmiş');
    }

    const updates = {
      status: verified ? 'verified' : 'rejected',
      verified_at: new Date().toISOString(),
      verified_by: adminId,
      admin_notes: notes
    };

    const { error: updateError } = await supabase
      .from('cold_wallet_transactions')
      .update(updates)
      .match({ id: transactionId });

    if (updateError) throw updateError;

    if (verified) {
      // Coinleri dağıt
      await coinSystem.distributeCoins(
        transaction.user_id,
        transaction.coin_amount,
        \`Soğuk cüzdan ödemesi: \${transaction.amount} \${transaction.network}\`,
        adminId
      );

      // İşlemi tamamlandı olarak işaretle
      await supabase
        .from('cold_wallet_transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .match({ id: transactionId });
    }
  }

  async getUserTransactions(userId: string): Promise<ColdWalletTransaction[]> {
    const { data, error } = await supabase
      .from('cold_wallet_transactions')
      .select('*')
      .match({ user_id: userId })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      walletAddress: tx.wallet_address,
      network: tx.network,
      amount: tx.amount,
      coinAmount: tx.coin_amount,
      txHash: tx.tx_hash,
      status: tx.status,
      adminNotes: tx.admin_notes,
      createdAt: new Date(tx.created_at),
      verifiedAt: tx.verified_at ? new Date(tx.verified_at) : undefined,
      verifiedBy: tx.verified_by,
      completedAt: tx.completed_at ? new Date(tx.completed_at) : undefined
    }));
  }

  async getPendingTransactions(): Promise<ColdWalletTransaction[]> {
    const { data, error } = await supabase
      .from('cold_wallet_transactions')
      .select(\`
        *,
        profiles:user_id (
          email
        )
      \`)
      .match({ status: 'pending' })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      walletAddress: tx.wallet_address,
      network: tx.network,
      amount: tx.amount,
      coinAmount: tx.coin_amount,
      txHash: tx.tx_hash,
      status: tx.status,
      adminNotes: tx.admin_notes,
      createdAt: new Date(tx.created_at),
      verifiedAt: tx.verified_at ? new Date(tx.verified_at) : undefined,
      verifiedBy: tx.verified_by,
      completedAt: tx.completed_at ? new Date(tx.completed_at) : undefined
    }));
  }
}

export const coldWalletSystem = new ColdWalletSystem();