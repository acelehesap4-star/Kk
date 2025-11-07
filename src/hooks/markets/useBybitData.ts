import { useState, useEffect } from 'react';
import { exchangeAPI } from '@/lib/api/exchangeAPI';

export interface BybitPrice {
  price: number;
  timestamp: number;
  volume24h: number;
  change24h: number;
  fundingRate: number;
  nextFundingTime: Date;
}

export interface BybitPosition {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  margin: number;
  leverage: number;
  liquidationPrice: number;
  marginRatio: number;
}

export function useBybitData(symbol: string) {
  const [price, setPrice] = useState<BybitPrice | null>(null);
  const [positions, setPositions] = useState<BybitPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const priceData = await exchangeAPI.bybit.getPrice(symbol);
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
        const positionsData = await exchangeAPI.bybit.getPositions(symbol);
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
    const ws = exchangeAPI.bybit.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp,
          fundingRate: data.fundingRate,
          nextFundingTime: data.nextFundingTime
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
