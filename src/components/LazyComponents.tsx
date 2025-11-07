import { lazy, ComponentType } from 'react';
import { AssetType } from '@/types/trading';

// Props interfaces
interface OrderPanelProps {
  symbol?: string;
  currentPrice?: number;
  assetType?: AssetType;
  exchange?: string;
}

interface TradingViewChartProps {
  symbol: string;
  exchange?: string;
  marketType: 'crypto' | 'forex' | 'stocks' | 'indices';
  interval?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
}

interface MarketToolsProps {
  symbol: string;
  userId: string;
}

// Trading Components
const importOrderPanel = () => import('./trading/OrderPanel')
  .then(mod => ({ default: mod.OrderPanel as ComponentType<OrderPanelProps> }));
export const OrderPanel = lazy<ComponentType<OrderPanelProps>>(importOrderPanel);

// Chart Components
const importTradingViewChart = () => import('./chart/TradingViewChart')
  .then(mod => ({ default: mod.TradingViewChart as ComponentType<TradingViewChartProps> }));
export const TradingViewChart = lazy<ComponentType<TradingViewChartProps>>(importTradingViewChart);

// Market Tools Components
// Market Tools Components
export const ForexMarketTools = lazy(() => import('./market-specific/forex/ForexMarketTools')
  .then(mod => ({ default: mod.ForexMarketTools as ComponentType<MarketToolsProps> })));

export const CommodityMarketTools = lazy(() => import('./market-specific/commodities/CommodityMarketTools')
  .then(mod => ({ default: mod.CommodityMarketTools as ComponentType<MarketToolsProps> })));

// Admin Panel
export const AdminPanel = lazy(() => import('./admin/AdminPanel'));