import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Zap
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';
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
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [userNXTBalance, setUserNXTBalance] = useState(1250.75);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');

  const currentExchange = exchange ? EXCHANGES[exchange.toUpperCase() as Exchange] : null;

  useEffect(() => {
    if (currentExchange && currentExchange.defaults.length > 0) {
      setSelectedSymbol(currentExchange.defaults[0]);
      loadMarketData(currentExchange.defaults[0]);
    }
  }, [currentExchange]);

  const loadMarketData = (symbol: string) => {
    // Simulated market data
    const mockData: MarketData = {
      symbol: symbol,
      price: Math.random() * 50000 + 1000,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
      high24h: Math.random() * 55000 + 1000,
      low24h: Math.random() * 45000 + 1000
    };
    setMarketData(mockData);
    setOrderPrice(mockData.price.toFixed(2));
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

  const handlePlaceOrder = () => {
    const order = calculateOrder();
    if (!order) {
      toast.error('Lütfen geçerli değerler girin');
      return;
    }

    if (userNXTBalance < order.nxtRequired) {
      toast.error('Yetersiz NXT bakiyesi! Komisyon için daha fazla token gerekli.');
      return;
    }

    // Simulate order placement
    setUserNXTBalance(prev => prev - order.nxtRequired);
    toast.success(`${order.side.toUpperCase()} emri başarıyla yerleştirildi! ${order.nxtRequired.toFixed(2)} NXT komisyon ödendi.`);
    
    // Reset form
    setOrderAmount('');
    setOrderPrice(marketData?.price.toFixed(2) || '');
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

          {/* Trading Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Form */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Side */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={orderSide === 'buy' ? 'default' : 'outline'}
                    onClick={() => setOrderSide('buy')}
                    className={`${
                      orderSide === 'buy' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/40' 
                        : 'bg-black/40 border-green-500/20 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    BUY
                  </Button>
                  <Button
                    variant={orderSide === 'sell' ? 'default' : 'outline'}
                    onClick={() => setOrderSide('sell')}
                    className={`${
                      orderSide === 'sell' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                        : 'bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10'
                    }`}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    SELL
                  </Button>
                </div>

                {/* Order Type */}
                <div>
                  <label className="text-sm text-cyan-400/80 mb-2 block">Order Type</label>
                  <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                    <SelectTrigger className="bg-black/40 border-cyan-500/20 text-cyan-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-cyan-500/20">
                      <SelectItem value="limit" className="text-cyan-400 focus:bg-cyan-500/10">Limit Order</SelectItem>
                      <SelectItem value="market" className="text-cyan-400 focus:bg-cyan-500/10">Market Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm text-cyan-400/80 mb-2 block">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    className="bg-black/40 border-cyan-500/20 text-cyan-400"
                    step="0.001"
                  />
                </div>

                {/* Price */}
                {orderType === 'limit' && (
                  <div>
                    <label className="text-sm text-cyan-400/80 mb-2 block">Price</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                      className="bg-black/40 border-cyan-500/20 text-cyan-400"
                      step="0.01"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {order && (
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-400/80">Total:</span>
                      <span className="text-cyan-400 font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-400/80">Commission:</span>
                      <span className="text-cyan-400">${order.commission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-cyan-500/20 pt-2">
                      <span className="text-yellow-400/80">NXT Required:</span>
                      <span className="text-yellow-400 font-semibold">{order.nxtRequired.toFixed(2)} NXT</span>
                    </div>
                  </div>
                )}

                {/* NXT Balance Warning */}
                {order && userNXTBalance < order.nxtRequired && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-red-400">
                        <p className="font-semibold mb-1">Yetersiz NXT Bakiyesi!</p>
                        <p>Bu işlem için {order.nxtRequired.toFixed(2)} NXT gerekli, ancak bakiyeniz {userNXTBalance.toFixed(2)} NXT.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={!order || userNXTBalance < (order?.nxtRequired || 0)}
                  className={`w-full font-semibold ${
                    orderSide === 'buy' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white'
                  }`}
                >
                  {order && userNXTBalance >= order.nxtRequired ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place {orderSide.toUpperCase()} Order
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Need More NXT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Market Stats */}
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">24h High</p>
                        <p className="text-lg font-semibold text-green-400">${marketData.high24h.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">24h Low</p>
                        <p className="text-lg font-semibold text-red-400">${marketData.low24h.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                      <p className="text-xs text-cyan-400/60 uppercase mb-2">Exchange Info</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-cyan-400/80">Volume:</span>
                          <span className="text-cyan-400">{currentExchange.volume24h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cyan-400/80">Pairs:</span>
                          <span className="text-cyan-400">{currentExchange.pairs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cyan-400/80">Fees:</span>
                          <span className="text-cyan-400">{currentExchange.fees}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* NXT Token Info */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  NXT Token System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <p className="text-2xl font-bold text-yellow-400">{userNXTBalance.toFixed(2)} NXT</p>
                    <p className="text-xs text-yellow-400/60">Mevcut Bakiye</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Token Değeri:</span>
                      <span className="text-yellow-400">$0.10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">USD Değeri:</span>
                      <span className="text-yellow-400">${(userNXTBalance * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <p className="text-xs text-cyan-400/60 uppercase mb-2">Komisyon Sistemi</p>
                  <div className="space-y-1 text-xs text-cyan-400/80">
                    <p>• Tüm işlemler NXT token ile komisyon öder</p>
                    <p>• Standart komisyon oranı: %0.1</p>
                    <p>• NXT ile %50 komisyon indirimi</p>
                    <p>• Otomatik bakiye düşümü</p>
                  </div>
                </div>

                <Button 
                  onClick={() => window.location.href = '/wallet'}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Buy More NXT
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}