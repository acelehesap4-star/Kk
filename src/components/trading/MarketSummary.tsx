import { useState, useEffect } from 'react';
import { Exchange } from '@/types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketSummaryProps {
  exchange: Exchange;
  symbol: string;
}

interface Stats {
  high24h: number | null;
  low24h: number | null;
  volume24h: number | null;
  change24h: number | null;
}

export function MarketSummary({ exchange, symbol }: MarketSummaryProps) {
  const [stats, setStats] = useState<Stats>({
    high24h: null,
    low24h: null,
    volume24h: null,
    change24h: null,
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [exchange, symbol]);

  const fetchStats = async () => {
    try {
      if (exchange === 'BINANCE') {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`
        );
        if (!response.ok) return;
        
        const data = await response.json();
        setStats({
          high24h: parseFloat(data.highPrice),
          low24h: parseFloat(data.lowPrice),
          volume24h: parseFloat(data.volume),
          change24h: parseFloat(data.priceChangePercent),
        });
      } else if (exchange === 'OKX') {
        const response = await fetch(
          `https://www.okx.com/api/v5/market/ticker?instId=${symbol.toUpperCase()}`
        );
        if (!response.ok) return;
        
        const data = await response.json();
        const ticker = data.data?.[0];
        if (ticker) {
          setStats({
            high24h: parseFloat(ticker.high24h),
            low24h: parseFloat(ticker.low24h),
            volume24h: parseFloat(ticker.vol24h),
            change24h: parseFloat(ticker.changePercent24h || 0),
          });
        }
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">Market Summary</h4>
      
      <div className="space-y-3 rounded-lg border border-border bg-card/30 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">24h Change</span>
          <span
            className={`flex items-center gap-1 font-bold ${
              stats.change24h && stats.change24h >= 0 ? 'text-success' : 'text-destructive'
            }`}
          >
            {stats.change24h !== null ? (
              <>
                {stats.change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stats.change24h.toFixed(2)}%
              </>
            ) : (
              '—'
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">24h High</span>
          <span className="font-mono font-bold text-success">
            {stats.high24h ? `$${stats.high24h.toFixed(2)}` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">24h Low</span>
          <span className="font-mono font-bold text-destructive">
            {stats.low24h ? `$${stats.low24h.toFixed(2)}` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">24h Volume</span>
          <span className="font-mono font-medium">
            {stats.volume24h
              ? stats.volume24h >= 1000000
                ? `${(stats.volume24h / 1000000).toFixed(2)}M`
                : `${(stats.volume24h / 1000).toFixed(2)}K`
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
