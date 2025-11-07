import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Crown,
  AlertTriangle,
  CheckCircle,
  Wallet,
  BarChart3,
  Zap,
  Brain,
  Target,
  Shield
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { supabaseAPI } from '@/lib/api/supabaseAPI';
import { ExchangeToolsFactory } from '@/components/exchange-specific/ExchangeToolsFactory';
import { ExchangeTradingFactory } from '@/components/exchange-specific/ExchangeTradingFactory';
import { toast } from 'sonner';

interface TradeOrder {
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  commission: number;
  nxtRequired: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
}

export default function TradingTerminal() {
  const { exchange } = useParams<{ exchange: string }>();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'crypto';
  
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [marketData, setMarketData] = useState<RealTimePrice | null>(null);
  const [userNXTBalance, setUserNXTBalance] = useState(1250.75);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [userId] = useState('demo-user-id'); // In production, get from auth

  const currentExchange = exchange ? EXCHANGES[exchange.toUpperCase() as Exchange] : null;

  useEffect(() => {
    if (currentExchange && currentExchange.defaults.length > 0) {
      setSelectedSymbol(currentExchange.defaults[0]);
      loadMarketData(currentExchange.defaults[0]);
    }
  }, [currentExchange]);

  useEffect(() => {
    // Setup WebSocket for real-time price updates
    if (currentExchange && selectedSymbol) {
      const ws = exchangeAPI.createWebSocketConnection(
        currentExchange.name as Exchange,
        selectedSymbol,
        (data: RealTimePrice) => {
          setMarketData(data);
          if (orderType === 'market') {
            setOrderPrice(data.price.toFixed(2));
          }
        }
      );
      
      if (ws) {
        setWebSocket(ws);
        return () => {
          ws.close();
        };
      }
    }
  }, [currentExchange, selectedSymbol]);

  const loadMarketData = async (symbol: string) => {
    if (!currentExchange) return;
    
    setIsLoadingPrice(true);
    try {
      const priceData = await exchangeAPI.getRealTimePrice(
        currentExchange.name as Exchange, 
        symbol
      );
      setMarketData(priceData);
      setOrderPrice(priceData.price.toFixed(2));
    } catch (error) {
      console.error('Error loading market data:', error);
      toast.error('Piyasa verisi yüklenemedi');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const calculateOrder = (): TradeOrder | null => {
    if (!orderAmount || !orderPrice || !marketData) return null;

    const amount = parseFloat(orderAmount);
    const price = parseFloat(orderPrice);
    const total = amount * price;
    const commissionRate = 0.001; // 0.1%
    const commission = total * commissionRate;
    const nxtRate = 0.1; // 1 NXT = $0.1
    const nxtRequired = commission / nxtRate;

    return {
      side: orderSide,
      amount,
      price,
      total,
      commission,
      nxtRequired
    };
  };

  const handlePlaceOrder = async () => {
    const order = calculateOrder();
    if (!order || !currentExchange) {
      toast.error('Lütfen geçerli değerler girin');
      return;
    }

    if (userNXTBalance < order.nxtRequired) {
      toast.error('Yetersiz NXT bakiyesi! Komisyon için daha fazla token gerekli.');
      return;
    }

    try {
      // Create order in database
      const orderId = await supabaseAPI.createTradingOrder({
        user_id: userId,
        exchange: currentExchange.name as Exchange,
        symbol: selectedSymbol,
        side: order.side,
        order_type: orderType,
        amount: order.amount,
        price: order.price,
        total: order.total,
        commission: order.commission,
        nxt_used: order.nxtRequired,
        status: 'pending'
      });

      if (orderId) {
        // Update local balance
        setUserNXTBalance(prev => prev - order.nxtRequired);
        toast.success(`${order.side.toUpperCase()} emri başarıyla yerleştirildi! ${order.nxtRequired.toFixed(2)} NXT komisyon ödendi.`);
        
        // Reset form
        setOrderAmount('');
        setOrderPrice(marketData?.price.toFixed(2) || '');

        // Simulate order execution after a delay
        setTimeout(async () => {
          const success = Math.random() > 0.1; // 90% success rate
          if (success) {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'filled', order.amount, order.price);
            toast.success(`${order.side.toUpperCase()} emri tamamlandı!`);
          } else {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'rejected');
            // Refund NXT
            setUserNXTBalance(prev => prev + order.nxtRequired);
            toast.error('Emir reddedildi - NXT iadesi yapıldı');
          }
        }, Math.random() * 5000 + 2000); // 2-7 seconds delay
      } else {
        toast.error('Emir oluşturulamadı');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Emir yerleştirme sırasında hata oluştu');
    }
  };

  const order = calculateOrder();

  if (!currentExchange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Geçersiz Exchange</h1>
          <p className="text-red-400/60">Belirtilen exchange bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 shadow-lg shadow-cyan-500/30">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">{currentExchange.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                    {currentExchange.type}
                  </Badge>
                  <span className="text-cyan-400/60 text-sm">•</span>
                  <span className="text-cyan-400/60 text-sm">{currentExchange.region}</span>
                </div>
              </div>
            </div>

            {/* NXT Balance */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-xs text-yellow-400/60 uppercase">NXT Balance</p>
                    <p className="text-xl font-bold text-yellow-400">{userNXTBalance.toFixed(2)} NXT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Symbol Selection */}
          <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm text-cyan-400/80 mb-2 block">Trading Pair</label>
                  <Select value={selectedSymbol} onValueChange={(value) => {
                    setSelectedSymbol(value);
                    loadMarketData(value);
                  }}>
                    <SelectTrigger className="w-[200px] bg-black/40 border-cyan-500/20 text-cyan-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-cyan-500/20">
                      {currentExchange.defaults.map((symbol) => (
                        <SelectItem key={symbol} value={symbol} className="text-cyan-400 focus:bg-cyan-500/10">
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {marketData && (
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-cyan-400/60 uppercase">Price</p>
                      <p className="text-xl font-bold text-cyan-400">${marketData.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60 uppercase">24h Change</p>
                      <p className={`text-lg font-semibold flex items-center gap-1 ${
                        marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {marketData.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {marketData.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60 uppercase">24h Volume</p>
                      <p className="text-lg font-semibold text-cyan-400">{marketData.volume24h}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="trading" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-cyan-500/20">
              <TabsTrigger value="trading" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Zap className="h-4 w-4 mr-2" />
                {currentExchange?.name} Trading
              </TabsTrigger>
              <TabsTrigger value="exchange-tools" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Target className="h-4 w-4 mr-2" />
                {currentExchange?.name} Araçları
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trading" className="space-y-6">
              <ExchangeTradingFactory 
                exchange={currentExchange?.name as Exchange}
                symbol={selectedSymbol}
                userId={userId}
              />
            </TabsContent>

            <TabsContent value="exchange-tools" className="space-y-6">
              <ExchangeToolsFactory 
                exchange={currentExchange?.name as Exchange}
                symbol={selectedSymbol}
                userId={userId}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}