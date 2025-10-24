import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WatchlistProps {
  symbols: string[];
  activeSymbol: string;
  onSymbolClick: (symbol: string) => void;
}

export function Watchlist({ symbols, activeSymbol, onSymbolClick }: WatchlistProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold tracking-wide text-foreground">Watchlist</h3>
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            variant={symbol === activeSymbol ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSymbolClick(symbol)}
            className={cn(
              'relative overflow-hidden font-mono font-bold transition-all duration-300 hover:scale-105',
              symbol === activeSymbol 
                ? 'bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground shadow-xl shadow-primary/30 ring-2 ring-primary/50' 
                : 'border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/60 hover:shadow-lg'
            )}
          >
            {symbol === activeSymbol && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent animate-shimmer" />
            )}
            <span className="relative z-10">{symbol.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
