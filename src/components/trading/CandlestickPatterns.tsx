import { TrendingUp, TrendingDown, Circle } from 'lucide-react';
import { CandlestickPattern } from '@/types/trading';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CandlestickPatternsProps {
  patterns: CandlestickPattern[];
}

export function CandlestickPatterns({ patterns }: CandlestickPatternsProps) {
  const recentPatterns = patterns.slice(-10).reverse();
  
  const getSignalColor = (signal: string) => {
    if (signal === 'bullish') return 'text-success';
    if (signal === 'bearish') return 'text-destructive';
    return 'text-muted-foreground';
  };
  
  const getSignalIcon = (signal: string) => {
    if (signal === 'bullish') return <TrendingUp className="h-4 w-4" />;
    if (signal === 'bearish') return <TrendingDown className="h-4 w-4" />;
    return <Circle className="h-4 w-4" />;
  };
  
  return (
    <div className="glass-panel rounded-xl p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground">
        Candlestick Patterns
      </h4>
      
      <ScrollArea className="h-[200px]">
        {recentPatterns.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No patterns detected
          </div>
        ) : (
          <div className="space-y-2">
            {recentPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="group rounded-lg border border-border/50 bg-black/20 p-3 transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={getSignalColor(pattern.signal)}>
                      {getSignalIcon(pattern.signal)}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {pattern.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${
                          pattern.signal === 'bullish'
                            ? 'bg-success'
                            : pattern.signal === 'bearish'
                            ? 'bg-destructive'
                            : 'bg-muted-foreground'
                        }`}
                        style={{ width: `${pattern.strength * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(pattern.timestamp).toLocaleTimeString()}</span>
                  <span>•</span>
                  <span className="capitalize">{pattern.signal}</span>
                  <span>•</span>
                  <span>{Math.round(pattern.strength * 100)}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}