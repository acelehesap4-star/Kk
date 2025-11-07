export const SUPPORTED_COLD_WALLETS = {
  BTC: import.meta.env.VITE_BTC_COLD_WALLET || 'bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8',
  SOL: import.meta.env.VITE_SOL_COLD_WALLET || 'Gp4itYBqqkNRNYtC22QAPdThPB6Kzx8M1yy2rpXBGxbc',
  TRX: import.meta.env.VITE_TRX_COLD_WALLET || 'THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739',
  ETH: import.meta.env.VITE_ETH_COLD_WALLET || '0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1'
};

// You can override these with environment variables in production
export const ADMIN_CONFIG = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'berkecansuskun1998@gmail.com',
  defaultPassword: import.meta.env.VITE_ADMIN_PASSWORD || '7892858a', // only used during initial setup
  role: 'admin',
  permissions: {
    admin: true,
    superuser: true,
    createUsers: true,
    manageExchanges: true,
    manageTokens: true,
    viewAnalytics: true,
    manageSettings: true,
    accessAllFeatures: true
  },
  features: {
    advancedCharting: true,
    algorithmicTrading: true,
    riskManagement: true,
    portfolioAnalysis: true,
    marketResearch: true,
    customIndicators: true,
    automatedStrategies: true,
    dataExport: true
  }
};

export const PLATFORM_TOKEN = {
  name: 'KK',
  symbol: 'KK',
  decimals: 18,
  totalSupply: '100000000000000000000000000', // 100M tokens
  commission: 0.001 // 0.1% commission on all trades
};

export const SUPPORTED_MARKETS = {
  crypto: [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'ADA/USDT', 
    'XRP/USDT', 'DOT/USDT', 'DOGE/USDT', 'AVAX/USDT', 'MATIC/USDT'
  ],
  stocks: [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'NFLX'
  ],
  indices: [
    'SPX500', 'NASDAQ', 'DJ30', 'DAX40', 'FTSE100', 'CAC40', 'ASX200', 'NIKKEI', 'HSI'
  ],
  forex: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
  ],
  commodities: [
    'XAUUSD', 'XAGUSD', 'WTIUSD', 'BCOUSD', 'NATGAS'
  ]
};