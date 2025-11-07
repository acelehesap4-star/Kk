import { useEffect, useState } from 'react';
import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';

export interface DepthData {
  bids: [number, number][];
  asks: [number, number][];
}

interface ProcessedDepthData {
  bidsDepth: { x: number; y: number }[];
  asksDepth: { x: number; y: number }[];
}

export function useDepthData(exchange: Exchange, symbol: string) {
  const [depthData, setDepthData] = useState<DepthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        setLoading(true);
        let url = '';
        
        if (exchange === 'BINANCE') {
          url = EXCHANGES.BINANCE.depth(symbol, 100);
        } else if (exchange === 'OKX') {
          url = EXCHANGES.OKX.depth(symbol);
        } else if (exchange === 'KUCOIN') {
          url = EXCHANGES.KUCOIN.depth(symbol);
        } else if (exchange === 'COINBASE') {
          url = EXCHANGES.COINBASE.depth(symbol);
        }

        const response = await fetch(url);
        const data = await response.json();

        let bids: [number, number][] = [];
        let asks: [number, number][] = [];

        if (exchange === 'BINANCE') {
          bids = data.bids.slice(0, 50).map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]);
          asks = data.asks.slice(0, 50).map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]);
        } else if (exchange === 'OKX') {
          const d = data.data || data;
          bids = (d.bids || []).slice(0, 50).map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]);
          asks = (d.asks || []).slice(0, 50).map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]);
        } else if (exchange === 'KUCOIN') {
          const d = data.data || data;
          bids = (d.bids || []).slice(0, 50).map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]);
          asks = (d.asks || []).slice(0, 50).map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]);
        } else if (exchange === 'COINBASE') {
          bids = (data.bids || []).slice(0, 50).map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]);
          asks = (data.asks || []).slice(0, 50).map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]);
        }

        setDepthData({ bids, asks });
      } catch (error) {
        console.error('Failed to fetch depth data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepth();
    const interval = setInterval(fetchDepth, 5000);
    return () => clearInterval(interval);
  }, [exchange, symbol]);

  const processedData: ProcessedDepthData | null = depthData ? {
    bidsDepth: (() => {
      let bidsCumulative = 0;
      return depthData.bids.map(([price, volume]) => {
        bidsCumulative += volume;
        return { x: price, y: bidsCumulative };
      }).reverse();
    })(),
    asksDepth: (() => {
      let asksCumulative = 0;
      return depthData.asks.map(([price, volume]) => {
        asksCumulative += volume;
        return { x: price, y: asksCumulative };
      });
    })()
  } : null;

  return { loading, processedData };
}