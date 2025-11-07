import api from 'kucoin-node-sdk';
import { WebSocket } from 'ws';
import { supabase } from '@/integrations/supabase/client';

interface KuCoinConfig {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  environment?: string;
}

class KuCoinService {
  private wsEndpoint: string;

  constructor(config: KuCoinConfig) {
    api.init({
      apiKey: config.apiKey,
      secretKey: config.apiSecret,
      passphrase: config.passphrase,
      environment: config.environment || 'live',
    });

    this.wsEndpoint = config.environment === 'sandbox' 
      ? 'wss://push-sandbox.kucoin.com/endpoint'
      : 'wss://push.kucoin.com/endpoint';
  }

  // Market Data Methods
  async getKlines(symbol: string, type: string, startAt?: number, endAt?: number) {
    try {
      const { data } = await api.rest.Market.Kline.getKlines(symbol, type, { startAt, endAt });
      return data.map((k: any[]) => ({
        timestamp: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));
    } catch (error) {
      console.error('KuCoin getKlines error:', error);
      throw error;
    }
  }

  async getOrderBook(symbol: string) {
    try {
      const { data } = await api.rest.Market.OrderBook.getLevel2(symbol);
      return {
        bids: data.bids.map((b: string[]) => ({ price: parseFloat(b[0]), quantity: parseFloat(b[1]) })),
        asks: data.asks.map((a: string[]) => ({ price: parseFloat(a[0]), quantity: parseFloat(a[1]) }))
      };
    } catch (error) {
      console.error('KuCoin getOrderBook error:', error);
      throw error;
    }
  }

  // Trading Methods
  async placeOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    size: string;
    price?: string;
  }) {
    try {
      const { data } = await api.rest.Trade.Orders.postOrder(params);
      
      await supabase.from('orders').insert({
        exchange: 'KUCOIN',
        symbol: params.symbol,
        side: params.side.toUpperCase(),
        type: params.type.toUpperCase(),
        quantity: parseFloat(params.size),
        price: params.price ? parseFloat(params.price) : null,
        status: 'NEW',
        order_id: data.orderId,
      });

      return data;
    } catch (error) {
      console.error('KuCoin placeOrder error:', error);
      throw error;
    }
  }

  // WebSocket Methods
  async getWsToken() {
    try {
      const { data } = await api.rest.WebSocket.getPublicToken();
      return data;
    } catch (error) {
      console.error('KuCoin getWsToken error:', error);
      throw error;
    }
  }

  async subscribeMarket(topic: string, callback: (data: any) => void) {
    try {
      const token = await this.getWsToken();
      const ws = new WebSocket(`${this.wsEndpoint}?token=${token.token}`);
      
      ws.on('open', () => {
        ws.send(JSON.stringify({
          id: Date.now(),
          type: 'subscribe',
          topic: `/market/${topic}`,
          privateChannel: false,
          response: true
        }));
      });

      ws.on('message', (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'message') {
            callback(parsed.data);
          }
        } catch (error) {
          console.error('KuCoin websocket message error:', error);
        }
      });

      return ws;
    } catch (error) {
      console.error('KuCoin subscribeMarket error:', error);
      throw error;
    }
  }

  // Account Methods
  async getAccountList(type?: string) {
    try {
      const { data } = await api.rest.User.Account.getAccountList(type);
      return data;
    } catch (error) {
      console.error('KuCoin getAccountList error:', error);
      throw error;
    }
  }

  async getOpenOrders(params?: { symbol?: string; side?: string; type?: string; }) {
    try {
      const { data } = await api.rest.Trade.Orders.getOrdersList({ ...params, status: 'active' });
      return data.items;
    } catch (error) {
      console.error('KuCoin getOpenOrders error:', error);
      throw error;
    }
  }

  // Advanced Order Types
  async placeStopOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    size: string;
    stopPrice: string;
    price?: string;
  }) {
    try {
      const { data } = await api.rest.Trade.Orders.postStopOrder(params);
      
      await supabase.from('orders').insert({
        exchange: 'KUCOIN',
        symbol: params.symbol,
        side: params.side.toUpperCase(),
        type: 'STOP',
        quantity: parseFloat(params.size),
        price: params.price ? parseFloat(params.price) : null,
        stop_price: parseFloat(params.stopPrice),
        status: 'NEW',
        order_id: data.orderId,
      });

      return data;
    } catch (error) {
      console.error('KuCoin placeStopOrder error:', error);
      throw error;
    }
  }

  async placeIcebergOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    size: string;
    price: string;
    visibleSize: string;
  }) {
    try {
      const { data } = await api.rest.Trade.Orders.postIcebergOrder(params);
      
      await supabase.from('orders').insert({
        exchange: 'KUCOIN',
        symbol: params.symbol,
        side: params.side.toUpperCase(),
        type: 'ICEBERG',
        quantity: parseFloat(params.size),
        price: parseFloat(params.price),
        visible_size: parseFloat(params.visibleSize),
        status: 'NEW',
        order_id: data.orderId,
      });

      return data;
    } catch (error) {
      console.error('KuCoin placeIcebergOrder error:', error);
      throw error;
    }
  }
}

// Create and export KuCoin service instance
export const kucoin = new KuCoinService({
  apiKey: import.meta.env.VITE_KUCOIN_API_KEY || '',
  apiSecret: import.meta.env.VITE_KUCOIN_SECRET_KEY || '',
  passphrase: import.meta.env.VITE_KUCOIN_PASSPHRASE || '',
  environment: import.meta.env.VITE_KUCOIN_ENVIRONMENT || 'live',
});