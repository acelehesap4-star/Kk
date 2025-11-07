import { lazy, Suspense } from 'react';
import { Timeframe, IndicatorSettings, CandlestickPattern, Candle, Exchange, AssetType } from '@/types/trading';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy loaded components
const Watchlist = lazy(() => import('@/components/trading/Watchlist').then(m => ({ default: m.Watchlist })));
const TimeframeSelector = lazy(() => import('@/components/trading/TimeframeSelector').then(m => ({ default: m.TimeframeSelector })));
const DrawingTools = lazy(() => import('@/components/trading/DrawingTools').then(m => ({ default: m.DrawingTools })));
const IndicatorControls = lazy(() => import('@/components/trading/IndicatorControls').then(m => ({ default: m.IndicatorControls })));
const CandlestickPatterns = lazy(() => import('@/components/trading/CandlestickPatterns').then(m => ({ default: m.CandlestickPatterns })));
const TradingSignals = lazy(() => import('@/components/trading/TradingSignals').then(m => ({ default: m.TradingSignals })));
const OrderPanel = lazy(() => import('@/components/trading/OrderPanel').then(m => ({ default: m.OrderPanel })));
const MarketSelector = lazy(() => import('@/components/trading/MarketSelector').then(m => ({ default: m.MarketSelector })));
const RiskCalculator = lazy(() => import('@/components/trading/RiskCalculator').then(m => ({ default: m.RiskCalculator })));

interface SidebarProps {
  mode: 'left' | 'right';
  symbols: string[];
  activeSymbol: string;
  timeframe: Timeframe;
  exchange?: Exchange;
  assetType?: AssetType;
  indicatorSettings: IndicatorSettings;
  detectedPatterns: CandlestickPattern[];
  candles: Candle[];
  lastPrice: number | null;
  onSymbolClick: (symbol: string) => void;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onApplyIndicators: (settings: IndicatorSettings) => void;
}

export const Sidebar = ({
  mode,
  symbols,
  activeSymbol,
  timeframe,
  exchange,
  assetType,
  indicatorSettings,
  detectedPatterns,
  candles,
  lastPrice,
  onSymbolClick,
  onTimeframeChange,
  onApplyIndicators,
}: SidebarProps) => {
  const LoadingFallback = () => (
    <div className="w-full h-32">
      <Skeleton className="h-full" />
    </div>
  );

  if (mode === 'left') {
    return (
      <aside className="glass-panel space-y-4 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:shadow-primary/10 animate-fade-in-up">
        <Suspense fallback={<LoadingFallback />}>
          <Watchlist
            symbols={symbols}
            activeSymbol={activeSymbol}
            onSymbolClick={onSymbolClick}
          />
          
          <TimeframeSelector
            selected={timeframe}
            onChange={onTimeframeChange}
          />
          
          <DrawingTools />
          
          <IndicatorControls
            settings={indicatorSettings}
            onApply={onApplyIndicators}
          />

          {indicatorSettings.showPatterns && (
            <CandlestickPatterns patterns={detectedPatterns} />
          )}

          <TradingSignals candles={candles} symbol={activeSymbol} />
        </Suspense>
      </aside>
    );
  }

  return (
    <aside className="glass-panel space-y-4 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:shadow-primary/10 animate-fade-in-up">
      <Suspense fallback={<LoadingFallback />}>
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>
          <TabsContent value="market">
            <MarketSelector />
          </TabsContent>
          <TabsContent value="trade">
            <OrderPanel 
              symbol={activeSymbol}
              currentPrice={lastPrice}
              exchange={exchange}
              assetType={assetType}
            />
          </TabsContent>
          <TabsContent value="risk">
            <RiskCalculator 
              symbol={activeSymbol}
              currentPrice={lastPrice}
            />
          </TabsContent>
        </Tabs>
      </Suspense>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';
