import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LazyOrderPanel = lazy(() => import('../OrderPanel'));

interface OrderPanelWrapperProps {
  // Bileşen prop'larını buraya ekle
}

export function OrderPanelWrapper(props: OrderPanelWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    }>
      <LazyOrderPanel {...props} />
    </Suspense>
  );
}