import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LiveIndicator } from './LiveIndicator';

interface PriceDisplayProps {
  symbol: string;
  price: number | null;
  previousPrice: number | null;
  source: string;
}

export function PriceDisplay({ symbol, price, previousPrice, source }: PriceDisplayProps) {
  const isUp = price && previousPrice ? price >= previousPrice : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-3xl font-black tracking-tight text-foreground">
              {symbol.toUpperCase()}
            </h2>
            <LiveIndicator />
          </div>
          
          {price && (
            <div className="flex items-baseline gap-3">
              <span 
                className={`font-mono text-5xl font-black tracking-tight transition-all duration-300 ${
                  isUp ? 'text-success glow-success' : 'text-destructive glow-destructive'
                }`}
              >
                ${price.toFixed(2)}
              </span>
              <span className="font-mono text-xl text-muted-foreground">
                .{price.toFixed(6).split('.')[1].slice(0, 4)}
              </span>
              {isUp !== null && (
                <div className={`flex items-center gap-1 rounded-lg px-3 py-1 ${
                  isUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {isUp ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 shadow-lg ring-1 ring-primary/20">
            <Activity className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{source}</span>
          </div>
          
          <div className="text-right">
            <div className="text-xs font-medium text-muted-foreground">Last Update</div>
            <div className="font-mono text-sm font-semibold text-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
