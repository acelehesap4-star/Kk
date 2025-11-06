export const MARKET_TYPES = {
  CRYPTO: 'crypto',
  STOCKS: 'stocks',
  FOREX: 'forex',
  INDICES: 'indices',
} as const;

export const ACTIVE_MARKETS = {
  [MARKET_TYPES.CRYPTO]: true,
  [MARKET_TYPES.STOCKS]: true,
  [MARKET_TYPES.FOREX]: true,
  [MARKET_TYPES.INDICES]: true,
};

export const DEFAULT_TRADING_MODE = 'REAL';
export const ENVIRONMENT = 'production';

export const MARKET_FEATURES = {
  realTimeData: true,
  advancedCharts: true,
  technicalAnalysis: true,
  fundamentalAnalysis: true,
  portfolioTracking: true,
  riskManagement: true,
  notifications: true,
  multiExchange: true,
};