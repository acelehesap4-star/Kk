import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, BarChart2, Package, TrendingUp } from 'lucide-react';
import { useCommodityData } from '@/hooks/markets/useCommodityData';

interface CommodityMarketToolsProps {
  symbol: string;
  userId: string;
}

export function CommodityMarketTools({ symbol, userId }: CommodityMarketToolsProps) {
  const { price, commodityInfo, marketData, sentiment, loading, error } = useCommodityData(symbol);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Veriler yüklenirken bir hata oluştu</p>
        <p className="text-red-400/60 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Fiyat Bilgisi
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Spot Fiyat:</span>
              <span className="text-xl font-bold">
                ${price ? price.spot.toFixed(2) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Futures Fiyat:</span>
              <span className="text-xl font-bold">
                ${price ? price.futures.toFixed(2) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Contango/Backwardation:</span>
              <span className={`text-sm font-medium ${
                price?.basis > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {price ? `${price.basis > 0 ? 'Contango' : 'Backwardation'} (${Math.abs(price.basis).toFixed(2)}%)` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>24s Değişim:</span>
              <div className={`px-2 py-1 rounded ${
                price?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {price ? `${price.change.toFixed(2)}%` : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Emtia Detayları
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commodityInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span>Teslimat Birimi:</span>
                  <span className="font-medium">{commodityInfo.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Min. İşlem Miktarı:</span>
                  <span className="font-medium">{commodityInfo.minTradeSize} {commodityInfo.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kontrat Büyüklüğü:</span>
                  <span className="font-medium">{commodityInfo.contractSize} {commodityInfo.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Teslimat Ayları:</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {commodityInfo.deliveryMonths.map((month, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Piyasa Verileri
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData && (
              <>
                <div className="flex justify-between items-center">
                  <span>Global Üretim:</span>
                  <span className="font-medium">{marketData.globalProduction.toLocaleString()} {commodityInfo?.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Global Talep:</span>
                  <span className="font-medium">{marketData.globalDemand.toLocaleString()} {commodityInfo?.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stoklar:</span>
                  <div className={`px-2 py-1 rounded ${
                    marketData.stockpileChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {marketData.stockpileChange >= 0 ? '+' : ''}{marketData.stockpileChange.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  <div className="font-medium mb-2">Üretici Ülkeler:</div>
                  <div className="space-y-2">
                    {marketData.topProducers.map((producer, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span>{producer.country}</span>
                        <span className="text-sm">{producer.share}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Piyasa Duyarlılığı
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentiment && (
              <>
                <div className="flex justify-between items-center">
                  <span>Uzun Pozisyonlar:</span>
                  <span className="font-medium">%{((sentiment.longPositions / (sentiment.longPositions + sentiment.shortPositions)) * 100).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kısa Pozisyonlar:</span>
                  <span className="font-medium">%{((sentiment.shortPositions / (sentiment.longPositions + sentiment.shortPositions)) * 100).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mevsimsellik:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.seasonality === 'strong'
                      ? 'bg-green-100 text-green-800'
                      : sentiment.seasonality === 'weak'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sentiment.seasonality.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hava Durumu Etkisi:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.weatherImpact === 'positive'
                      ? 'bg-green-100 text-green-800'
                      : sentiment.weatherImpact === 'negative'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sentiment.weatherImpact.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Genel Görünüm:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.outlook === 'bullish'
                      ? 'bg-green-100 text-green-800' 
                      : sentiment.outlook === 'bearish'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sentiment.outlook.toUpperCase()}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
