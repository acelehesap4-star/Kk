import { memo, Suspense, lazy } from 'react';
import { BuyOmni99 } from '@/components/tokens/BuyOmni99';
import { WalletButton } from '@/components/web3/WalletButton';
import { MarketSelector } from '@/components/trading/MarketSelector';
import { OrderPanel } from '@/components/trading/OrderPanel';
import { AdvancedOrderTypes } from '@/components/trading/AdvancedOrderTypes';
import { PriceAlerts } from '@/components/trading/PriceAlerts';
import { RiskCalculator } from '@/components/trading/RiskCalculator';
import { LiquidityZones } from '@/components/trading/LiquidityZones';
import { HotkeyPanel } from '@/components/trading/HotkeyPanel';
import { SwapInterface } from '@/components/web3/SwapInterface';
import { CryptoPayment } from '@/components/web3/CryptoPayment';
import { MarketSummary } from '@/components/trading/MarketSummary';
import { NewsFeed } from '@/components/trading/NewsFeed';
import { Exchange, AssetType } from '@/types/trading';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const PortfolioTracker = lazy(() => import('@/components/trading/PortfolioTracker').then(m => ({ default: m.PortfolioTracker })));
const AutoTradingSignals = lazy(() => import('@/components/trading/AutoTradingSignals').then(m => ({ default: m.AutoTradingSignals })));
const SocialTrading = lazy(() => import('@/components/trading/SocialTrading').then(m => ({ default: m.SocialTrading })));
const MarketScanner = lazy(() => import('@/components/trading/MarketScanner').then(m => ({ default: m.MarketScanner })));
const MarketSentiment = lazy(() => import('@/components/trading/MarketSentiment').then(m => ({ default: m.MarketSentiment })));
const EconomicCalendar = lazy(() => import('@/components/trading/EconomicCalendar').then(m => ({ default: m.EconomicCalendar })));
const TradeJournal = lazy(() => import('@/components/trading/TradeJournal').then(m => ({ default: m.TradeJournal })));

interface RightSidebarProps {
  symbol: string;
  exchange: Exchange;
  currentPrice: number | null;
  assetType: AssetType;
  onSelectSymbol: (symbol: string, type: AssetType) => void;
}

export const RightSidebar = memo(({
  symbol,
  exchange,
  currentPrice,
  assetType,
  onSelectSymbol,
}: RightSidebarProps) => {
  return (
    <aside className="glass-panel space-y-4 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:shadow-primary/10 animate-slide-in-right">
      <BuyOmni99 />
      <WalletButton />
      <MarketSelector 
        onSelectSymbol={onSelectSymbol} 
        selectedSymbol={symbol}
      />
      <OrderPanel 
        symbol={symbol} 
        currentPrice={currentPrice} 
        assetType={assetType}
        exchange={exchange}
      />
      <AdvancedOrderTypes />
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <PortfolioTracker />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <AutoTradingSignals />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <SocialTrading />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <MarketScanner />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <MarketSentiment />
      </Suspense>
      <PriceAlerts />
      <RiskCalculator />
      <LiquidityZones />
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <EconomicCalendar />
      </Suspense>
      <HotkeyPanel />
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
        <TradeJournal />
      </Suspense>
      <SwapInterface />
      <CryptoPayment />
      <MarketSummary exchange={exchange} symbol={symbol} />
      <NewsFeed />
    </aside>
  );
});

RightSidebar.displayName = 'RightSidebar';