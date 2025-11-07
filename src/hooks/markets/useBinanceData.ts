import { useState, useEffect } from 'react';
import { exchangeAPI } from '@/lib/api/exchangeAPI';

export interface BinancePrice {
  price: number;
  timestamp: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export interface BinancePosition {
  symbol: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  margin: number;
  leverage: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

export function useBinanceData(symbol: string) {
  const [price, setPrice] = useState<BinancePrice | null>(null);
  const [positions, setPositions] = useState<BinancePosition[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [priceData, orderBookData] = await Promise.all([
          exchangeAPI.binance.getPrice(symbol),
          exchangeAPI.binance.getOrderBook(symbol)
        ]);

        if (mounted) {
          setPrice(priceData);
          setOrderBook(orderBookData);
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
        const positionsData = await exchangeAPI.binance.getPositions(symbol);
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
    const ws = exchangeAPI.binance.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp
        }));
      }
    });

    const wsOrderBook = exchangeAPI.binance.subscribeToOrderBook(symbol, (data) => {
      if (mounted) {
        setOrderBook(data);
      }
    });

    return () => {
      mounted = false;
      ws.close();
      wsOrderBook.close();
    };
  }, [symbol]);

  return {
    price,
    positions,
    orderBook,
    loading,
    error
  };
}
