import { Activity } from 'lucide-react';

export function DepthChartHeader() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Elite Market Depth</h4>
          <p className="text-xs text-muted-foreground">Real-time order book visualization</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/10 border border-success/20">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-success font-medium">Bids</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-destructive font-medium">Asks</span>
        </div>
      </div>
    </div>
  );
}