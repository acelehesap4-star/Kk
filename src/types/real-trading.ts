import { User } from '@supabase/supabase-js';

export interface RealTradingTerminalProps {
  user: User;
}

export type MarketType = 'crypto' | 'stocks' | 'forex' | 'commodities' | 'indices';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: string;
  high: number;
  low: number;
  exchange: string;
}

export interface Position {
  id: number;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPercent: number;
}

export interface Order {
  id: number;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled';
  time: string;
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface ExchangeInfo {
  id: string;
  name: string;
}

export const MARKET_TYPES = {
  crypto: 'Kripto',
  stocks: 'Hisse Senedi',
  forex: 'Forex',
  commodities: 'Emtia',
  indices: 'Endeks'
} as const;

export const SUPPORTED_EXCHANGES: Record<MarketType, ExchangeInfo[]> = {
  crypto: [
    { id: 'binance', name: 'Binance' },
    { id: 'huobi', name: 'Huobi' },
    { id: 'kucoin', name: 'KuCoin' },
    { id: 'bybit', name: 'Bybit' },
    { id: 'okx', name: 'OKX' },
  ],
  stocks: [
    { id: 'nasdaq', name: 'NASDAQ' },
    { id: 'nyse', name: 'NYSE' },
    { id: 'bist', name: 'Borsa İstanbul' },
    { id: 'lse', name: 'London Stock Exchange' },
  ],
  forex: [
    { id: 'fxcm', name: 'FXCM' },
    { id: 'oanda', name: 'OANDA' },
    { id: 'ig', name: 'IG' },
  ],
  commodities: [
    { id: 'cme', name: 'CME Group' },
    { id: 'ice', name: 'ICE' },
    { id: 'lme', name: 'London Metal Exchange' },
  ],
  indices: [
    { id: 'sp500', name: 'S&P 500' },
    { id: 'nasdaq100', name: 'NASDAQ 100' },
    { id: 'dax', name: 'DAX' },
    { id: 'ftse', name: 'FTSE 100' },
  ]
};