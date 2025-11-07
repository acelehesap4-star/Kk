import { useState, useEffect } from 'react';
import { exchangeAPI } from '@/lib/api/exchangeAPI';

export interface KuCoinPrice {
  price: number;
  timestamp: number;
  volume24h: number;
  change24h: number;
  spotVolume: number;
  futuresVolume: number;
}

export interface KuCoinPosition {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  margin: number;
  leverage: number;
  mode: 'cross' | 'isolated';
}

export function useKuCoinData(symbol: string) {
  const [price, setPrice] = useState<KuCoinPrice | null>(null);
  const [positions, setPositions] = useState<KuCoinPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const priceData = await exchangeAPI.kucoin.getPrice(symbol);
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
        const positionsData = await exchangeAPI.kucoin.getPositions(symbol);
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
    const ws = exchangeAPI.kucoin.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp,
          spotVolume: data.spotVolume,
          futuresVolume: data.futuresVolume
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
