import { useState, useEffect } from 'react';
import { marketAPI } from '@/lib/api/marketAPI';

export interface StockPrice {
  price: number;
  timestamp: number;
  volume: number;
  change: number;
  high: number;
  low: number;
  open: number;
  close: number;
  marketCap: number;
  pe: number;
  eps: number;
  dividend: number;
}

export interface CompanyInfo {
  name: string;
  sector: string;
  industry: string;
  employees: number;
  founded: number;
  ceo: string;
  headquarters: string;
}

export interface AnalystRating {
  firm: string;
  rating: 'buy' | 'hold' | 'sell';
  targetPrice: number;
  date: Date;
}

export interface FinancialMetrics {
  revenue: number;
  netIncome: number;
  operatingMargin: number;
  debtToEquity: number;
  currentRatio: number;
  quickRatio: number;
  roa: number;
  roe: number;
}

export function useStockMarketData(symbol: string) {
  const [price, setPrice] = useState<StockPrice | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [ratings, setRatings] = useState<AnalystRating[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [priceData, companyData, ratingsData, metricsData] = await Promise.all([
          marketAPI.stocks.getPrice(symbol),
          marketAPI.stocks.getCompanyInfo(symbol),
          marketAPI.stocks.getAnalystRatings(symbol),
          marketAPI.stocks.getFinancialMetrics(symbol)
        ]);

        if (mounted) {
          setPrice(priceData);
          setCompanyInfo(companyData);
          setRatings(ratingsData);
          setMetrics(metricsData);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    loadData();

    // Websocket bağlantısı
    const ws = marketAPI.stocks.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp,
          volume: data.volume,
          high: data.high,
          low: data.low
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
    companyInfo,
    ratings,
    metrics,
    loading,
    error
  };
}
