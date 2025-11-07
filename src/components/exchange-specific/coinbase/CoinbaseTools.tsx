import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Shield, 
  Coins,
  BarChart3,
  DollarSign,
  Settings,
  Activity,
  Wallet,
  CreditCard,
  University,
  Repeat
} from 'lucide-react';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { toast } from 'sonner';

interface CoinbaseToolsProps {
  symbol: string;
  userId: string;
}

interface CoinbaseEarnProgram {
  asset: string;
  apy: number;
  minAmount: number;
  description: string;
  duration: string;
  status: 'AVAILABLE' | 'WAITLIST' | 'FULL';
}

interface CoinbaseAdvancedOrder {
  id: string;
  type: 'STOP_LOSS' | 'TAKE_PROFIT' | 'TRAILING_STOP' | 'OCO';
  symbol: string;
  side: 'BUY' | 'SELL';
  triggerPrice: number;
  limitPrice?: number;
  trailingAmount?: number;
  status: 'ACTIVE' | 'TRIGGERED' | 'CANCELLED';
}

interface CoinbaseRecurringBuy {
  asset: string;
  amount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  nextExecution: Date;
  totalInvested: number;
  averagePrice: number;
  status: 'ACTIVE' | 'PAUSED';
}

export function CoinbaseTools({ symbol, userId }: CoinbaseToolsProps) {
  const [currentPrice, setCurrentPrice] = useState<RealTimePrice | null>(null);
  const [earnPrograms, setEarnPrograms] = useState<CoinbaseEarnProgram[]>([]);
  const [advancedOrders, setAdvancedOrders] = useState<CoinbaseAdvancedOrder[]>([]);
  const [recurringBuys, setRecurringBuys] = useState<CoinbaseRecurringBuy[]>([]);
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');

  useEffect(() => {
    loadCoinbaseData();
    const interval = setInterval(loadCoinbaseData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const loadCoinbaseData = async () => {
    try {
      // Load current price
      const price = await exchangeAPI.getRealTimePrice('COINBASE', symbol);
      setCurrentPrice(price);

      // Load Coinbase Earn programs
      setEarnPrograms([
        {
          asset: 'USDC',
          apy: 4.0,
          minAmount: 1,
          description: 'Earn rewards on your USDC holdings',
          duration: 'Flexible',
          status: 'AVAILABLE'
        },
        {
          asset: 'ETH',
          apy: 3.2,
          minAmount: 0.01,
          description: 'Ethereum 2.0 staking rewards',
          duration: 'Until ETH 2.0 merge',
          status: 'AVAILABLE'
        },
        {
          asset: 'ALGO',
          apy: 5.75,
          minAmount: 1,
          description: 'Algorand staking rewards',
          duration: 'Flexible',
          status: 'WAITLIST'
        }
      ]);

      // Load advanced orders
      setAdvancedOrders([
        {
          id: '1',
          type: 'STOP_LOSS',
          symbol: 'BTCUSD',
          side: 'SELL',
          triggerPrice: 42000,
          status: 'ACTIVE'
        }
      ]);

      // Load recurring buys
      setRecurringBuys([
        {
          asset: 'BTC',
          amount: 100,
          frequency: 'WEEKLY',
          nextExecution: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          totalInvested: 2400,
          averagePrice: 44500,
          status: 'ACTIVE'
        }
      ]);

    } catch (error) {
      console.error('Error loading Coinbase data:', error);
    }
  };

  const joinEarnProgram = async (program: CoinbaseEarnProgram) => {
    try {
      if (program.status === 'AVAILABLE') {
        toast.success(`${program.asset} Earn programına katıldınız!`);
      } else if (program.status === 'WAITLIST') {
        toast.info(`${program.asset} Earn programı bekleme listesine eklendiniz`);
      } else {
        toast.error('Program şu anda dolu');
      }
    } catch (error) {
      toast.error('Earn programına katılım hatası');
    }
  };

  const createStopLoss = async () => {
    if (!stopLossPrice || !currentPrice) {
      toast.error('Lütfen stop loss fiyatını girin');
      return;
    }

    try {
      const newOrder: CoinbaseAdvancedOrder = {
        id: Date.now().toString(),
        type: 'STOP_LOSS',
        symbol: symbol,
        side: 'SELL',
        triggerPrice: parseFloat(stopLossPrice),
        status: 'ACTIVE'
      };

      setAdvancedOrders(prev => [...prev, newOrder]);
      setStopLossPrice('');
      toast.success('Stop Loss emri oluşturuldu!');
    } catch (error) {
      toast.error('Stop Loss oluşturma hatası');
    }
  };

  const createTakeProfit = async () => {
    if (!takeProfitPrice || !currentPrice) {
      toast.error('Lütfen take profit fiyatını girin');
      return;
    }

    try {
      const newOrder: CoinbaseAdvancedOrder = {
        id: Date.now().toString(),
        type: 'TAKE_PROFIT',
        symbol: symbol,
        side: 'SELL',
        triggerPrice: parseFloat(takeProfitPrice),
        status: 'ACTIVE'
      };

      setAdvancedOrders(prev => [...prev, newOrder]);
      setTakeProfitPrice('');
      toast.success('Take Profit emri oluşturuldu!');
    } catch (error) {
      toast.error('Take Profit oluşturma hatası');
    }
  };

  const setupRecurringBuy = async () => {
    if (!recurringAmount) {
      toast.error('Lütfen miktar girin');
      return;
    }

    try {
      const newRecurringBuy: CoinbaseRecurringBuy = {
        asset: symbol.replace('USD', ''),
        amount: parseFloat(recurringAmount),
        frequency: recurringFrequency,
        nextExecution: new Date(Date.now() + (recurringFrequency === 'DAILY' ? 1 : recurringFrequency === 'WEEKLY' ? 7 : 30) * 24 * 60 * 60 * 1000),
        totalInvested: 0,
        averagePrice: currentPrice?.price || 0,
        status: 'ACTIVE'
      };

      setRecurringBuys(prev => [...prev, newRecurringBuy]);
      setRecurringAmount('');
      toast.success('Otomatik alım kuruldu!');
    } catch (error) {
      toast.error('Otomatik alım kurma hatası');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
      case 'ACTIVE':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'WAITLIST':
      case 'PAUSED':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'FULL':
      case 'CANCELLED':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Coinbase Header */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-600/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20">
              <span className="text-blue-400 font-bold text-sm">C</span>
            </div>
            Coinbase Pro Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
              <p className="text-xs text-blue-400/60 uppercase">Coinbase Earn</p>
              <p className="text-lg font-bold text-blue-400">{earnPrograms.length} Program</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-400/60 uppercase">Advanced Orders</p>
              <p className="text-lg font-bold text-purple-400">{advancedOrders.length} Aktif</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-400/60 uppercase">Recurring Buys</p>
              <p className="text-lg font-bold text-green-400">{recurringBuys.length} Aktif</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-xs text-orange-400/60 uppercase">Coinbase Card</p>
              <p className="text-lg font-bold text-orange-400">Bağlı</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earn" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-blue-600/20">
          <TabsTrigger value="earn" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
            <Coins className="h-4 w-4 mr-2" />
            Coinbase Earn
          </TabsTrigger>
          <TabsTrigger value="advanced-orders" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
            <Target className="h-4 w-4 mr-2" />
            Advanced Orders
          </TabsTrigger>
          <TabsTrigger value="recurring" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
            <Repeat className="h-4 w-4 mr-2" />
            Recurring Buys
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">
            <Wallet className="h-4 w-4 mr-2" />
            Coinbase Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earn" className="space-y-6">
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Coinbase Earn Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earnPrograms.map((program, index) => (
                  <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                          <Coins className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-400">{program.asset}</h3>
                          <p className="text-green-400/60 text-sm">{program.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="text-green-400 bg-green-500/20 border-green-500/30 text-lg px-3 py-1">
                          {program.apy}% APY
                        </Badge>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-green-400/80 text-sm mb-3">{program.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-400/60 text-sm">
                        Minimum: {program.minAmount} {program.asset}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => joinEarnProgram(program)}
                      disabled={program.status === 'FULL'}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      {program.status === 'AVAILABLE' ? 'Katıl' : 
                       program.status === 'WAITLIST' ? 'Bekleme Listesine Ekle' : 'Dolu'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced-orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Advanced Orders */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Gelişmiş Emirler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-purple-400/80 mb-2 block">Stop Loss Fiyatı</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Stop loss fiyatı"
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(e.target.value)}
                      className="bg-black/40 border-purple-500/20 text-purple-400"
                    />
                    <Button 
                      onClick={createStopLoss}
                      disabled={!stopLossPrice}
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-purple-400/80 mb-2 block">Take Profit Fiyatı</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Take profit fiyatı"
                      value={takeProfitPrice}
                      onChange={(e) => setTakeProfitPrice(e.target.value)}
                      className="bg-black/40 border-purple-500/20 text-purple-400"
                    />
                    <Button 
                      onClick={createTakeProfit}
                      disabled={!takeProfitPrice}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {currentPrice && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-xs text-purple-400/60 uppercase mb-1">Mevcut Fiyat</p>
                      <p className="text-2xl font-bold text-purple-400">${currentPrice.price.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Advanced Orders */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Aktif Emirler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advancedOrders.map((order) => (
                    <div key={order.id} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            order.type === 'STOP_LOSS' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'
                          }`}>
                            {order.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-purple-400 font-semibold">{order.symbol}</span>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-purple-400/60">Trigger Price</p>
                          <p className="text-purple-400">${order.triggerPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-purple-400/60">Side</p>
                          <p className="text-purple-400">{order.side}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Setup Recurring Buy */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Otomatik Alım Kur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-orange-400/80 mb-2 block">Miktar (USD)</label>
                  <Input
                    type="number"
                    placeholder="Alım miktarı"
                    value={recurringAmount}
                    onChange={(e) => setRecurringAmount(e.target.value)}
                    className="bg-black/40 border-orange-500/20 text-orange-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-orange-400/80 mb-2 block">Sıklık</label>
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value as 'DAILY' | 'WEEKLY' | 'MONTHLY')}
                    className="w-full p-2 bg-black/40 border border-orange-500/20 rounded text-orange-400"
                  >
                    <option value="DAILY">Günlük</option>
                    <option value="WEEKLY">Haftalık</option>
                    <option value="MONTHLY">Aylık</option>
                  </select>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <p className="text-orange-400/80 text-sm">
                    Dollar-cost averaging stratejisi ile düzenli alım yaparak piyasa volatilitesinden korunun.
                  </p>
                </div>

                <Button 
                  onClick={setupRecurringBuy}
                  disabled={!recurringAmount}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white"
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  Otomatik Alım Kur
                </Button>
              </CardContent>
            </Card>

            {/* Active Recurring Buys */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Aktif Otomatik Alımlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recurringBuys.map((buy, index) => (
                    <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400 font-semibold">{buy.asset}</span>
                          <Badge className={getStatusColor(buy.status)}>
                            {buy.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-semibold">${buy.amount}</p>
                          <p className="text-orange-400/60 text-xs">{buy.frequency}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-orange-400/60">Toplam Yatırım</p>
                          <p className="text-orange-400">${buy.totalInvested.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-orange-400/60">Ortalama Fiyat</p>
                          <p className="text-orange-400">${buy.averagePrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-orange-400/60">
                        Sonraki alım: {buy.nextExecution.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-blue-600/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Coinbase Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                  <p className="text-blue-400 mb-2">Coinbase Wallet'ı bağlayın:</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold">
                    <Wallet className="h-4 w-4 mr-2" />
                    Coinbase Wallet Bağla
                  </Button>
                </div>
                
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                  <p className="text-blue-400/80 text-sm">
                    • Self-custody wallet
                    • DeFi protokollerine erişim
                    • NFT desteği
                    • Multi-chain support
                    • WalletConnect entegrasyonu
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Coinbase Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-orange-400 mb-2">Coinbase Card ile harcama yapın:</p>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-semibold">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Coinbase Card Başvuru
                  </Button>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-orange-400/80 text-sm">
                    • %4'e kadar crypto cashback
                    • Dünya çapında kabul
                    • Gerçek zamanlı harcama bildirimleri
                    • Crypto ile doğrudan ödeme
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}