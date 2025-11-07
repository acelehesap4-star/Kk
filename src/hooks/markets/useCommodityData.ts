import { useState, useEffect } from 'react';
import { marketAPI } from '@/lib/api/marketAPI';

export interface CommodityPrice {
  price: number;
  timestamp: number;
  volume: number;
  change: number;
  high: number;
  low: number;
  openInterest: number;
  deliveryDate: Date;
  storageLevel: number;
}

export interface CommodityInfo {
  name: string;
  category: string;
  unit: string;
  description: string;
  mainProducers: string[];
  mainConsumers: string[];
  seasonality: string[];
}

export interface SupplyDemand {
  production: number;
  consumption: number;
  inventory: number;
  surplus: number;
  forecastProduction: number;
  forecastConsumption: number;
}

export interface WeatherImpact {
  region: string;
  condition: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  duration: string;
}

export function useCommodityData(symbol: string) {
  const [price, setPrice] = useState<CommodityPrice | null>(null);
  const [info, setInfo] = useState<CommodityInfo | null>(null);
  const [supplyDemand, setSupplyDemand] = useState<SupplyDemand | null>(null);
  const [weatherImpacts, setWeatherImpacts] = useState<WeatherImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [priceData, infoData, supplyData, weatherData] = await Promise.all([
          marketAPI.commodities.getPrice(symbol),
          marketAPI.commodities.getCommodityInfo(symbol),
          marketAPI.commodities.getSupplyDemand(symbol),
          marketAPI.commodities.getWeatherImpacts(symbol)
        ]);

        if (mounted) {
          setPrice(priceData);
          setInfo(infoData);
          setSupplyDemand(supplyData);
          setWeatherImpacts(weatherData);
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
    const ws = marketAPI.commodities.subscribeToTicker(symbol, (data) => {
      if (mounted) {
        setPrice(prev => ({
          ...prev,
          price: data.price,
          timestamp: data.timestamp,
          openInterest: data.openInterest,
          storageLevel: data.storageLevel
        }));
      }
    });

    // Hava durumu güncellemeleri
    const wsWeather = marketAPI.commodities.subscribeToWeatherUpdates(symbol, (data) => {
      if (mounted) {
        setWeatherImpacts(prev => [...prev, data]);
      }
    });

    return () => {
      mounted = false;
      ws.close();
      wsWeather.close();
    };
  }, [symbol]);

  return {
    price,
    info,
    supplyDemand,
    weatherImpacts,
    loading,
    error
  };
}
