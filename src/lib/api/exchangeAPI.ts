import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';

export interface RealTimePrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface OrderBookData {
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>;
  timestamp: number;
}

export interface TradeData {
  id: string;
  price: number;
  quantity: number;
  timestamp: number;
  side: 'buy' | 'sell';
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class ExchangeAPI {
  private baseUrls: Record<Exchange, string> = {
    BINANCE: 'https://api.binance.com/api/v3',
    OKX: 'https://www.okx.com/api/v5',
    KUCOIN: 'https://api.kucoin.com/api/v1',
    COINBASE: 'https://api.exchange.coinbase.com',
    BYBIT: 'https://api.bybit.com/v5',
    KRAKEN: 'https://api.kraken.com/0',
    HUOBI: 'https://api.huobi.pro',
    GATE: 'https://api.gateio.ws/api/v4',
    MEXC: 'https://api.mexc.com/api/v3',
    BITGET: 'https://api.bitget.com/api/spot/v1',
    NASDAQ: 'https://api.polygon.io/v2',
    NYSE: 'https://api.polygon.io/v2',
    FOREX: 'https://api.fxpractice.oanda.com/v3',
    COMMODITIES: 'https://api.marketdata.app/v1',
    CRYPTO_FUTURES: 'https://fapi.binance.com/fapi/v1'
  };

  async getRealTimePrice(exchange: Exchange, symbol: string): Promise<RealTimePrice> {
    try {
      switch (exchange) {
        case 'BINANCE':
          return await this.getBinancePrice(symbol);
        case 'OKX':
          return await this.getOKXPrice(symbol);
        case 'KUCOIN':
          return await this.getKuCoinPrice(symbol);
        case 'COINBASE':
          return await this.getCoinbasePrice(symbol);
        case 'BYBIT':
          return await this.getBybitPrice(symbol);
        case 'KRAKEN':
          return await this.getKrakenPrice(symbol);
        case 'NASDAQ':
        case 'NYSE':
          return await this.getStockPrice(symbol);
        case 'FOREX':
          return await this.getForexPrice(symbol);
        case 'COMMODITIES':
          return await this.getCommodityPrice(symbol);
        default:
          throw new Error(`Exchange ${exchange} not supported`);
      }
    } catch (error) {
      console.error(`Error fetching price for ${symbol} on ${exchange}:`, error);
      throw error;
    }
  }

  private async getBinancePrice(symbol: string): Promise<RealTimePrice> {
    const response = await fetch(`${this.baseUrls.BINANCE}/ticker/24hr?symbol=${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Failed to fetch Binance price');
    
    const data = await response.json();
    return {
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      change24h: parseFloat(data.priceChangePercent),
      volume24h: parseFloat(data.volume),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      timestamp: Date.now()
    };
  }

  private async getOKXPrice(symbol: string): Promise<RealTimePrice> {
    const response = await fetch(`${this.baseUrls.OKX}/market/ticker?instId=${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Failed to fetch OKX price');
    
    const data = await response.json();
    const ticker = data.data[0];
    return {
      symbol: ticker.instId,
      price: parseFloat(ticker.last),
      change24h: parseFloat(ticker.changePercent) * 100,
      volume24h: parseFloat(ticker.vol24h),
      high24h: parseFloat(ticker.high24h),
      low24h: parseFloat(ticker.low24h),
      timestamp: Date.now()
    };
  }

  private async getKuCoinPrice(symbol: string): Promise<RealTimePrice> {
    const response = await fetch(`${this.baseUrls.KUCOIN}/market/stats?symbol=${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Failed to fetch KuCoin price');
    
    const data = await response.json();
    const ticker = data.data;
    return {
      symbol: ticker.symbol,
      price: parseFloat(ticker.last),
      change24h: parseFloat(ticker.changeRate) * 100,
      volume24h: parseFloat(ticker.vol),
      high24h: parseFloat(ticker.high),
      low24h: parseFloat(ticker.low),
      timestamp: Date.now()
    };
  }

  private async getCoinbasePrice(symbol: string): Promise<RealTimePrice> {
    const productId = symbol.toUpperCase().replace('USDT', '-USD');
    const response = await fetch(`${this.baseUrls.COINBASE}/products/${productId}/stats`);
    if (!response.ok) throw new Error('Failed to fetch Coinbase price');
    
    const data = await response.json();
    return {
      symbol: productId,
      price: parseFloat(data.last),
      change24h: ((parseFloat(data.last) - parseFloat(data.open)) / parseFloat(data.open)) * 100,
      volume24h: parseFloat(data.volume),
      high24h: parseFloat(data.high),
      low24h: parseFloat(data.low),
      timestamp: Date.now()
    };
  }

  private async getBybitPrice(symbol: string): Promise<RealTimePrice> {
    const response = await fetch(`${this.baseUrls.BYBIT}/market/tickers?category=spot&symbol=${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Failed to fetch Bybit price');
    
    const data = await response.json();
    const ticker = data.result.list[0];
    return {
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.price24hPcnt) * 100,
      volume24h: parseFloat(ticker.volume24h),
      high24h: parseFloat(ticker.highPrice24h),
      low24h: parseFloat(ticker.lowPrice24h),
      timestamp: Date.now()
    };
  }

  private async getKrakenPrice(symbol: string): Promise<RealTimePrice> {
    const pair = symbol.toUpperCase().replace('USDT', 'USD');
    const response = await fetch(`${this.baseUrls.KRAKEN}/public/Ticker?pair=${pair}`);
    if (!response.ok) throw new Error('Failed to fetch Kraken price');
    
    const data = await response.json();
    const pairKey = Object.keys(data.result)[0];
    const ticker = data.result[pairKey];
    
    return {
      symbol: pair,
      price: parseFloat(ticker.c[0]),
      change24h: ((parseFloat(ticker.c[0]) - parseFloat(ticker.o)) / parseFloat(ticker.o)) * 100,
      volume24h: parseFloat(ticker.v[1]),
      high24h: parseFloat(ticker.h[1]),
      low24h: parseFloat(ticker.l[1]),
      timestamp: Date.now()
    };
  }

  private async getStockPrice(symbol: string): Promise<RealTimePrice> {
    // Using Alpha Vantage API for stocks (free tier)
    const apiKey = 'demo'; // Replace with actual API key
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch stock price');
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change24h: parseFloat(quote['10. change percent'].replace('%', '')),
      volume24h: parseFloat(quote['06. volume']),
      high24h: parseFloat(quote['03. high']),
      low24h: parseFloat(quote['04. low']),
      timestamp: Date.now()
    };
  }

  private async getForexPrice(symbol: string): Promise<RealTimePrice> {
    // Using exchangerate-api for forex
    const [base, quote] = symbol.split('_');
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    if (!response.ok) throw new Error('Failed to fetch forex price');
    
    const data = await response.json();
    const rate = data.rates[quote];
    
    return {
      symbol: symbol,
      price: rate,
      change24h: Math.random() * 2 - 1, // Placeholder - would need historical data
      volume24h: 0, // Not available for forex
      high24h: rate * 1.01,
      low24h: rate * 0.99,
      timestamp: Date.now()
    };
  }

  private async getCommodityPrice(symbol: string): Promise<RealTimePrice> {
    // Using marketdata.app for commodities
    const response = await fetch(`https://api.marketdata.app/v1/stocks/quotes/${symbol}/`);
    if (!response.ok) throw new Error('Failed to fetch commodity price');
    
    const data = await response.json();
    
    return {
      symbol: symbol,
      price: data.last,
      change24h: data.change_percent,
      volume24h: data.volume,
      high24h: data.high,
      low24h: data.low,
      timestamp: Date.now()
    };
  }

  // WebSocket connections for real-time data
  createWebSocketConnection(exchange: Exchange, symbol: string, onMessage: (data: any) => void): WebSocket | null {
    try {
      switch (exchange) {
        case 'BINANCE':
          return this.createBinanceWebSocket(symbol, onMessage);
        case 'OKX':
          return this.createOKXWebSocket(symbol, onMessage);
        case 'KUCOIN':
          return this.createKuCoinWebSocket(symbol, onMessage);
        default:
          console.warn(`WebSocket not supported for ${exchange}`);
          return null;
      }
    } catch (error) {
      console.error(`Error creating WebSocket for ${symbol} on ${exchange}:`, error);
      return null;
    }
  }

  private createBinanceWebSocket(symbol: string, onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage({
        symbol: data.s,
        price: parseFloat(data.c),
        change24h: parseFloat(data.P),
        volume24h: parseFloat(data.v),
        high24h: parseFloat(data.h),
        low24h: parseFloat(data.l),
        timestamp: Date.now()
      });
    };
    return ws;
  }

  private createOKXWebSocket(symbol: string, onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [{
          channel: 'tickers',
          instId: symbol.toUpperCase()
        }]
      }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data) {
        const ticker = data.data[0];
        onMessage({
          symbol: ticker.instId,
          price: parseFloat(ticker.last),
          change24h: parseFloat(ticker.changePercent) * 100,
          volume24h: parseFloat(ticker.vol24h),
          high24h: parseFloat(ticker.high24h),
          low24h: parseFloat(ticker.low24h),
          timestamp: Date.now()
        });
      }
    };
    return ws;
  }

  private createKuCoinWebSocket(symbol: string, onMessage: (data: any) => void): WebSocket {
    // KuCoin requires token-based WebSocket connection
    // This is a simplified version - in production, you'd need to get a token first
    const ws = new WebSocket('wss://ws-api-spot.kucoin.com/');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: Date.now(),
        type: 'subscribe',
        topic: `/market/ticker:${symbol.toUpperCase()}`,
        response: true
      }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.data) {
        const ticker = data.data;
        onMessage({
          symbol: ticker.symbol,
          price: parseFloat(ticker.price),
          change24h: parseFloat(ticker.changeRate) * 100,
          volume24h: parseFloat(ticker.vol),
          timestamp: Date.now()
        });
      }
    };
    return ws;
  }
}

export const exchangeAPI = new ExchangeAPI();