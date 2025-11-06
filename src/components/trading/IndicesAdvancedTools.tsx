import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart } from 'lucide-react';

interface IndexComponent {
  symbol: string;
  weight: number;
  change: number;
}

interface MarketBreadth {
  advancing: number;
  declining: number;
  unchanged: number;
  newHighs: number;
  newLows: number;
  advanceVolume: number;
  declineVolume: number;
}

export const IndicesAdvancedTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [components, setComponents] = React.useState<IndexComponent[]>([]);
  const [breadth, setBreadth] = React.useState<MarketBreadth | null>(null);
  const [sectorWeights, setSectorWeights] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Simüle edilmiş veri - gerçek API'lerle değiştirilmeli
    setComponents([
      { symbol: 'AAPL', weight: 6.5, change: 1.2 },
      { symbol: 'MSFT', weight: 5.8, change: -0.8 },
      { symbol: 'GOOGL', weight: 4.2, change: 0.5 },
      { symbol: 'AMZN', weight: 3.9, change: 2.1 },
      { symbol: 'META', weight: 2.1, change: -1.5 }
    ]);

    setBreadth({
      advancing: 245,
      declining: 187,
      unchanged: 68,
      newHighs: 15,
      newLows: 8,
      advanceVolume: 450000000,
      declineVolume: 320000000
    });

    setSectorWeights({
      'Technology': 28.5,
      'Healthcare': 15.2,
      'Financials': 13.8,
      'Consumer Discretionary': 11.5,
      'Communication Services': 8.7,
      'Industrials': 8.4,
      'Consumer Staples': 6.9,
      'Energy': 4.2,
      'Materials': 2.8
    });
  }, [symbol]);

  const formatVolume = (volume: number) => {
    return `${(volume / 1e6).toFixed(1)}M`;
  };

  const getAdvanceDeclineRatio = () => {
    if (!breadth) return 0;
    return (breadth.advancing / breadth.declining).toFixed(2);
  };

  if (!breadth) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endeks Gelişmiş Araçlar</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market-breadth">
          <TabsList>
            <TabsTrigger value="market-breadth">
              <BarChart className="h-4 w-4 mr-2" />
              Piyasa Genişliği
            </TabsTrigger>
            <TabsTrigger value="components">
              <LineChart className="h-4 w-4 mr-2" />
              Bileşenler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market-breadth" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Yükselen/Düşen Oranı</div>
                <div className="text-lg font-semibold">{getAdvanceDeclineRatio()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Yeni Zirveler</div>
                <div className="text-lg font-semibold text-green-500">{breadth.newHighs}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Yeni Dipleri</div>
                <div className="text-lg font-semibold text-red-500">{breadth.newLows}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Hacim Oranı</div>
                <div className="text-lg font-semibold">
                  {(breadth.advanceVolume / breadth.declineVolume).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Sektör Ağırlıkları</h3>
              <ScrollArea className="h-[200px]">
                {Object.entries(sectorWeights).map(([sector, weight]) => (
                  <div key={sector} className="flex items-center justify-between py-2">
                    <span className="text-sm">{sector}</span>
                    <span className="font-medium">%{weight.toFixed(1)}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="components">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {components.map((component) => (
                  <div key={component.symbol} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{component.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Ağırlık: %{component.weight.toFixed(1)}
                      </div>
                    </div>
                    <div 
                      className={`text-lg font-semibold ${
                        component.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {component.change > 0 ? '+' : ''}{component.change.toFixed(2)}%
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