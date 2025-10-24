import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Zap, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScanResult {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  rsi: number;
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
}

export const MarketScanner = () => {
  const [filter, setFilter] = useState('all');
  const [scanResults] = useState<ScanResult[]>([
    { symbol: 'APEUSDT', price: 1.25, change24h: 15.6, volume: 45000000, rsi: 72, signal: 'strong_buy' },
    { symbol: 'ARBUSDT', price: 0.95, change24h: 8.3, volume: 28000000, rsi: 65, signal: 'buy' },
    { symbol: 'LINKUSDT', price: 14.80, change24h: -3.2, volume: 18000000, rsi: 42, signal: 'neutral' },
    { symbol: 'DOGEUSDT', price: 0.082, change24h: 12.1, volume: 95000000, rsi: 68, signal: 'buy' },
    { symbol: 'MATICUSDT', price: 0.72, change24h: -5.8, volume: 22000000, rsi: 35, signal: 'sell' },
  ]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'text-success';
      case 'buy': return 'text-success/70';
      case 'neutral': return 'text-muted-foreground';
      case 'sell': return 'text-destructive/70';
      case 'strong_sell': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'bg-success/20 border-success/30';
      case 'buy': return 'bg-success/10 border-success/20';
      case 'neutral': return 'bg-muted/30 border-border';
      case 'sell': return 'bg-destructive/10 border-destructive/20';
      case 'strong_sell': return 'bg-destructive/20 border-destructive/30';
      default: return 'bg-muted/30 border-border';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-chart-4" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Market Scanner</h3>
        </div>
        <Zap className="w-4 h-4 text-chart-4 animate-pulse" />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Signals</SelectItem>
            <SelectItem value="strong_buy">Strong Buy</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="overbought">Overbought (RSI &gt; 70)</SelectItem>
            <SelectItem value="oversold">Oversold (RSI &lt; 30)</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="gap-1">
          <Filter className="w-3 h-3" />
          More
        </Button>
      </div>

      {/* Scan Results */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {scanResults.map((result) => (
          <div
            key={result.symbol}
            className={`p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${getSignalBg(result.signal)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {result.symbol.replace('USDT', '')}
                </span>
                {result.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
              </div>
              <span className={`text-xs font-semibold uppercase ${getSignalColor(result.signal)}`}>
                {result.signal.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="text-foreground font-medium">${result.price}</div>
              </div>
              <div>
                <div className="text-muted-foreground">24h</div>
                <div className={`font-bold ${result.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {result.change24h >= 0 ? '+' : ''}{result.change24h.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">RSI</div>
                <div className={`font-medium ${
                  result.rsi > 70 ? 'text-destructive' : result.rsi < 30 ? 'text-success' : 'text-foreground'
                }`}>
                  {result.rsi}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-muted-foreground">
              Vol: ${(result.volume / 1000000).toFixed(1)}M
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
