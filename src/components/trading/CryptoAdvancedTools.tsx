import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, BarChart2, ChevronDown, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { tradingService } from '@/lib/services/tradingService';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CryptoAdvancedToolsProps {
  symbol: string;
}

export const CryptoAdvancedTools: React.FC<CryptoAdvancedToolsProps> = ({ symbol }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('market');
  const [amount, setAmount] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleTrade = async (side: 'buy' | 'sell') => {
    try {
      setLoading(true);
      await tradingService.placeOrder({
        userId: 'current-user', // Bu değer auth sisteminden gelmeli
        marketType: 'CRYPTO',
        symbol,
        side,
        orderType: activeTab as 'market' | 'limit',
        quantity: parseFloat(amount),
        price: activeTab === 'limit' ? parseFloat(price) : undefined,
        exchange: 'BINANCE'
      });

      toast({
        title: "İşlem Başarılı",
        description: `${symbol} ${side === 'buy' ? 'alış' : 'satış'} emri verildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "İşlem gerçekleştirilemedi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gelişmiş İşlem Araçları - {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Piyasa</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="analysis">Analiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Miktar</label>
                <Input
                  type="number"
                  placeholder="İşlem miktarı"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleTrade('buy')}
                  disabled={loading}
                >
                  Al
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleTrade('sell')}
                  disabled={loading}
                >
                  Sat
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="limit">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Fiyat</label>
                <Input
                  type="number"
                  placeholder="Limit fiyat"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Miktar</label>
                <Input
                  type="number"
                  placeholder="İşlem miktarı"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleTrade('buy')}
                  disabled={loading}
                >
                  Limit Al
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleTrade('sell')}
                  disabled={loading}
                >
                  Limit Sat
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RSI</span>
                      <span className="text-lg font-bold">65.4</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MACD</span>
                      <span className="text-lg font-bold text-green-500">Yükseliş</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="İndikatör Seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                  <SelectItem value="bollinger">Bollinger</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

      return () => {
        provider.removeAllListeners('block');
      };
    }
  }, [account, chainId]);

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kripto Gelişmiş Araçlar</CardTitle>
        </CardHeader>
        <CardContent>
          Cüzdan bağlantısı gerekli
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kripto Gelişmiş Araçlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">ETH Bakiye</div>
              <div className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} ETH</div>
            </div>
            <div>
              <div className="text-sm font-medium">Gas Fiyatı</div>
              <div className="text-2xl font-bold">{parseFloat(gasPrice).toFixed(2)} Gwei</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};