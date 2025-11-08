import type { Payment, PaymentVerification, VerificationResult } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class PaymentVerificationSystem {
  private static instance: PaymentVerificationSystem;
  private verificationQueue: Map<string, NodeJS.Timeout>;
  private readonly VERIFICATION_INTERVAL = 60000; // 1 dakika
  private readonly MAX_RETRIES = 10;

  private constructor() {
    this.verificationQueue = new Map();
  }

  public static getInstance(): PaymentVerificationSystem {
    if (!PaymentVerificationSystem.instance) {
      PaymentVerificationSystem.instance = new PaymentVerificationSystem();
    }
    return PaymentVerificationSystem.instance;
  }

  public async startVerification(payment: Payment): Promise<void> {
    let retryCount = 0;

    const verify = async () => {
      try {
        const result = await this.verifyPayment(payment);

        if (result.success) {
          await this.processVerifiedPayment(payment.id, result.data!);
          this.stopVerification(payment.id);
          toast.success('Ödeme başarıyla doğrulandı');
        } else {
          retryCount++;
          
          if (retryCount >= this.MAX_RETRIES) {
            await this.markPaymentAsFailed(payment.id);
            this.stopVerification(payment.id);
            toast.error('Ödeme doğrulanamadı: Maximum deneme sayısına ulaşıldı');
          }
        }
      } catch (error) {
        console.error('Ödeme doğrulama hatası:', error);
      }
    };

    // İlk doğrulama denemesini hemen yap
    await verify();

    // Periyodik kontrolleri başlat
    const intervalId = setInterval(verify, this.VERIFICATION_INTERVAL);
    this.verificationQueue.set(payment.id, intervalId);
  }

  private async verifyPayment(payment: Payment): Promise<VerificationResult> {
    try {
      // Blockchain API'si ile işlem doğrulama
      const txData = await this.fetchTransactionData(payment.txHash!, payment.network);
      
      if (!txData) {
        return {
          success: false,
          message: 'İşlem bulunamadı'
        };
      }

      // İşlem detaylarını kontrol et
      const verification: PaymentVerification = {
        paymentId: payment.id,
        txHash: payment.txHash!,
        network: payment.network,
        amount: txData.amount,
        fromAddress: txData.from,
        toAddress: txData.to,
        timestamp: new Date(txData.timestamp)
      };

      // Doğrulama kriterlerini kontrol et
      const isValid = this.validateTransaction(payment, verification);

      return {
        success: isValid,
        message: isValid ? 'İşlem doğrulandı' : 'İşlem kriterleri karşılanmadı',
        data: isValid ? verification : undefined
      };

    } catch (error) {
      console.error('Doğrulama hatası:', error);
      return {
        success: false,
        message: 'Doğrulama sırasında bir hata oluştu'
      };
    }
  }

  private async fetchTransactionData(txHash: string, network: string): Promise<any> {
    // TODO: Blockchain API entegrasyonu
    // Örnek: EVM zincirleri için Etherscan API'si kullanılabilir
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: txHash,
          from: '0x1234...5678',
          to: '0x8765...4321',
          amount: 1000000,
          timestamp: Date.now(),
          status: 'success'
        });
      }, 1000);
    });
  }

  private validateTransaction(payment: Payment, verification: PaymentVerification): boolean {
    // Soğuk cüzdan adresini kontrol et
    if (verification.toAddress !== process.env.COLD_WALLET_ADDRESS) {
      return false;
    }

    // Miktar kontrolü
    if (verification.amount < payment.amount) {
      return false;
    }

    // Zaman aşımı kontrolü (24 saat)
    const timeDiff = Date.now() - verification.timestamp.getTime();
    if (timeDiff > 24 * 60 * 60 * 1000) {
      return false;
    }

    return true;
  }

  private async processVerifiedPayment(paymentId: string, verification: PaymentVerification): Promise<void> {
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (fetchError || !payment) {
      throw new Error('Ödeme bilgisi bulunamadı');
    }

    // Veritabanı işlemlerini transaction içinde yap
    const { data, error } = await supabase.rpc('verify_payment', {
      p_payment_id: paymentId,
      p_tx_hash: verification.txHash,
      p_verified_amount: verification.amount,
      p_from_address: verification.fromAddress
    });

    if (error) {
      throw new Error('Ödeme doğrulama işlemi başarısız: ' + error.message);
    }

    // WebSocket ile kullanıcıya bildirim gönder
    this.notifyUser(payment.userId, {
      type: 'payment_verified',
      paymentId: paymentId,
      amount: verification.amount
    });
  }

  private async markPaymentAsFailed(paymentId: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'failed', updatedAt: new Date().toISOString() })
      .eq('id', paymentId);

    if (error) {
      console.error('Ödeme durumu güncellenemedi:', error);
    }
  }

  private notifyUser(userId: string, notification: any): void {
    // WebSocket kanalına bildirim gönder
    supabase
      .channel('payment-notifications')
      .send({
        type: 'broadcast',
        event: 'payment_update',
        payload: notification
      });
  }

  public stopVerification(paymentId: string): void {
    const intervalId = this.verificationQueue.get(paymentId);
    if (intervalId) {
      clearInterval(intervalId);
      this.verificationQueue.delete(paymentId);
    }
  }

  public stopAllVerifications(): void {
    this.verificationQueue.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.verificationQueue.clear();
  }
}