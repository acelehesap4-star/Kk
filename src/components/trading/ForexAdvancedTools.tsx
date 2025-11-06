import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealMarketData } from '@/hooks/useRealMarketData';

interface ForexCorrelationItem {
  pair1: string;
  pair2: string;
  correlation: number;
}

export const ForexAdvancedTools: React.FC = () => {
  const majorPairs = ['EUR_USD', 'GBP_USD', 'USD_JPY', 'USD_CHF', 'USD_CAD', 'AUD_USD', 'NZD_USD'];
  
  const { marketData } = useRealMarketData(
    majorPairs,
    'forex',
    'OANDA'
  );

  const [correlations, setCorrelations] = React.useState<ForexCorrelationItem[]>([]);
  const [pivotPoints, setPivotPoints] = React.useState<Record<string, any>>({});

  // Calculate correlations
  React.useEffect(() => {
    if (marketData.length > 0) {
      const newCorrelations: ForexCorrelationItem[] = [];
      
      for (let i = 0; i < majorPairs.length; i++) {
        for (let j = i + 1; j < majorPairs.length; j++) {
          const pair1Data = marketData.find(d => d.symbol === majorPairs[i]);
          const pair2Data = marketData.find(d => d.symbol === majorPairs[j]);
          
          if (pair1Data && pair2Data) {
            // Simplified correlation calculation
            const correlation = Math.random() * 2 - 1; // Replace with actual correlation calculation
            newCorrelations.push({
              pair1: majorPairs[i],
              pair2: majorPairs[j],
              correlation
            });
          }
        }
      }
      
      setCorrelations(newCorrelations);
    }
  }, [marketData]);

  // Calculate pivot points
  React.useEffect(() => {
    if (marketData.length > 0) {
      const newPivotPoints: Record<string, any> = {};
      
      marketData.forEach(data => {
        const high = data.high24h;
        const low = data.low24h;
        const close = data.price;
        
        const pp = (high + low + close) / 3;
        const r1 = 2 * pp - low;
        const s1 = 2 * pp - high;
        const r2 = pp + (high - low);
        const s2 = pp - (high - low);
        
        newPivotPoints[data.symbol] = {
          pp,
          r1,
          r2,
          s1,
          s2
        };
      });
      
      setPivotPoints(newPivotPoints);
    }
  }, [marketData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forex Gelişmiş Araçlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Para Birimi Korelasyonları */}
          <div>
            <h3 className="font-semibold mb-2">Para Birimi Korelasyonları</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {correlations.map((corr, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">
                      {corr.pair1} / {corr.pair2}
                    </span>
                    <span 
                      className={`text-sm font-medium ${
                        corr.correlation > 0.7 ? 'text-green-500' :
                        corr.correlation < -0.7 ? 'text-red-500' :
                        'text-yellow-500'
                      }`}
                    >
                      {corr.correlation.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Pivot Noktaları */}
          <div>
            <h3 className="font-semibold mb-2">Pivot Noktaları</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {Object.entries(pivotPoints).map(([symbol, levels]: [string, any]) => (
                  <div key={symbol} className="space-y-2">
                    <div className="font-medium">{symbol}</div>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">R2</div>
                        <div>{levels.r2.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">R1</div>
                        <div>{levels.r1.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">PP</div>
                        <div>{levels.pp.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">S1</div>
                        <div>{levels.s1.toFixed(4)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">S2</div>
                        <div>{levels.s2.toFixed(4)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};