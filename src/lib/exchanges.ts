import { Exchange } from '@/types/trading';

export const EXCHANGES = {
  BINANCE: {
    name: 'Binance',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=${limit}`,
    depth: (symbol: string, limit = 10) =>
      `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`,
    wsTrade: (symbol: string) =>
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`,
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'BNBUSDT'],
  },
  OKX: {
    name: 'OKX',
    restKlines: (symbol: string, limit = 500) =>
      `https://www.okx.com/api/v5/market/history-candles?instId=${symbol.toUpperCase()}&bar=1m&limit=${limit}`,
    depth: (symbol: string) =>
      `https://www.okx.com/api/v5/market/books?instId=${symbol.toUpperCase()}&sz=10`,
    wsBase: 'wss://ws.okx.com:8443/ws/v5/public',
    defaults: ['BTC-USDT', 'ETH-USDT', 'DOT-USDT', 'XRP-USDT'],
  },
  KUCOIN: {
    name: 'KuCoin',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.kucoin.com/api/v1/market/candles?symbol=${symbol.toUpperCase()}&type=1min`,
    depth: (symbol: string) =>
      `https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=${symbol.toUpperCase()}`,
    wsBase: 'wss://ws-api-spot.kucoin.com/',
    defaults: ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'SOL-USDT'],
  },
  COINBASE: {
    name: 'Coinbase',
    restKlines: (symbol: string) => {
      const productId = symbol.toUpperCase().replace('USDT', '-USD');
      return `https://api.exchange.coinbase.com/products/${productId}/candles?granularity=60`;
    },
    depth: (symbol: string) => {
      const productId = symbol.toUpperCase().replace('USDT', '-USD');
      return `https://api.exchange.coinbase.com/products/${productId}/book?level=2`;
    },
    wsBase: 'wss://advanced-trade-ws.coinbase.com',
    defaults: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
  },
} as const;

export function getExchangeDefaults(exchange: Exchange): string[] {
  return [...EXCHANGES[exchange].defaults];
}
