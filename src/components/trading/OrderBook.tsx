import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';

interface OrderBookProps {
  exchange: Exchange;
  symbol: string;
  lastPrice: number | null;
}

interface OrderLevel {
  price: number;
  volume: number;
}

export function OrderBook({ exchange, symbol, lastPrice }: OrderBookProps) {
  const [mode, setMode] = useState<'depth' | 'sim'>('depth');
  const [asks, setAsks] = useState<OrderLevel[]>([]);
  const [bids, setBids] = useState<OrderLevel[]>([]);

  useEffect(() => {
    if (mode === 'sim') {
      generateSimulatedOrderBook();
      const interval = setInterval(generateSimulatedOrderBook, 2000);
      return () => clearInterval(interval);
    } else {
      fetchOrderBook();
      const interval = setInterval(fetchOrderBook, 3000);
      return () => clearInterval(interval);
    }
  }, [exchange, symbol, mode, lastPrice]);

  const fetchOrderBook = async () => {
    try {
      const config = EXCHANGES[exchange];
      const url = config.depth(symbol);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch order book');
      
      const data = await response.json();
      
      let askData: any[] = [];
      let bidData: any[] = [];

      if (exchange === 'BINANCE') {
        askData = data.asks || [];
        bidData = data.bids || [];
      } else if (exchange === 'OKX') {
        const d = data.data || data;
        askData = d.asks || [];
        bidData = d.bids || [];
      } else if (exchange === 'KUCOIN') {
        const d = data.data || data;
        askData = d.asks || [];
        bidData = d.bids || [];
      } else if (exchange === 'COINBASE') {
        askData = data.asks || [];
        bidData = data.bids || [];
      }

      setAsks(
        askData.slice(0, 15).map((item: any) => ({
          price: parseFloat(Array.isArray(item) ? item[0] : item.price || item[0]),
          volume: parseFloat(Array.isArray(item) ? item[1] : item.size || item[1]),
        }))
      );

      setBids(
        bidData.slice(0, 15).map((item: any) => ({
          price: parseFloat(Array.isArray(item) ? item[0] : item.price || item[0]),
          volume: parseFloat(Array.isArray(item) ? item[1] : item.size || item[1]),
        }))
      );
    } catch (error) {
      console.error('Order book fetch error:', error);
      if (lastPrice) {
        generateSimulatedOrderBook();
      }
    }
  };

  const generateSimulatedOrderBook = () => {
    if (!lastPrice) return;

    const newAsks: OrderLevel[] = [];
    const newBids: OrderLevel[] = [];

    for (let i = 1; i <= 15; i++) {
      const askPrice = lastPrice + lastPrice * 0.0004 * i + Math.random() * (lastPrice * 0.00015);
      const askVolume = Math.random() * 50 * (1 - i / 15);
      newAsks.push({ price: askPrice, volume: askVolume });

      const bidPrice = lastPrice - lastPrice * 0.0004 * i - Math.random() * (lastPrice * 0.00015);
      const bidVolume = Math.random() * 50 * (1 - i / 15);
      newBids.push({ price: bidPrice, volume: bidVolume });
    }

    setAsks(newAsks.reverse());
    setBids(newBids);
  };

  const maxVolume = Math.max(
    ...asks.map((a) => a.volume),
    ...bids.map((b) => b.volume),
    1
  );

  const midPrice =
    asks.length && bids.length ? (asks[asks.length - 1].price + bids[0].price) / 2 : lastPrice;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-breathe shadow-lg shadow-primary/50" />
          <h4 className="text-sm font-black text-foreground uppercase tracking-wide">Market Depth</h4>
        </div>
        <div className="flex items-center gap-2">
          <Select value={mode} onValueChange={(v) => setMode(v as 'depth' | 'sim')}>
            <SelectTrigger className="h-9 w-[120px] text-xs font-bold border-primary/25 bg-primary/10 hover:bg-primary/15 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depth">🔴 Live Feed</SelectItem>
              <SelectItem value="sim">📊 Simulated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Elite Mid Price Display */}
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center shadow-xl shadow-primary/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
        <div className="relative z-10">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
            Market Mid Price
          </div>
          <div className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
            ${midPrice?.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Elite Asks Panel */}
        <div className="relative overflow-hidden rounded-xl border-2 border-destructive/25 bg-gradient-to-br from-destructive/10 to-destructive/5 p-4 backdrop-blur-xl shadow-xl shadow-destructive/15">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50" />
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse shadow-lg shadow-destructive/50" />
              <span className="text-xs font-black text-destructive uppercase tracking-wider">SELL ORDERS</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-muted-foreground">{asks.length} levels</span>
          </div>
          <div className="mb-2 flex justify-between text-[10px] font-semibold text-muted-foreground uppercase">
            <span>Price</span>
            <span>Size</span>
          </div>
          <ScrollArea className="h-[240px]">
            <div className="flex flex-col-reverse space-y-0.5">
              {asks.map((ask, idx) => {
                const percentage = (ask.volume / maxVolume) * 100;
                const isLarge = percentage > 70;
                return (
                  <div
                    key={idx}
                    className={`relative flex justify-between font-mono text-xs transition-all hover:bg-destructive/5 ${
                      isLarge ? 'text-destructive font-bold' : 'text-destructive/90'
                    }`}
                  >
                    <div
                      className={`absolute right-0 top-0 h-full transition-all ${
                        isLarge ? 'bg-destructive/20' : 'bg-destructive/10'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="relative z-10 font-bold">{ask.price.toFixed(2)}</span>
                    <span className="relative z-10 text-[11px]">{ask.volume.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Elite Bids Panel */}
        <div className="relative overflow-hidden rounded-xl border-2 border-success/25 bg-gradient-to-br from-success/10 to-success/5 p-4 backdrop-blur-xl shadow-xl shadow-success/15">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-success to-transparent opacity-50" />
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-lg shadow-success/50" />
              <span className="text-xs font-black text-success uppercase tracking-wider">BUY ORDERS</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-muted-foreground">{bids.length} levels</span>
          </div>
          <div className="mb-2 flex justify-between text-[10px] font-semibold text-muted-foreground uppercase">
            <span>Price</span>
            <span>Size</span>
          </div>
          <ScrollArea className="h-[240px]">
            <div className="space-y-0.5">
              {bids.map((bid, idx) => {
                const percentage = (bid.volume / maxVolume) * 100;
                const isLarge = percentage > 70;
                return (
                  <div
                    key={idx}
                    className={`relative flex justify-between font-mono text-xs transition-all hover:bg-success/5 ${
                      isLarge ? 'text-success font-bold' : 'text-success/90'
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 h-full transition-all ${
                        isLarge ? 'bg-success/20' : 'bg-success/10'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="relative z-10 font-bold">{bid.price.toFixed(2)}</span>
                    <span className="relative z-10 text-[11px]">{bid.volume.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Spread Info */}
      <div className="metric-card rounded-xl p-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Spread</span>
          <span className="font-mono font-bold text-foreground">
            {asks.length && bids.length 
              ? `$${(asks[asks.length - 1].price - bids[0].price).toFixed(2)}`
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
