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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Order Book</h4>
        <div className="flex items-center gap-2">
          <Select value={mode} onValueChange={(v) => setMode(v as 'depth' | 'sim')}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depth">Real Data</SelectItem>
              <SelectItem value="sim">Simulation</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            Mid: <span className="font-mono font-bold text-primary">{midPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Asks */}
        <div className="rounded-lg border border-border bg-card/30 p-2">
          <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Price</span>
            <span>Volume</span>
          </div>
          <ScrollArea className="h-[220px]">
            <div className="flex flex-col-reverse space-y-0.5">
              {asks.map((ask, idx) => {
                const percentage = (ask.volume / maxVolume) * 100;
                return (
                  <div
                    key={idx}
                    className="relative flex justify-between font-mono text-xs text-destructive"
                  >
                    <div
                      className="absolute right-0 top-0 h-full bg-destructive/10"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="relative z-10 font-bold">{ask.price.toFixed(2)}</span>
                    <span className="relative z-10">{ask.volume.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Bids */}
        <div className="rounded-lg border border-border bg-card/30 p-2">
          <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Price</span>
            <span>Volume</span>
          </div>
          <ScrollArea className="h-[220px]">
            <div className="space-y-0.5">
              {bids.map((bid, idx) => {
                const percentage = (bid.volume / maxVolume) * 100;
                return (
                  <div
                    key={idx}
                    className="relative flex justify-between font-mono text-xs text-success"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-success/10"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="relative z-10 font-bold">{bid.price.toFixed(2)}</span>
                    <span className="relative z-10">{bid.volume.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
