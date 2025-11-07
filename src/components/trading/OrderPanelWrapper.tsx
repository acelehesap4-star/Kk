import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AssetType } from '@/types/trading';

const LazyOrderPanel = lazy(() => import('./OrderPanel'));

interface OrderPanelWrapperProps {
  symbol?: string;
  currentPrice?: number;
  assetType?: AssetType;
  exchange?: string;
}

export function OrderPanelWrapper(props: OrderPanelWrapperProps) {
  return (
    <Suspense fallback={
      <div className="p-4 rounded-lg border border-border/50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading order panel...</span>
        </div>
      </div>
    }>
      <LazyOrderPanel {...props} />
    </Suspense>
  );
}