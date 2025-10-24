import { Wallet, DollarSign, TrendingUp, Activity } from 'lucide-react';

interface QuickStatsProps {
  symbol: string;
  price: number | null;
}

export function QuickStats({ symbol, price }: QuickStatsProps) {
  const stats = [
    {
      label: 'Portfolio Value',
      value: price ? `$${(price * 10).toFixed(2)}` : '—',
      change: '+12.5%',
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Holdings',
      value: '10.00',
      change: symbol.toUpperCase(),
      icon: DollarSign,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      label: 'P&L Today',
      value: price ? `$${(price * 0.125).toFixed(2)}` : '—',
      change: '+8.3%',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Avg. Entry',
      value: price ? `$${(price * 0.92).toFixed(2)}` : '—',
      change: 'Long',
      icon: Activity,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  return (
    <div className="glass-panel animate-fade-in rounded-xl p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground">Quick Stats</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-black/20 p-3 transition-all duration-300 hover:scale-105 hover:border-primary/30"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className={`rounded-lg ${stat.bgColor} p-1.5`}>
                    <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                </div>
                
                <div className="font-mono text-lg font-bold text-foreground">
                  {stat.value}
                </div>
                
                <div className={`mt-1 text-xs font-semibold ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
