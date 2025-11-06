export type MarketType = 'crypto' | 'stocks' | 'forex' | 'indices' | 'commodities';

export interface MarketFeature {
  id: string;
  name: string;
  description: string;
  category: MarketFeatureCategory;
  piyasalar: MarketType[];
  requiresPermission: boolean;
  status: 'active' | 'beta' | 'coming_soon';
}

export type MarketFeatureCategory = 
  | 'technical_analysis'
  | 'fundamental_analysis'
  | 'risk_management'
  | 'automation'
  | 'ai_analysis'
  | 'social_trading'
  | 'portfolio_management'
  | 'regulatory_compliance'
  | 'market_data'
  | 'research_tools';

export interface MarketData {
  symbol: string;
  type: MarketType;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: number;
  additionalData?: {
    [key: string]: any; // Piyasaya özel ek veriler
  };
}

export interface MarketSettings {
  type: MarketType;
  defaultTimeframe: string;
  defaultIndicators: string[];
  customIndicators?: string[];
  riskSettings: {
    maxPositionSize: number;
    stopLossPercent: number;
    takeProfitPercent: number;
    trailingStopPercent: number;
    maxDrawdown?: number;
    maxLeverage?: number;
    correlationLimit?: number;
    volatilityTarget?: number;
    piyasaSpecificRisk?: {
      [key: string]: number;
    };
  };
  tradingHours?: {
    start: string;
    end: string;
    timezone: string;
    holidays?: string[];
  };
  permissions?: {
    canTrade: boolean;
    canShort: boolean;
    canUseMargin: boolean;
    canUseDerivatives: boolean;
    requiredDocuments?: string[];
  };
}

export interface MarketAnalysis {
  type: MarketType;
  timeframe: string;
  indicators: {
    technical: Record<string, number>;
    fundamental: Record<string, any>;
    sentiment: Record<string, number>;
    ai: Record<string, any>;
  };
  signals: {
    direction: 'buy' | 'sell' | 'neutral';
    strength: number;
    confidence: number;
    factors: string[];
  };
  riskScore: number;
  marketConditions: {
    regime: string;
    volatility: number;
    liquidity: number;
    sentiment: string;
  };
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  piyasalar: MarketType[];
  strategy: {
    type: string;
    parameters: Record<string, any>;
    riskManagement: Record<string, any>;
  };
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    returns: number;
  };
  status: 'active' | 'paused' | 'testing';
  requirements: {
    minCapital: number;
    permissions: string[];
    piyasaAccess: string[];
  };
}

export interface MarketAlert {
  id: string;
  type: 'price' | 'technical' | 'fundamental' | 'news' | 'risk' | 'custom';
  piyasa: MarketType;
  condition: {
    indicator?: string;
    operator: string;
    value: any;
    timeframe?: string;
  };
  action: {
    notification: boolean;
    autoTrade?: {
      type: 'market' | 'limit';
      size: number;
      side: 'buy' | 'sell';
    };
  };
  status: 'active' | 'triggered' | 'expired';
}

export interface BacktestSettings {
  piyasa: MarketType;
  timeframe: {
    start: string;
    end: string;
    interval: string;
  };
  strategy: {
    name: string;
    parameters: Record<string, any>;
  };
  capital: {
    initial: number;
    currency: string;
  };
  constraints: {
    maxPositions: number;
    maxDrawdown: number;
    leverage: number;
  };
  costs: {
    commission: number;
    slippage: number;
    spread: number;
  };
}

export interface MarketResearch {
  id: string;
  piyasa: MarketType;
  type: 'technical' | 'fundamental' | 'sentiment' | 'ai';
  content: {
    title: string;
    summary: string;
    analysis: string;
    recommendations: string[];
    risks: string[];
  };
  metadata: {
    author: string;
    date: string;
    confidence: number;
    tags: string[];
  };
}