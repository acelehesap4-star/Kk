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
  Target,
  Shield,
  Activity,
  DollarSign,
  Percent
} from 'lucide-react';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { supabaseAPI } from '@/lib/api/supabaseAPI';
import { toast } from 'sonner';

interface BinanceTradingInterfaceProps {
  symbol: string;
  userId: string;
}

interface BinanceOrderType {
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'OCO' | 'ICEBERG';
  label: string;
  description: string;
}

const BINANCE_ORDER_TYPES: BinanceOrderType[] = [
  { type: 'MARKET', label: 'Market', description: 'Anında işlem' },
  { type: 'LIMIT', label: 'Limit', description: 'Belirli fiyatta işlem' },
  { type: 'STOP_LOSS', label: 'Stop Loss', description: 'Zarar durdurma' },
  { type: 'TAKE_PROFIT', label: 'Take Profit', description: 'Kar alma' },
  { type: 'OCO', label: 'OCO', description: 'One-Cancels-Other' },
  { type: 'ICEBERG', label: 'Iceberg', description: 'Gizli büyük emir' }
];

export function BinanceTradingInterface({ symbol, userId }: BinanceTradingInterfaceProps) {
  const [currentPrice, setCurrentPrice] = useState<RealTimePrice | null>(null);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<BinanceOrderType['type']>('LIMIT');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [icebergQty, setIcebergQty] = useState('');
  const [timeInForce, setTimeInForce] = useState<'GTC' | 'IOC' | 'FOK'>('GTC');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPriceData();
    const interval = setInterval(loadPriceData, 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  const loadPriceData = async () => {
    try {
      const priceData = await exchangeAPI.getRealTimePrice('BINANCE', symbol);
      setCurrentPrice(priceData);
      if (orderType === 'MARKET') {
        setPrice(priceData.price.toFixed(2));
      }
    } catch (error) {
      console.error('Error loading price data:', error);
    }
  };

  const calculateTotal = () => {
    if (!amount || !price) return 0;
    return parseFloat(amount) * parseFloat(price);
  };

  const calculateCommission = () => {
    const total = calculateTotal();
    const binanceCommission = total * 0.001; // 0.1% Binance commission
    const nxtDiscount = binanceCommission * 0.25; // 25% discount with BNB
    return {
      standard: binanceCommission,
      withBNB: binanceCommission - nxtDiscount,
      nxtRequired: nxtDiscount / 0.1 // NXT token requirement
    };
  };

  const placeBinanceOrder = async () => {
    if (!amount || (!price && orderType !== 'MARKET')) {
      toast.error('Lütfen gerekli alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const commission = calculateCommission();
      
      // Create order in database with Binance-specific fields
      const orderId = await supabaseAPI.createTradingOrder({
        user_id: userId,
        exchange: 'BINANCE',
        symbol: symbol,
        side: orderSide.toLowerCase() as 'buy' | 'sell',
        order_type: orderType.toLowerCase() as 'market' | 'limit',
        amount: parseFloat(amount),
        price: parseFloat(price),
        total: calculateTotal(),
        commission: commission.withBNB,
        nxt_used: commission.nxtRequired,
        status: 'pending'
      });

      if (orderId) {
        toast.success(`Binance ${orderType} ${orderSide} emri yerleştirildi!`);
        
        // Reset form
        setAmount('');
        if (orderType !== 'MARKET') setPrice('');
        setStopPrice('');
        setIcebergQty('');

        // Simulate order execution
        setTimeout(async () => {
          const success = Math.random() > 0.05; // 95% success rate for Binance
          if (success) {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'filled', parseFloat(amount), parseFloat(price));
            toast.success(`${orderSide} emri tamamlandı!`);
          } else {
            await supabaseAPI.updateTradingOrderStatus(orderId, 'rejected');
            toast.error('Emir reddedildi - Binance API hatası');
          }
        }, Math.random() * 3000 + 1000);
      }
    } catch (error) {
      console.error('Error placing Binance order:', error);
      toast.error('Binance emir yerleştirme hatası');
    } finally {
      setIsLoading(false);
    }
  };

  const commission = calculateCommission();

  return (
    <div className="space-y-6">
      {/* Binance Trading Header */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20">
              <span className="text-yellow-400 font-bold text-sm">B</span>
            </div>
            Binance Spot Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPrice && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-400/60 uppercase">Fiyat</p>
                <p className="text-xl font-bold text-yellow-400">${currentPrice.price.toLocaleString()}</p>
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
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-xs text-purple-400/60 uppercase">Spread</p>
                <p className="text-lg font-bold text-purple-400">0.01%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Binance Emir Ver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Side */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderSide === 'BUY' ? 'default' : 'outline'}
                onClick={() => setOrderSide('BUY')}
                className={`${
                  orderSide === 'BUY' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                BUY
              </Button>
              <Button
                variant={orderSide === 'SELL' ? 'default' : 'outline'}
                onClick={() => setOrderSide('SELL')}
                className={`${
                  orderSide === 'SELL' 
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
              <label className="text-sm text-yellow-400/80 mb-2 block">Emir Tipi</label>
              <Select value={orderType} onValueChange={(value: BinanceOrderType['type']) => setOrderType(value)}>
                <SelectTrigger className="bg-black/40 border-yellow-500/20 text-yellow-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-yellow-500/20">
                  {BINANCE_ORDER_TYPES.map((type) => (
                    <SelectItem key={type.type} value={type.type} className="text-yellow-400 hover:bg-yellow-500/10">
                      <div>
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-xs text-yellow-400/60">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-yellow-400/80 mb-2 block">Miktar</label>
              <Input
                type="number"
                placeholder="Miktar"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/40 border-yellow-500/20 text-yellow-400"
                step="0.00001"
              />
            </div>

            {/* Price (not for market orders) */}
            {orderType !== 'MARKET' && (
              <div>
                <label className="text-sm text-yellow-400/80 mb-2 block">Fiyat</label>
                <Input
                  type="number"
                  placeholder="Fiyat"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-black/40 border-yellow-500/20 text-yellow-400"
                  step="0.01"
                />
              </div>
            )}

            {/* Stop Price (for stop orders) */}
            {(orderType === 'STOP_LOSS' || orderType === 'TAKE_PROFIT' || orderType === 'OCO') && (
              <div>
                <label className="text-sm text-yellow-400/80 mb-2 block">Stop Fiyatı</label>
                <Input
                  type="number"
                  placeholder="Stop fiyatı"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  className="bg-black/40 border-yellow-500/20 text-yellow-400"
                  step="0.01"
                />
              </div>
            )}

            {/* Iceberg Quantity */}
            {orderType === 'ICEBERG' && (
              <div>
                <label className="text-sm text-yellow-400/80 mb-2 block">Iceberg Miktarı</label>
                <Input
                  type="number"
                  placeholder="Görünür miktar"
                  value={icebergQty}
                  onChange={(e) => setIcebergQty(e.target.value)}
                  className="bg-black/40 border-yellow-500/20 text-yellow-400"
                  step="0.00001"
                />
              </div>
            )}

            {/* Time in Force */}
            <div>
              <label className="text-sm text-yellow-400/80 mb-2 block">Geçerlilik Süresi</label>
              <Select value={timeInForce} onValueChange={(value: 'GTC' | 'IOC' | 'FOK') => setTimeInForce(value)}>
                <SelectTrigger className="bg-black/40 border-yellow-500/20 text-yellow-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-yellow-500/20">
                  <SelectItem value="GTC" className="text-yellow-400">GTC (Good Till Cancelled)</SelectItem>
                  <SelectItem value="IOC" className="text-yellow-400">IOC (Immediate or Cancel)</SelectItem>
                  <SelectItem value="FOK" className="text-yellow-400">FOK (Fill or Kill)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Summary */}
            {amount && price && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-400/80">Toplam:</span>
                    <span className="text-yellow-400 font-semibold">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/80">Binance Komisyon:</span>
                    <span className="text-red-400">${commission.standard.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/80">BNB ile Komisyon:</span>
                    <span className="text-green-400">${commission.withBNB.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400/80">NXT Gereksinimi:</span>
                    <span className="text-cyan-400">{commission.nxtRequired.toFixed(2)} NXT</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={placeBinanceOrder}
              disabled={!amount || (!price && orderType !== 'MARKET') || isLoading}
              className={`w-full font-semibold ${
                orderSide === 'BUY' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                  : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  {orderSide === 'BUY' ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                  {orderSide} {orderType} Emri Ver
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Binance Features */}
        <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Binance Özellikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">Düşük Komisyon</span>
                </div>
                <p className="text-yellow-400/80 text-xs">BNB ile %25 indirim</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Hızlı İşlem</span>
                </div>
                <p className="text-green-400/80 text-xs">1.4 milyon TPS</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">Gelişmiş Emirler</span>
                </div>
                <p className="text-blue-400/80 text-xs">OCO, Iceberg, Stop</p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold text-sm">Güvenlik</span>
                </div>
                <p className="text-purple-400/80 text-xs">SAFU Fonu</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Binance Avantajları:</h4>
              <ul className="text-yellow-400/80 text-sm space-y-1">
                <li>• Dünyanın en büyük kripto borsası</li>
                <li>• 600+ trading çifti</li>
                <li>• 24/7 müşteri desteği</li>
                <li>• Mobil uygulama desteği</li>
                <li>• Futures, Options, Margin trading</li>
                <li>• Staking ve Earn programları</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}