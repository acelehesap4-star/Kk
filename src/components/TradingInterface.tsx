import React, { Suspense } from 'react';
import { OrderPanel, TradingViewChart, AdvancedAdminPanel } from './LazyComponents';
import { LoadingSpinner } from './ui/loading-spinner';

interface TradingInterfaceProps {
  symbol: string;
  currentPrice: number;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({
  symbol,
  currentPrice,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Trading Chart */}
      <div className="col-span-8">
        <Suspense fallback={<LoadingSpinner />}>
          <TradingViewChart
            symbol={symbol}
            marketType="crypto"
            theme="dark"
            height={600}
          />
        </Suspense>
      </div>
      
      {/* Order Panel */}
      <div className="col-span-4">
        <Suspense fallback={<LoadingSpinner />}>
          <OrderPanel
            symbol={symbol}
            currentPrice={currentPrice}
            assetType="crypto"
            exchange="BINANCE"
          />
        </Suspense>
      </div>
      
      {/* Admin Panel */}
      <div className="col-span-12">
        <Suspense fallback={<LoadingSpinner />}>
          <AdvancedAdminPanel user={{ id: '1', role: 'admin' }} />
        </Suspense>
      </div>
    </div>
  );
};