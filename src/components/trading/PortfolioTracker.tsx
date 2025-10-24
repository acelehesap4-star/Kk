import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Position {
  id: string;
  symbol: string;
  entry: number;
  current: number;
  quantity: number;
  side: 'long' | 'short';
}

export const PortfolioTracker = () => {
  const [positions] = useState<Position[]>([
    { id: '1', symbol: 'BTC', entry: 65000, current: 67500, quantity: 0.5, side: 'long' },
    { id: '2', symbol: 'ETH', entry: 3200, current: 3150, quantity: 2, side: 'long' },
    { id: '3', symbol: 'SOL', entry: 145, current: 158, quantity: 10, side: 'long' },
  ]);

  const calculatePnL = (pos: Position) => {
    const diff = pos.side === 'long' 
      ? (pos.current - pos.entry) * pos.quantity
      : (pos.entry - pos.current) * pos.quantity;
    return diff;
  };

  const calculatePnLPercent = (pos: Position) => {
    const pnl = calculatePnL(pos);
    const cost = pos.entry * pos.quantity;
    return (pnl / cost) * 100;
  };

  const totalPnL = positions.reduce((sum, pos) => sum + calculatePnL(pos), 0);
  const totalValue = positions.reduce((sum, pos) => sum + (pos.current * pos.quantity), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-chart-4" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Portfolio</h3>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/30">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase">Total Value</span>
          </div>
          <div className="text-lg font-bold text-primary">${totalValue.toLocaleString()}</div>
        </div>

        <div className={`p-3 rounded-lg border ${totalPnL >= 0 ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
          <div className="flex items-center gap-1 mb-1">
            {totalPnL >= 0 ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : (
              <TrendingDown className="w-3 h-3 text-destructive" />
            )}
            <span className="text-[10px] text-muted-foreground uppercase">Total PnL</span>
          </div>
          <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            ${totalPnL.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="space-y-2">
        {positions.map((pos) => {
          const pnl = calculatePnL(pos);
          const pnlPercent = calculatePnLPercent(pos);
          const isProfit = pnl >= 0;

          return (
            <div
              key={pos.id}
              className="p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{pos.symbol}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    pos.side === 'long' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {pos.side.toUpperCase()}
                  </span>
                </div>
                <div className={`text-sm font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                  {isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Entry</div>
                  <div className="text-foreground font-medium">${pos.entry.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current</div>
                  <div className="text-foreground font-medium">${pos.current.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">PnL</div>
                  <div className={`font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                    ${pnl.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-muted-foreground">
                Qty: {pos.quantity} | Value: ${(pos.current * pos.quantity).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
