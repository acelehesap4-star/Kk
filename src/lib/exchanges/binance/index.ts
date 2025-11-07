import { Spot } from '@binance/connector';
import { WebSocket } from 'ws';
import { supabase } from '@/integrations/supabase/client';

interface BinanceConfig {
  apiKey: string;
  apiSecret: string;
  baseURL?: string;
  wsURL?: string;
}

class BinanceService {
  private client: Spot;
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, WebSocket> = new Map();

  constructor(config: BinanceConfig) {
    this.client = new Spot(config.apiKey, config.apiSecret, {
      baseURL: config.baseURL || 'https://api.binance.com',
      wsURL: config.wsURL || 'wss://stream.binance.com:9443'
    });
  }

  // Market Data Methods
  async getKlines(symbol: string, interval: string, limit = 500) {
    try {
      const { data } = await this.client.klines(symbol, interval, { limit });
      return data.map((k: any[]) => ({
        timestamp: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));
    } catch (error) {
      console.error('Binance getKlines error:', error);
      throw error;
    }
  }

  async getOrderBook(symbol: string, limit = 100) {
    try {
      const { data } = await this.client.depth(symbol, { limit });
      return {
        bids: data.bids.map((b: string[]) => ({ price: parseFloat(b[0]), quantity: parseFloat(b[1]) })),
        asks: data.asks.map((a: string[]) => ({ price: parseFloat(a[0]), quantity: parseFloat(a[1]) }))
      };
    } catch (error) {
      console.error('Binance getOrderBook error:', error);
      throw error;
    }
  }

  // Trading Methods
  async placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'LIMIT' | 'MARKET';
    quantity: number;
    price?: number;
  }) {
    try {
      const { symbol, side, type, quantity, price } = params;
      const orderParams: any = { symbol, side, type, quantity };
      
      if (type === 'LIMIT' && price) {
        orderParams.price = price;
        orderParams.timeInForce = 'GTC';
      }

      const { data } = await this.client.newOrder(orderParams);
      
      // Save order to Supabase
      await supabase.from('orders').insert({
        exchange: 'BINANCE',
        symbol,
        side,
        type,
        quantity,
        price: price || null,
        status: data.status,
        order_id: data.orderId,
        client_order_id: data.clientOrderId,
      });

      return data;
    } catch (error) {
      console.error('Binance placeOrder error:', error);
      throw error;
    }
  }

  // WebSocket Methods
  subscribeTicker(symbol: string, callback: (data: any) => void) {
    const ws = new WebSocket(`${this.client.wsURL}/ws/${symbol.toLowerCase()}@ticker`);
    
    ws.on('message', (data: string) => {
      try {
        const tickerData = JSON.parse(data);
        callback(tickerData);
      } catch (error) {
        console.error('Binance ticker websocket error:', error);
      }
    });

    this.subscriptions.set(`ticker_${symbol}`, ws);
    return () => this.unsubscribe(`ticker_${symbol}`);
  }

  subscribeKlines(symbol: string, interval: string, callback: (data: any) => void) {
    const ws = new WebSocket(`${this.client.wsURL}/ws/${symbol.toLowerCase()}@kline_${interval}`);
    
    ws.on('message', (data: string) => {
      try {
        const klineData = JSON.parse(data);
        callback(klineData);
      } catch (error) {
        console.error('Binance kline websocket error:', error);
      }
    });

    this.subscriptions.set(`kline_${symbol}_${interval}`, ws);
    return () => this.unsubscribe(`kline_${symbol}_${interval}`);
  }

  private unsubscribe(key: string) {
    const ws = this.subscriptions.get(key);
    if (ws) {
      ws.close();
      this.subscriptions.delete(key);
    }
  }

  // Account Methods
  async getAccountInfo() {
    try {
      const { data } = await this.client.account();
      return data;
    } catch (error) {
      console.error('Binance getAccountInfo error:', error);
      throw error;
    }
  }

  async getOpenOrders(symbol?: string) {
    try {
      const { data } = await this.client.openOrders({ symbol });
      return data;
    } catch (error) {
      console.error('Binance getOpenOrders error:', error);
      throw error;
    }
  }

  // Advanced Order Types
  async placeStopLossOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    stopPrice: number;
  }) {
    try {
      const { symbol, side, quantity, stopPrice } = params;
      const { data } = await this.client.newOrder({
        symbol,
        side,
        type: 'STOP_LOSS',
        quantity,
        stopPrice,
        timeInForce: 'GTC'
      });

      await supabase.from('orders').insert({
        exchange: 'BINANCE',
        symbol,
        side,
        type: 'STOP_LOSS',
        quantity,
        stop_price: stopPrice,
        status: data.status,
        order_id: data.orderId,
        client_order_id: data.clientOrderId,
      });

      return data;
    } catch (error) {
      console.error('Binance placeStopLossOrder error:', error);
      throw error;
    }
  }

  async placeIcebergOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    icebergQty: number;
  }) {
    try {
      const { symbol, side, quantity, price, icebergQty } = params;
      const { data } = await this.client.newOrder({
        symbol,
        side,
        type: 'LIMIT',
        quantity,
        price,
        icebergQty,
        timeInForce: 'GTC'
      });

      await supabase.from('orders').insert({
        exchange: 'BINANCE',
        symbol,
        side,
        type: 'ICEBERG',
        quantity,
        price,
        iceberg_qty: icebergQty,
        status: data.status,
        order_id: data.orderId,
        client_order_id: data.clientOrderId,
      });

      return data;
    } catch (error) {
      console.error('Binance placeIcebergOrder error:', error);
      throw error;
    }
  }

  async placeOCOOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    stopPrice: number;
    stopLimitPrice: number;
  }) {
    try {
      const { symbol, side, quantity, price, stopPrice, stopLimitPrice } = params;
      const { data } = await this.client.orderOco({
        symbol,
        side,
        quantity,
        price,
        stopPrice,
        stopLimitPrice,
      });

      await supabase.from('orders').insert({
        exchange: 'BINANCE',
        symbol,
        side,
        type: 'OCO',
        quantity,
        price,
        stop_price: stopPrice,
        stop_limit_price: stopLimitPrice,
        status: data.orderReports[0].status,
        order_id: data.orderListId,
        client_order_id: data.orderReports[0].clientOrderId,
      });

      return data;
    } catch (error) {
      console.error('Binance placeOCOOrder error:', error);
      throw error;
    }
  }
}

// Create and export Binance service instance
export const binance = new BinanceService({
  apiKey: import.meta.env.VITE_BINANCE_API_KEY || '',
  apiSecret: import.meta.env.VITE_BINANCE_SECRET_KEY || '',
});