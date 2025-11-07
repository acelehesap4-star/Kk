import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Building2, LineChart, Target, TrendingUp, Users } from 'lucide-react';
import { useStockMarketData } from '@/hooks/markets/useStockMarketData';

interface StockMarketToolsProps {
  symbol: string;
  userId: string;
}

export function StockMarketTools({ symbol, userId }: StockMarketToolsProps) {
  const { price, companyInfo, ratings, metrics, loading, error } = useStockMarketData(symbol);

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
              <span>Anlık Fiyat:</span>
              <span className="text-xl font-bold">
                {price ? `$${price.price.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Günlük Değişim:</span>
              <div className={`px-2 py-1 rounded ${
                price?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {price ? `${price.change.toFixed(2)}%` : '-'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Hacim:</span>
              <span>
                {price ? price.volume.toLocaleString() : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Piyasa Değeri:</span>
              <span>
                {price ? `$${(price.marketCap / 1e9).toFixed(2)}B` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>F/K Oranı:</span>
              <span>
                {price?.pe ? price.pe.toFixed(2) : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Şirket Bilgileri
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span>Sektör:</span>
                  <span className="font-medium">{companyInfo.sector}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Endüstri:</span>
                  <span className="font-medium">{companyInfo.industry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CEO:</span>
                  <span className="font-medium">{companyInfo.ceo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Çalışan Sayısı:</span>
                  <span className="font-medium">{companyInfo.employees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Kuruluş:</span>
                  <span className="font-medium">{companyInfo.founded}</span>
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
              <Target className="h-4 w-4" />
              Analist Tavsiyeleri
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratings.length > 0 ? (
              ratings.map((rating, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div>
                    <div className="font-medium">{rating.firm}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(rating.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      rating.rating === 'buy' 
                        ? 'text-green-500' 
                        : rating.rating === 'sell' 
                          ? 'text-red-500' 
                          : 'text-yellow-500'
                    }`}>
                      {rating.rating.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Target: ${rating.targetPrice}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Analist tavsiyesi bulunmuyor
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Finansal Metrikler
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics && (
              <>
                <div className="flex justify-between items-center">
                  <span>Gelir:</span>
                  <span className="font-medium">${(metrics.revenue / 1e9).toFixed(2)}B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Net Kâr:</span>
                  <span className="font-medium">${(metrics.netIncome / 1e9).toFixed(2)}B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Faaliyet Marjı:</span>
                  <span className="font-medium">%{(metrics.operatingMargin * 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ROE:</span>
                  <span className="font-medium">%{(metrics.roe * 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Borç/Özkaynak:</span>
                  <span className="font-medium">{metrics.debtToEquity.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
