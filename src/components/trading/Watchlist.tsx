import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity, Star, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WatchlistProps {
  symbols: string[];
  activeSymbol: string;
  onSymbolClick: (symbol: string) => void;
}

interface SymbolData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  isFavorite: boolean;
}

export function Watchlist({ symbols, activeSymbol, onSymbolClick }: WatchlistProps) {
  const [symbolsData, setSymbolsData] = useState<SymbolData[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate real-time price updates
    const mockData: SymbolData[] = symbols.map(symbol => ({
      symbol,
      price: Math.random() * 70000 + 10000,
      change24h: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000000,
      isFavorite: Math.random() > 0.7,
    }));
    setSymbolsData(mockData);

    const interval = setInterval(() => {
      setSymbolsData(prev => prev.map(s => ({
        ...s,
        price: s.price * (1 + (Math.random() - 0.5) * 0.001),
        change24h: s.change24h + (Math.random() - 0.5) * 0.1,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [symbols]);

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSymbolsData(prev => prev.map(s => 
      s.symbol === symbol ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const displayedSymbols = showAll ? symbolsData : symbolsData.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          Watchlist
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 gap-1"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `+${symbolsData.length - 6} More`}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {displayedSymbols.map((data) => {
          const isActive = data.symbol === activeSymbol;
          const isPositive = data.change24h >= 0;
          
          return (
            <div
              key={data.symbol}
              onClick={() => onSymbolClick(data.symbol)}
              className={cn(
                'relative overflow-hidden rounded-lg border p-3 transition-all duration-300 cursor-pointer group',
                isActive 
                  ? 'bg-gradient-to-r from-primary/20 to-cyan-400/20 border-primary/50 shadow-lg shadow-primary/20' 
                  : 'border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/60 hover:scale-[1.02]'
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent animate-shimmer" />
              )}
              
              <div className="relative z-10 space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {data.symbol.toUpperCase()}
                    </span>
                    <Star 
                      className={cn(
                        "w-3 h-3 cursor-pointer transition-colors",
                        data.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                      )}
                      onClick={(e) => toggleFavorite(data.symbol, e)}
                    />
                  </div>
                  
                  <Badge 
                    variant={isPositive ? "default" : "destructive"}
                    className={cn(
                      "text-[10px] font-bold",
                      isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    )}
                  >
                    {isPositive ? <TrendingUp className="w-2 h-2 mr-1" /> : <TrendingDown className="w-2 h-2 mr-1" />}
                    {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
                  </Badge>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ${data.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Vol: ${(data.volume / 1000000).toFixed(1)}M
                  </span>
                </div>

                {/* Mini Chart Placeholder */}
                <div className="h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={cn(
                    "h-full rounded bg-gradient-to-r",
                    isPositive 
                      ? "from-success/10 via-success/20 to-success/10" 
                      : "from-destructive/10 via-destructive/20 to-destructive/10"
                  )} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}