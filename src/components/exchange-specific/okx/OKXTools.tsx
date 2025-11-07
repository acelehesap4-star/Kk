import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, PieChart } from 'lucide-react';
import { useOKXData } from '@/hooks/exchanges/useOKXData';

interface OKXToolsProps {
  symbol: string;
  userId: string;
}

export function OKXTools({ symbol, userId }: OKXToolsProps) {
  const { price: currentPrice, positions, loading, error } = useOKXData(symbol);
  
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
    </div>
  );
}
