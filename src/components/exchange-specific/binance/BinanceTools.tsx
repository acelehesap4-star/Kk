import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, BookOpen, PieChart } from 'lucide-react';
import { useBinanceData } from '@/hooks/exchanges/useBinanceData';

interface BinanceToolsProps {
  symbol: string;
  userId: string;
}

export function BinanceTools({ symbol, userId }: BinanceToolsProps) {
  const { price: currentPrice, positions, orderBook, loading, error } = useBinanceData(symbol);
  
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
                {currentPrice ? `$${currentPrice.price.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>24s Değişim:</span>
              <div className={`px-2 py-1 rounded ${
                currentPrice?.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentPrice ? `${currentPrice.change24h.toFixed(2)}%` : '-'}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>24s Hacim:</span>
              <span>
                {currentPrice ? `$${currentPrice.volume24h.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>24s Yüksek:</span>
              <span>
                {currentPrice ? `$${currentPrice.high24h.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>24s Düşük:</span>
              <span>
                {currentPrice ? `$${currentPrice.low24h.toLocaleString()}` : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Pozisyonlar
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length > 0 ? (
            <div className="space-y-4">
              {positions.map((position, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div>
                    <div className="font-medium">{position.symbol}</div>
                    <div className="text-sm text-gray-500">
                      {position.size} × {position.leverage}x
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${position.pnl.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Entry: ${position.entryPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Açık pozisyon bulunmuyor
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Emir Defteri
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderBook ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-green-600 font-medium mb-2">Alış Emirleri</div>
                <div className="space-y-1">
                  {orderBook.bids.slice(0, 5).map((bid, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-green-500">${bid.price.toFixed(2)}</span>
                      <span className="text-gray-500">{bid.amount.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-red-600 font-medium mb-2">Satış Emirleri</div>
                <div className="space-y-1">
                  {orderBook.asks.slice(0, 5).map((ask, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-red-500">${ask.price.toFixed(2)}</span>
                      <span className="text-gray-500">{ask.amount.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Emir defteri yükleniyor...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
