import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Activity,
  AlertTriangle
} from 'lucide-react';

interface MarketToolsProps {
  exchange: string;
  symbol: string;
  marketType: 'stocks' | 'forex' | 'commodities' | 'indices';
}

// Hisse Senedi Piyasası Araçları
const StockMarketTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            Temel Analiz Göstergeleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>F/K Oranı:</span>
              <span className="font-medium">16.8</span>
            </div>
            <div className="flex justify-between">
              <span>PD/DD:</span>
              <span className="font-medium">2.4</span>
            </div>
            <div className="flex justify-between">
              <span>Temettü Verimi:</span>
              <span className="font-medium">3.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Kurumsal İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Son Büyük İşlemler</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>BlackRock</span>
                  <span className="text-green-600">+250K</span>
                </div>
                <div className="flex justify-between">
                  <span>Vanguard</span>
                  <span className="text-red-600">-120K</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Forex Piyasası Araçları
const ForexTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ekonomik Takvim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Yaklaşan Olaylar</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span>FED Faiz Kararı</span>
                  <span className="text-yellow-600">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Yüksek Etki
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>İşsizlik Oranı</span>
                  <span className="text-orange-600">Orta Etki</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Pivot Noktaları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>R3:</span>
              <span className="font-medium">1.2580</span>
            </div>
            <div className="flex justify-between">
              <span>R2:</span>
              <span className="font-medium">1.2540</span>
            </div>
            <div className="flex justify-between">
              <span>R1:</span>
              <span className="font-medium">1.2510</span>
            </div>
            <div className="flex justify-between text-green-600 font-bold">
              <span>Pivot:</span>
              <span>1.2485</span>
            </div>
            <div className="flex justify-between">
              <span>S1:</span>
              <span className="font-medium">1.2460</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Emtia Piyasası Araçları
const CommodityTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Küresel Stok Seviyeleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ABD Stokları:</span>
              <span className="font-medium">432M varil</span>
            </div>
            <div className="flex justify-between">
              <span>OECD Stokları:</span>
              <span className="font-medium">2.8B varil</span>
            </div>
            <div className="flex justify-between">
              <span>Kapasite Kullanımı:</span>
              <span className="font-medium">85%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Üretici Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Üretim Maliyeti:</span>
              <span className="font-medium">$45/varil</span>
            </div>
            <div className="flex justify-between">
              <span>Kâr Marjı:</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="flex justify-between">
              <span>Kapasite:</span>
              <span className="font-medium">12M varil/gün</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Endeks Piyasası Araçları
const IndexTools: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Sektör Ağırlıkları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Teknoloji:</span>
              <span className="font-medium">28.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Finans:</span>
              <span className="font-medium">18.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Sağlık:</span>
              <span className="font-medium">15.4%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Momentum Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>RSI (14):</span>
              <span className="font-medium">62.5</span>
            </div>
            <div className="flex justify-between">
              <span>MACD:</span>
              <span className="text-green-600">Pozitif Yakınsama</span>
            </div>
            <div className="flex justify-between">
              <span>Stokastik:</span>
              <span className="text-yellow-600">Nötr</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const MarketSpecificTools: React.FC<MarketToolsProps> = ({ exchange, symbol, marketType }) => {
  const getMarketTools = () => {
    switch (marketType) {
      case 'stocks':
        return <StockMarketTools symbol={symbol} />;
      case 'forex':
        return <ForexTools symbol={symbol} />;
      case 'commodities':
        return <CommodityTools symbol={symbol} />;
      case 'indices':
        return <IndexTools symbol={symbol} />;
      default:
        return <div>Bu piyasa türü için özel araçlar henüz eklenmemiş.</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{exchange} - {marketType.toUpperCase()} Özel Araçları</CardTitle>
      </CardHeader>
      <CardContent>
        {getMarketTools()}
      </CardContent>
    </Card>
  );
};