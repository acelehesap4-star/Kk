import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const executeTrade = async ({
  userId,
  marketType,
  symbol,
  exchange,
  side,
  orderType,
  quantity,
  price,
}: {
  userId: string;
  marketType: string;
  symbol: string;
  exchange: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
}) => {
  try {
    // API anahtarlarını al
    const { data: keys, error: keysError } = await supabase
      .from('exchange_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('exchange', exchange)
      .single();

    if (keysError) throw keysError;
    if (!keys) throw new Error('API anahtarları bulunamadı');

    // İşlemi gerçekleştir
    const { data: order, error } = await supabase
      .rpc('execute_trade', {
        market_type: marketType,
        symbol,
        exchange,
        side,
        order_type: orderType,
        quantity,
        price,
        api_key: keys.api_key,
        api_secret: keys.api_secret
      });

    if (error) throw error;
    
    toast.success(`${side.toUpperCase()} emri başarıyla gerçekleştirildi`);
    return order;
  } catch (error) {
    console.error('Trade execution error:', error);
    toast.error('İşlem gerçekleştirilemedi');
    throw error;
  }
};