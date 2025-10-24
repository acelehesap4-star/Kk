import { useState } from 'react';
import { Layers, TrendingUp, TrendingDown } from 'lucide-react';

interface LiquidityZone {
  price: number;
  volume: number;
  type: 'support' | 'resistance';
  strength: 'weak' | 'medium' | 'strong';
}

export const LiquidityZones = () => {
  const [zones] = useState<LiquidityZone[]>([
    { price: 70000, volume: 1250000, type: 'resistance', strength: 'strong' },
    { price: 68500, volume: 850000, type: 'resistance', strength: 'medium' },
    { price: 66000, volume: 2100000, type: 'support', strength: 'strong' },
    { price: 64500, volume: 650000, type: 'support', strength: 'weak' },
    { price: 62000, volume: 1800000, type: 'support', strength: 'strong' },
  ]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-primary/30 border-primary/50';
      case 'medium': return 'bg-chart-2/30 border-chart-2/50';
      case 'weak': return 'bg-muted/30 border-muted-foreground/30';
      default: return 'bg-muted/30 border-border';
    }
  };

  const getStrengthWidth = (strength: string) => {
    switch (strength) {
      case 'strong': return 'w-full';
      case 'medium': return 'w-2/3';
      case 'weak': return 'w-1/3';
      default: return 'w-1/2';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-chart-4" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Liquidity Zones</h3>
      </div>

      {/* Zone Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Support</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Resistance</span>
        </div>
      </div>

      {/* Zones List */}
      <div className="space-y-2">
        {zones.map((zone, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all hover:scale-[1.02] ${getStrengthColor(zone.strength)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {zone.type === 'support' ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className="text-sm font-bold text-foreground">
                  ${zone.price.toLocaleString()}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-medium ${
                zone.type === 'support' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
              }`}>
                {zone.type}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-foreground font-medium">
                  ${(zone.volume / 1000000).toFixed(2)}M
                </span>
              </div>

              {/* Strength Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Strength</span>
                  <span className="text-foreground capitalize">{zone.strength}</span>
                </div>
                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      zone.type === 'support'
                        ? 'from-success to-success/50'
                        : 'from-destructive to-destructive/50'
                    } ${getStrengthWidth(zone.strength)} transition-all`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-muted/20 border border-border text-xs text-muted-foreground">
        💡 Zones are calculated based on volume profile and historical price action
      </div>
    </div>
  );
};
