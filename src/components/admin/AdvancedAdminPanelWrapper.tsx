import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LazyAdvancedAdminPanel = lazy(() => import('../AdvancedAdminPanel'));

export function AdvancedAdminPanelWrapper() {
  return (
    <Suspense fallback={
      <div className="p-4 rounded-lg border border-border/50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading advanced settings...</span>
        </div>
      </div>
    }>
      <LazyAdvancedAdminPanel />
    </Suspense>
  );
}