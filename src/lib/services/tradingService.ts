import { supabase } from '@/lib/supabase';
import { MARKET_TYPES } from '@/lib/config/marketConfig';
import { apiConfig } from '@/lib/config/apiConfig';
import { binanceService } from './exchanges/binanceService';
import { forexService } from './exchanges/forexService';
import { stocksService } from './exchanges/stocksService';

export interface Order {
  id?: string;
  userId: string;
  marketType: keyof typeof MARKET_TYPES;
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  triggerPrice?: number;
  exchange: string;
}

export interface Position {
  id?: string;
  userId: string;
  marketType: keyof typeof MARKET_TYPES;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  exchange: string;
}

class TradingService {
  private getExchangeService(marketType: keyof typeof MARKET_TYPES) {
    switch (marketType) {
      case 'CRYPTO':
        return binanceService;
      case 'FOREX':
        return forexService;
      case 'STOCKS':
      case 'INDICES':
        return stocksService;
      default:
        throw new Error('Unsupported market type');
    }
  }

  async placeOrder(order: Order) {
    if (!apiConfig.trading.enableRealTrading) {
      throw new Error('Gerçek işlem modu etkin değil');
    }
    
    try {
      // Bakiye kontrolü
      const balance = await this.getBalance(order.userId, order.marketType, this.getQuoteCurrency(order.symbol));
      
      if (!balance || balance.free_balance < (order.price || 0) * order.quantity) {
        throw new Error('Yetersiz bakiye');
      }
      
      // Gerçek emri yolla
      const exchangeService = this.getExchangeService(order.marketType);
      const result = await exchangeService.placeOrder(order);
      
      // Başarılı emri veritabanına kaydet
      await supabase
        .from('trading_orders')
        .insert({
          user_id: order.userId,
          market_type: order.marketType,
          symbol: order.symbol,
          side: order.side,
          order_type: order.orderType,
          quantity: order.quantity,
          price: order.price,
          status: 'filled',
          exchange: this.getExchangeName(order.marketType)
        });
      
      return result;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  private getQuoteCurrency(symbol: string): string {
    return symbol.split('/')[1] || 'USDT';
  }

  private getExchangeName(marketType: keyof typeof MARKET_TYPES): string {
    switch (marketType) {
      case 'CRYPTO':
        return 'BINANCE';
      case 'FOREX':
        return 'OANDA';
      case 'STOCKS':
      case 'INDICES':
        return 'FINNHUB';
      default:
        return 'UNKNOWN';
    }
  }

  async getPositions(userId: string, marketType?: keyof typeof MARKET_TYPES) {
    try {
      let query = supabase
        .from('trading_positions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'open');

      if (marketType) {
        query = query.eq('market_type', marketType.toLowerCase());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting positions:', error);
      throw error;
    }
  }

  async getBalance(userId: string, marketType: keyof typeof MARKET_TYPES, asset: string) {
    try {
      const { data, error } = await supabase
        .from('real_balances')
        .select('*')
        .eq('user_id', userId)
        .eq('market_type', marketType.toLowerCase())
        .eq('asset', asset)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getMarketData(marketType: keyof typeof MARKET_TYPES, symbol: string) {
    try {
      const { data: cachedData } = await supabase
        .from('market_data')
        .select('*')
        .eq('symbol', symbol)
        .eq('market_type', marketType)
        .order('last_update', { ascending: false })
        .limit(1)
        .single();

      // Önbellekteki veri 10 saniyeden yeniyse kullan
      if (cachedData && Date.now() - new Date(cachedData.last_update).getTime() < 10000) {
        return cachedData;
      }

      // Gerçek zamanlı veriyi al
      const exchangeService = this.getExchangeService(marketType);
      const marketData = await exchangeService.getMarketData(symbol);
      
      // Veriyi önbelleğe kaydet
      await supabase
        .from('market_data')
        .insert({
          symbol,
          market_type: marketType,
          price: marketData.price,
          high_24h: marketData.high24h,
          low_24h: marketData.low24h,
          volume_24h: marketData.volume24h,
          change_24h: marketData.change24h,
          last_update: new Date().toISOString()
        });

      return marketData;
    } catch (error) {
      console.error('Error getting market data:', error);
      throw error;
    }
  }
}

export const tradingService = new TradingService();