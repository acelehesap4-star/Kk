import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, BarChart2, Globe2, TrendingUp } from 'lucide-react';
import { useForexData } from '@/hooks/markets/useForexData';

interface ForexMarketToolsProps {
  symbol: string;
  userId: string;
}

export function ForexMarketTools({ symbol, userId }: ForexMarketToolsProps) {
  const { price, pairInfo, indicators, sentiment, loading, error } = useForexData(symbol);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" />
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
              <span>Alış:</span>
              <span className="text-xl font-bold">
                {price ? price.bid.toFixed(5) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Satış:</span>
              <span className="text-xl font-bold">
                {price ? price.ask.toFixed(5) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Spread:</span>
              <span className="text-sm font-medium">
                {price ? (price.spread * 10000).toFixed(1) + ' pips' : '-'}
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
              <Globe2 className="h-4 w-4" />
              Parite Detayları
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pairInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span>İşlem Saatleri:</span>
                  <span className="font-medium">{pairInfo.tradingHours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pip Değeri:</span>
                  <span className="font-medium">${pairInfo.pipValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Teminat Oranı:</span>
                  <span className="font-medium">%{pairInfo.marginRequirement * 100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kaldıraç:</span>
                  <div className="flex gap-2">
                    {pairInfo.leverage.map((lev, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                        {lev}x
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
              Ekonomik Göstergeler
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {indicators.length > 0 ? (
              indicators.map((indicator, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {indicator.name}
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        indicator.impact === 'high'
                          ? 'bg-red-100 text-red-800'
                          : indicator.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {indicator.impact}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{indicator.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{indicator.value}</div>
                    <div className="text-sm text-gray-500">
                      Beklenti: {indicator.forecast}
                    </div>
                    <div className="text-xs text-gray-400">
                      Önceki: {indicator.previous}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Yaklaşan gösterge bulunmuyor
              </div>
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
                  <span>Net Uzun:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.netLong >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sentiment.netLong.toFixed(1)}%
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Günlük Değişim:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.dailyChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sentiment.dailyChange.toFixed(1)}%
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Momentum:</span>
                  <div className={`px-2 py-1 rounded ${
                    sentiment.momentum === 'bullish'
                      ? 'bg-green-100 text-green-800'
                      : sentiment.momentum === 'bearish'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sentiment.momentum.toUpperCase()}
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
