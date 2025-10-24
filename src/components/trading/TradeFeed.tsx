import { Trade } from '@/types/trading';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TradeFeedProps {
  trades: Trade[];
}

export function TradeFeed({ trades }: TradeFeedProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">Trade Feed</h4>
      <ScrollArea className="h-[240px] rounded-lg border border-border bg-card/30 p-3">
        <div className="space-y-1 font-mono text-xs">
          {trades.length === 0 && (
            <div className="text-center text-muted-foreground">Waiting for trades...</div>
          )}
          {trades.map((trade, idx) => (
            <div
              key={idx}
              className={`flex justify-between ${
                trade.side === 'buy' ? 'text-success' : 'text-destructive'
              }`}
            >
              <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
              <span className="font-bold">{trade.price.toFixed(6)}</span>
              {trade.volume > 0 && <span>({trade.volume.toFixed(3)})</span>}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
