import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Dinamik import ile graf bileşenini yükleme
const LazyDepthChartGraph = lazy(() => import('./DepthChartGraph'));

interface DepthChartGraphWrapperProps {
  bidsDepth: { x: number; y: number }[];
  asksDepth: { x: number; y: number }[];
}

export function DepthChartGraphWrapper(props: DepthChartGraphWrapperProps) {
  return (
    <Suspense fallback={
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    }>
      <LazyDepthChartGraph {...props} />
    </Suspense>
  );
}