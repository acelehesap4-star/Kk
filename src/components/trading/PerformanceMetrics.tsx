import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Zap } from 'lucide-react';
import { Candle } from '@/types/trading';

interface PerformanceMetricsProps {
  candles: Candle[];
  currentPrice: number | null;
  symbol: string;
}

export function PerformanceMetrics({ candles, currentPrice, symbol }: PerformanceMetricsProps) {
  if (candles.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-panel animate-pulse rounded-xl p-4"
          >
            <div className="h-4 w-20 rounded bg-muted/20" />
            <div className="mt-2 h-6 w-16 rounded bg-muted/20" />
          </div>
        ))}
      </div>
    );
  }

  const last24h = candles.slice(-1440); // Assuming 1-min candles
  const high24h = Math.max(...last24h.map((c) => c.y[1]));
  const low24h = Math.min(...last24h.map((c) => c.y[2]));
  const open24h = last24h[0]?.y[0] || currentPrice || 0;
  const close24h = currentPrice || last24h[last24h.length - 1]?.y[3] || 0;
  
  const change24h = close24h - open24h;
  const changePercent = (change24h / open24h) * 100;
  
  const volumes = last24h.map((c) => (c.y[1] - c.y[2]) * 1000); // Mock volume
  const totalVolume = volumes.reduce((a, b) => a + b, 0);
  
  const volatility = ((high24h - low24h) / low24h) * 100;

  const metrics = [
    {
      label: '24h Change',
      value: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
      subValue: `${change24h >= 0 ? '+' : ''}$${Math.abs(change24h).toFixed(2)}`,
      icon: changePercent >= 0 ? TrendingUp : TrendingDown,
      color: changePercent >= 0 ? 'text-success' : 'text-destructive',
      bgColor: changePercent >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      label: '24h High',
      value: `$${high24h.toFixed(2)}`,
      subValue: `+${((high24h - close24h) / close24h * 100).toFixed(2)}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '24h Low',
      value: `$${low24h.toFixed(2)}`,
      subValue: `${((low24h - close24h) / close24h * 100).toFixed(2)}%`,
      icon: TrendingDown,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      label: '24h Volume',
      value: `${(totalVolume / 1e6).toFixed(2)}M`,
      subValue: `${symbol.toUpperCase()}`,
      icon: BarChart3,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'Volatility',
      value: `${volatility.toFixed(2)}%`,
      subValue: 'Price range',
      icon: Zap,
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
    {
      label: 'Market Cap',
      value: '—',
      subValue: 'N/A',
      icon: DollarSign,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
        <Activity className="h-4 w-4 text-primary" />
        Performance Metrics
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="group glass-panel animate-fade-in rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </div>
                  <div className={`mt-1 font-mono text-lg font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {metric.subValue}
                  </div>
                </div>
                <div className={`rounded-lg ${metric.bgColor} p-2`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
