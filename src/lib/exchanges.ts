import { Exchange } from '@/types/trading';

export const EXCHANGES = {
  BINANCE: {
    name: 'Binance',
    type: 'crypto',
    region: 'Global',
    volume24h: '$76.2B',
    pairs: 2000,
    fees: '0.1%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=${limit}`,
    depth: (symbol: string, limit = 10) =>
      `https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`,
    wsTrade: (symbol: string) =>
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`,
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'BNBUSDT', 'DOGEUSDT', 'XRPUSDT', 'MATICUSDT'],
  },
  OKX: {
    name: 'OKX',
    type: 'crypto',
    region: 'Global',
    volume24h: '$12.8B',
    pairs: 800,
    fees: '0.08%',
    restKlines: (symbol: string, limit = 500) =>
      `https://www.okx.com/api/v5/market/history-candles?instId=${symbol.toUpperCase()}&bar=1m&limit=${limit}`,
    depth: (symbol: string) =>
      `https://www.okx.com/api/v5/market/books?instId=${symbol.toUpperCase()}&sz=10`,
    wsBase: 'wss://ws.okx.com:8443/ws/v5/public',
    defaults: ['BTC-USDT', 'ETH-USDT', 'DOT-USDT', 'XRP-USDT', 'SOL-USDT', 'AVAX-USDT'],
  },
  KUCOIN: {
    name: 'KuCoin',
    type: 'crypto',
    region: 'Global',
    volume24h: '$8.4B',
    pairs: 1200,
    fees: '0.1%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.kucoin.com/api/v1/market/candles?symbol=${symbol.toUpperCase()}&type=1min`,
    depth: (symbol: string) =>
      `https://api.kucoin.com/api/v1/market/orderbook/level2_20?symbol=${symbol.toUpperCase()}`,
    wsBase: 'wss://ws-api-spot.kucoin.com/',
    defaults: ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'SOL-USDT', 'ADA-USDT', 'LINK-USDT'],
  },
  COINBASE: {
    name: 'Coinbase Pro',
    type: 'crypto',
    region: 'US/EU',
    volume24h: '$4.2B',
    pairs: 300,
    fees: '0.5%',
    restKlines: (symbol: string) => {
      const productId = symbol.toUpperCase().replace('USDT', '-USD');
      return `https://api.exchange.coinbase.com/products/${productId}/candles?granularity=60`;
    },
    depth: (symbol: string) => {
      const productId = symbol.toUpperCase().replace('USDT', '-USD');
      return `https://api.exchange.coinbase.com/products/${productId}/book?level=2`;
    },
    wsBase: 'wss://advanced-trade-ws.coinbase.com',
    defaults: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'DOT-USD'],
  },
  BYBIT: {
    name: 'Bybit',
    type: 'crypto',
    region: 'Global',
    volume24h: '$15.6B',
    pairs: 600,
    fees: '0.075%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol.toUpperCase()}&interval=1&limit=${limit}`,
    depth: (symbol: string) =>
      `https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${symbol.toUpperCase()}&limit=25`,
    wsBase: 'wss://stream.bybit.com/v5/public/spot',
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOTUSDT'],
  },
  KRAKEN: {
    name: 'Kraken',
    type: 'crypto',
    region: 'US/EU',
    volume24h: '$2.8B',
    pairs: 400,
    fees: '0.26%',
    restKlines: (symbol: string, limit = 500) => {
      const pair = symbol.toUpperCase().replace('USDT', 'USD');
      return `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=1`;
    },
    depth: (symbol: string) => {
      const pair = symbol.toUpperCase().replace('USDT', 'USD');
      return `https://api.kraken.com/0/public/Depth?pair=${pair}&count=25`;
    },
    wsBase: 'wss://ws.kraken.com',
    defaults: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD'],
  },
  HUOBI: {
    name: 'Huobi Global',
    type: 'crypto',
    region: 'Global',
    volume24h: '$3.2B',
    pairs: 800,
    fees: '0.2%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.huobi.pro/market/history/kline?symbol=${symbol.toLowerCase()}&period=1min&size=${limit}`,
    depth: (symbol: string) =>
      `https://api.huobi.pro/market/depth?symbol=${symbol.toLowerCase()}&depth=20&type=step0`,
    wsBase: 'wss://api.huobi.pro/ws',
    defaults: ['btcusdt', 'ethusdt', 'solusdt', 'xrpusdt', 'adausdt'],
  },
  GATE: {
    name: 'Gate.io',
    type: 'crypto',
    region: 'Global',
    volume24h: '$1.8B',
    pairs: 1500,
    fees: '0.2%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair=${symbol.toUpperCase()}&interval=1m&limit=${limit}`,
    depth: (symbol: string) =>
      `https://api.gateio.ws/api/v4/spot/order_book?currency_pair=${symbol.toUpperCase()}&limit=20`,
    wsBase: 'wss://api.gateio.ws/ws/v4/',
    defaults: ['BTC_USDT', 'ETH_USDT', 'SOL_USDT', 'XRP_USDT', 'ADA_USDT'],
  },
  MEXC: {
    name: 'MEXC Global',
    type: 'crypto',
    region: 'Global',
    volume24h: '$2.1B',
    pairs: 2500,
    fees: '0.2%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.mexc.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=${limit}`,
    depth: (symbol: string) =>
      `https://api.mexc.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=20`,
    wsBase: 'wss://wbs.mexc.com/ws',
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'],
  },
  BITGET: {
    name: 'Bitget',
    type: 'crypto',
    region: 'Global',
    volume24h: '$5.4B',
    pairs: 900,
    fees: '0.1%',
    restKlines: (symbol: string, limit = 500) =>
      `https://api.bitget.com/api/spot/v1/market/candles?symbol=${symbol.toUpperCase()}&period=1min&limit=${limit}`,
    depth: (symbol: string) =>
      `https://api.bitget.com/api/spot/v1/market/depth?symbol=${symbol.toUpperCase()}&limit=20&type=step0`,
    wsBase: 'wss://ws.bitget.com/spot/v1/stream',
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'],
  },
  NASDAQ: {
    name: 'NASDAQ',
    type: 'stocks',
    region: 'US',
    volume24h: '$180B',
    pairs: 4000,
    fees: '$0.005/share',
    restKlines: (symbol: string) =>
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/2023-01-01/2023-12-31?apikey=demo`,
    depth: (symbol: string) =>
      `https://api.polygon.io/v3/quotes/${symbol}?apikey=demo`,
    wsBase: 'wss://socket.polygon.io/stocks',
    defaults: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'],
  },
  NYSE: {
    name: 'New York Stock Exchange',
    type: 'stocks',
    region: 'US',
    volume24h: '$220B',
    pairs: 2800,
    fees: '$0.005/share',
    restKlines: (symbol: string) =>
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/2023-01-01/2023-12-31?apikey=demo`,
    depth: (symbol: string) =>
      `https://api.polygon.io/v3/quotes/${symbol}?apikey=demo`,
    wsBase: 'wss://socket.polygon.io/stocks',
    defaults: ['JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS'],
  },
  FOREX: {
    name: 'Forex Market',
    type: 'forex',
    region: 'Global',
    volume24h: '$7.5T',
    pairs: 180,
    fees: '0.1-3 pips',
    restKlines: (symbol: string) =>
      `https://api.fxpractice.oanda.com/v3/instruments/${symbol}/candles?granularity=M1&count=500`,
    depth: (symbol: string) =>
      `https://api.fxpractice.oanda.com/v3/instruments/${symbol}/orderBook`,
    wsBase: 'wss://stream-fxpractice.oanda.com/v3/accounts',
    defaults: ['EUR_USD', 'GBP_USD', 'USD_JPY', 'USD_CHF', 'AUD_USD', 'USD_CAD', 'NZD_USD'],
  },
  COMMODITIES: {
    name: 'Commodities Exchange',
    type: 'commodities',
    region: 'Global',
    volume24h: '$45B',
    pairs: 50,
    fees: '$2-5/contract',
    restKlines: (symbol: string) =>
      `https://api.marketdata.app/v1/stocks/candles/1/minute/${symbol}?from=2023-01-01&to=2023-12-31`,
    depth: (symbol: string) =>
      `https://api.marketdata.app/v1/stocks/quotes/${symbol}`,
    wsBase: 'wss://ws.marketdata.app/v1',
    defaults: ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'ZC=F', 'ZS=F', 'ZW=F'], // Gold, Silver, Oil, Gas, Corn, Soybeans, Wheat
  },
  CRYPTO_FUTURES: {
    name: 'Crypto Futures',
    type: 'futures',
    region: 'Global',
    volume24h: '$120B',
    pairs: 200,
    fees: '0.02-0.05%',
    restKlines: (symbol: string, limit = 500) =>
      `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=${limit}`,
    depth: (symbol: string) =>
      `https://fapi.binance.com/fapi/v1/depth?symbol=${symbol.toUpperCase()}&limit=20`,
    wsBase: 'wss://fstream.binance.com/ws',
    defaults: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOTUSDT'],
  },
} as const;

export function getExchangeDefaults(exchange: Exchange): string[] {
  return [...EXCHANGES[exchange].defaults];
}
