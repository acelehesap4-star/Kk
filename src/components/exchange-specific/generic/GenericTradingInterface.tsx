import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BarChart3,
  Crown,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Activity
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { supabaseAPI } from '@/lib/api/supabaseAPI';
import { toast } from 'sonner';

interface GenericTradingInterfaceProps {
  exchange: Exchange;
  symbol: string;
  userId: string;
}

interface TradeOrder {
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  commission: number;
  nxtRequired: number;
}

export function GenericTradingInterface({ exchange, symbol, userId }: GenericTradingInterfaceProps) {
  const [currentPrice, setCurrentPrice] = useState<RealTimePrice | null>(null);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [userNXTBalance] = useState(1250.75);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPriceData();
    const interval = setInterval(loadPriceData, 5000);
    return () => clearInterval(interval);
  }, [exchange, symbol]);

  const loadPriceData = async () => {
    try {
      const priceData = await exchangeAPI.getRealTimePrice(exchange, symbol);
      setCurrentPrice(priceData);
      if (orderType === 'market') {
        setPrice(priceData.price.toFixed(2));
      }
    } catch (error) {
      console.error('Error loading price data:', error);
    }
  };

  const calculateOrder = (): TradeOrder | null => {
    if (!amount || !price || !currentPrice) return null;

    const orderAmount = parseFloat(amount);
    const orderPrice = parseFloat(price);
    const total = orderAmount * orderPrice;
    const commission = total * 0.001; // 0.1% commission
    const nxtRequired = commission / 0.1; // NXT token requirement

    return {
      side: orderSide,
      amount: orderAmount,
      price: orderPrice,
      total,
      commission,
      nxtRequired
    };
  };

  const placeOrder = async () => {
    const order = calculateOrder();
    if (!order) {
      toast.error('Lütfen geçerli değerler girin');
      return;
    }

    if (userNXTBalance < order.nxtRequired) {
      toast.error('Yetersiz NXT bakiyesi!');
      return;
    }

    setIsLoading(true);
    try {
      const orderId = await supabaseAPI.createTradingOrder({
        user_id: userId,
        exchange: exchange,
        symbol: symbol,
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
        toast.success(`${exchange} ${orderType} ${orderSide} emri yerleştirildi!`);
        
        // Reset form
        setAmount('');
        if (orderType !== 'market') setPrice('');

        // Simulate order execution
        setTimeout(async () => {
          const success = Math.random() > 0.1; // 90% success rate
          if (success) {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'filled', order.amount, order.price);
            toast.success(`${orderSide.toUpperCase()} emri tamamlandı!`);
          } else {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'rejected');
            toast.error('Emir reddedildi');
          }
        }, Math.random() * 4000 + 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Emir yerleştirme hatası');
    } finally {
      setIsLoading(false);
    }
  };

  const order = calculateOrder();

  return (
    <div className="space-y-6">
      {/* Exchange Header */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
              <span className="text-cyan-400 font-bold text-sm">{exchange.charAt(0)}</span>
            </div>
            {exchange} Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPrice && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                <p className="text-xs text-cyan-400/60 uppercase">Fiyat</p>
                <p className="text-xl font-bold text-cyan-400">${currentPrice.price.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs text-green-400/60 uppercase">24h Değişim</p>
                <p className={`text-lg font-bold ${currentPrice.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {currentPrice.change24h >= 0 ? '+' : ''}{currentPrice.change24h.toFixed(2)}%
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-400/60 uppercase">24h Hacim</p>
                <p className="text-lg font-bold text-blue-400">{currentPrice.volume24h}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Emir Ver
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
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'border-green-500/50 text-green-400 hover:bg-green-500/10'
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
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                }`}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                SELL
              </Button>
            </div>

            {/* Order Type */}
            <div>
              <label className="text-sm text-cyan-400/80 mb-2 block">Emir Tipi</label>
              <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
                <SelectTrigger className="bg-black/40 border-cyan-500/20 text-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-cyan-500/20">
                  <SelectItem value="limit" className="text-cyan-400">Limit Order</SelectItem>
                  <SelectItem value="market" className="text-cyan-400">Market Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-cyan-400/80 mb-2 block">Miktar</label>
              <Input
                type="number"
                placeholder="Miktar"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/40 border-cyan-500/20 text-cyan-400"
                step="0.00001"
              />
            </div>

            {/* Price */}
            {orderType === 'limit' && (
              <div>
                <label className="text-sm text-cyan-400/80 mb-2 block">Fiyat</label>
                <Input
                  type="number"
                  placeholder="Fiyat"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-black/40 border-cyan-500/20 text-cyan-400"
                  step="0.01"
                />
              </div>
            )}

            {/* Order Summary */}
            {order && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cyan-400/80">Toplam:</span>
                    <span className="text-cyan-400 font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/80">Komisyon:</span>
                    <span className="text-cyan-400">${order.commission.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/80">NXT Gereksinimi:</span>
                    <span className="text-yellow-400 font-semibold">{order.nxtRequired.toFixed(2)} NXT</span>
                  </div>
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
                    <p>Bu işlem için {order.nxtRequired.toFixed(2)} NXT gerekli.</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={placeOrder}
              disabled={!order || userNXTBalance < (order?.nxtRequired || 0) || isLoading}
              className={`w-full font-semibold ${
                orderSide === 'buy' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : order && userNXTBalance >= order.nxtRequired ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {orderSide.toUpperCase()} Emri Ver
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  NXT Gerekli
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Exchange Info */}
        <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {exchange} Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-2">{exchange} Özellikleri:</h4>
              <ul className="text-cyan-400/80 text-sm space-y-1">
                <li>• Güvenli ve hızlı işlemler</li>
                <li>• Düşük komisyon oranları</li>
                <li>• 24/7 müşteri desteği</li>
                <li>• Gelişmiş trading araçları</li>
                <li>• Mobil uygulama desteği</li>
              </ul>
            </div>

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

            <Button 
              onClick={() => window.location.href = '/wallet'}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
            >
              <Wallet className="h-4 w-4 mr-2" />
              NXT Satın Al
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}