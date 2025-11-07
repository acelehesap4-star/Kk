import { Loader2 } from 'lucide-react';

export function DepthChartLoader() {
  return (
    <div className="glass-panel flex h-[300px] items-center justify-center rounded-xl">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}