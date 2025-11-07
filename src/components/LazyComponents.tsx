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

// Trading Components
const importOrderPanel = () => import('./trading/OrderPanel')
  .then(mod => ({ default: mod.OrderPanel as ComponentType<OrderPanelProps> }));
export const OrderPanel = lazy<ComponentType<OrderPanelProps>>(importOrderPanel);

// Chart Components
const importTradingViewChart = () => import('./chart/TradingViewChart')
  .then(mod => ({ default: mod.TradingViewChart as ComponentType<TradingViewChartProps> }));
export const TradingViewChart = lazy<ComponentType<TradingViewChartProps>>(importTradingViewChart);

// Advanced Admin Panel
const importAdvancedAdminPanel = () => import('./AdvancedAdminPanel');
export const AdvancedAdminPanel = lazy(() => importAdvancedAdminPanel());