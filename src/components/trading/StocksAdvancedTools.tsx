import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StockMetrics {
  symbol: string;
  pe: number;
  eps: number;
  marketCap: number;
  volume: number;
  dividend: number;
  beta: number;
}

export const StocksAdvancedTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [metrics, setMetrics] = React.useState<StockMetrics | null>(null);
  const [sectorPerformance, setSectorPerformance] = React.useState<Record<string, number>>({});
  const [newsItems, setNewsItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Simüle edilmiş veri - gerçek API'lerle değiştirilmeli
    setMetrics({
      symbol,
      pe: 25.4,
      eps: 2.75,
      marketCap: 2000000000,
      volume: 1500000,
      dividend: 1.5,
      beta: 1.2
    });

    setSectorPerformance({
      'Technology': 2.5,
      'Healthcare': -1.2,
      'Finance': 0.8,
      'Energy': -0.5,
      'Consumer': 1.3
    });

    setNewsItems([
      {
        id: 1,
        title: 'Quarterly Earnings Beat Expectations',
        date: '2025-11-06',
        sentiment: 'positive'
      },
      {
        id: 2,
        title: 'New Product Launch Announced',
        date: '2025-11-05',
        sentiment: 'positive'
      },
      {
        id: 3,
        title: 'Market Share Declined in Q3',
        date: '2025-11-04',
        sentiment: 'negative'
      }
    ]);
  }, [symbol]);

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    return `$${num.toFixed(2)}`;
  };

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hisse Senedi Gelişmiş Araçlar</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fundamentals">
          <TabsList>
            <TabsTrigger value="fundamentals">Temel Analiz</TabsTrigger>
            <TabsTrigger value="sector">Sektör Analizi</TabsTrigger>
            <TabsTrigger value="news">Haberler</TabsTrigger>
          </TabsList>

          <TabsContent value="fundamentals" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">F/K Oranı</div>
                <div className="text-lg font-semibold">{metrics.pe.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Hisse Başı Kazanç</div>
                <div className="text-lg font-semibold">${metrics.eps.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Piyasa Değeri</div>
                <div className="text-lg font-semibold">{formatLargeNumber(metrics.marketCap)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">İşlem Hacmi</div>
                <div className="text-lg font-semibold">{formatLargeNumber(metrics.volume)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Temettü Getirisi</div>
                <div className="text-lg font-semibold">%{metrics.dividend.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Beta</div>
                <div className="text-lg font-semibold">{metrics.beta.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sector">
            <ScrollArea className="h-[300px]">
              {Object.entries(sectorPerformance).map(([sector, performance]) => (
                <div key={sector} className="flex items-center justify-between py-2">
                  <span className="font-medium">{sector}</span>
                  <span 
                    className={performance > 0 ? 'text-green-500' : 'text-red-500'}
                  >
                    {performance > 0 ? '+' : ''}{performance.toFixed(2)}%
                  </span>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="news">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <div key={news.id} className="space-y-1">
                    <div className="font-medium">{news.title}</div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{news.date}</span>
                      <span 
                        className={
                          news.sentiment === 'positive' ? 'text-green-500' : 
                          news.sentiment === 'negative' ? 'text-red-500' : 
                          'text-yellow-500'
                        }
                      >
                        {news.sentiment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};