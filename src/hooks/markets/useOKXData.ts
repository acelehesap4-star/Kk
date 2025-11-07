import { useState, useEffect } from 'react';
import { exchangeAPI } from '@/lib/api/exchangeAPI';

export interface OKXPrice {
  price: number;
  timestamp: number;
  volume24h: number;
  change24h: number;
}

export interface OKXPosition {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  margin: number;
  leverage: number;
}

export function useOKXData(symbol: string) {
  const [price, setPrice] = useState<OKXPrice | null>(null);
  const [positions, setPositions] = useState<OKXPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const priceData = await exchangeAPI.okx.getPrice(symbol);
        if (mounted) {
          setPrice(priceData);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    const loadPositions = async () => {
      try {
        const positionsData = await exchangeAPI.okx.getPositions(symbol);
        if (mounted) {
          setPositions(positionsData);
        }
      } catch (err) {
        console.error('Error loading positions:', err);
      }
    };

    loadData();
    loadPositions();

    // Websocket bağlantısı
    const ws = exchangeAPI.okx.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp
        }));
      }
    });

    return () => {
      mounted = false;
      ws.close();
    };
  }, [symbol]);

  return {
    price,
    positions,
    loading,
    error
  };
}
