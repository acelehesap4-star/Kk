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
  Layers,
  PieChart
} from 'lucide-react';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { toast } from 'sonner';

interface OKXToolsProps {
  symbol: string;
  userId: string;
}

interface OKXOptionsPosition {
  symbol: string;
  type: 'CALL' | 'PUT';
  strike: number;
  expiry: Date;
  premium: number;
  quantity: number;
  pnl: number;
  iv: number; // Implied Volatility
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

interface OKXCopyTradingSignal {
  trader: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  roi: number;
  winRate: number;
  followers: number;
  signal: string;
}

interface OKXDeFiProduct {
  name: string;
  protocol: string;
  apy: number;
  tvl: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'LENDING' | 'YIELD_FARMING' | 'LIQUIDITY_MINING';
}

export function OKXTools({ symbol, userId }: OKXToolsProps) {
  const [currentPrice, setCurrentPrice] = useState<RealTimePrice | null>(null);
  const [optionsPositions, setOptionsPositions] = useState<OKXOptionsPosition[]>([]);
  const [copyTradingSignals, setCopyTradingSignals] = useState<OKXCopyTradingSignal[]>([]);
  const [defiProducts, setDefiProducts] = useState<OKXDeFiProduct[]>([]);
  const [selectedStrike, setSelectedStrike] = useState('');
  const [optionsPremium, setOptionsPremium] = useState('');
  const [optionsQuantity, setOptionsQuantity] = useState('');

  useEffect(() => {
    loadOKXData();
    const interval = setInterval(loadOKXData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const loadOKXData = async () => {
    try {
      // Load current price
      const price = await exchangeAPI.getRealTimePrice('OKX', symbol);
      setCurrentPrice(price);

      // Load mock options positions
      setOptionsPositions([
        {
          symbol: 'BTC-USD',
          type: 'CALL',
          strike: 50000,
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          premium: 2500,
          quantity: 0.1,
          pnl: 150,
          iv: 65.5,
          delta: 0.65,
          gamma: 0.0012,
          theta: -12.5,
          vega: 45.2
        }
      ]);

      // Load copy trading signals
      setCopyTradingSignals([
        {
          trader: 'CryptoMaster_Pro',
          symbol: 'BTCUSDT',
          side: 'BUY',
          price: 45200,
          roi: 156.7,
          winRate: 78.5,
          followers: 12450,
          signal: 'Strong bullish momentum, expecting breakout above 46K'
        },
        {
          trader: 'DeFi_Wizard',
          symbol: 'ETHUSDT',
          side: 'SELL',
          price: 2580,
          roi: 89.3,
          winRate: 72.1,
          followers: 8920,
          signal: 'Resistance at 2600, short-term correction expected'
        }
      ]);

      // Load DeFi products
      setDefiProducts([
        {
          name: 'OKX Earn - BTC',
          protocol: 'OKX',
          apy: 5.2,
          tvl: '$125M',
          risk: 'LOW',
          category: 'LENDING'
        },
        {
          name: 'Uniswap V3 ETH/USDC',
          protocol: 'Uniswap',
          apy: 12.8,
          tvl: '$890M',
          risk: 'MEDIUM',
          category: 'LIQUIDITY_MINING'
        },
        {
          name: 'Compound USDT',
          protocol: 'Compound',
          apy: 8.5,
          tvl: '$2.1B',
          risk: 'LOW',
          category: 'YIELD_FARMING'
        }
      ]);

    } catch (error) {
      console.error('Error loading OKX data:', error);
    }
  };

  const buyOption = async (type: 'CALL' | 'PUT') => {
    if (!selectedStrike || !optionsPremium || !optionsQuantity || !currentPrice) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const newOption: OKXOptionsPosition = {
        symbol: symbol,
        type: type,
        strike: parseFloat(selectedStrike),
        expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        premium: parseFloat(optionsPremium),
        quantity: parseFloat(optionsQuantity),
        pnl: 0,
        iv: Math.random() * 100 + 20,
        delta: type === 'CALL' ? Math.random() * 0.5 + 0.3 : -(Math.random() * 0.5 + 0.3),
        gamma: Math.random() * 0.002,
        theta: -(Math.random() * 20 + 5),
        vega: Math.random() * 50 + 20
      };

      setOptionsPositions(prev => [...prev, newOption]);
      setSelectedStrike('');
      setOptionsPremium('');
      setOptionsQuantity('');
      toast.success(`${type} opsiyonu satın alındı!`);
    } catch (error) {
      toast.error('Opsiyon satın alma hatası');
    }
  };

  const followTrader = async (signal: OKXCopyTradingSignal) => {
    try {
      toast.success(`${signal.trader} takip edilmeye başlandı!`);
    } catch (error) {
      toast.error('Trader takip etme hatası');
    }
  };

  const investInDeFi = async (product: OKXDeFiProduct) => {
    try {
      toast.success(`${product.name} ürününe yatırım yapıldı!`);
    } catch (error) {
      toast.error('DeFi yatırım hatası');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* OKX Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-blue-400 font-bold text-sm">O</span>
            </div>
            OKX Gelişmiş Trading Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-400/60 uppercase">Options</p>
              <p className="text-lg font-bold text-blue-400">{optionsPositions.length} Pozisyon</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-xs text-cyan-400/60 uppercase">Copy Trading</p>
              <p className="text-lg font-bold text-cyan-400">{copyTradingSignals.length} Sinyal</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-400/60 uppercase">DeFi</p>
              <p className="text-lg font-bold text-purple-400">{defiProducts.length} Ürün</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-400/60 uppercase">OKX Wallet</p>
              <p className="text-lg font-bold text-green-400">Bağlı</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="options" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-blue-500/20">
          <TabsTrigger value="options" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Target className="h-4 w-4 mr-2" />
            Options
          </TabsTrigger>
          <TabsTrigger value="copy-trading" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Activity className="h-4 w-4 mr-2" />
            Copy Trading
          </TabsTrigger>
          <TabsTrigger value="defi" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Layers className="h-4 w-4 mr-2" />
            DeFi
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Wallet className="h-4 w-4 mr-2" />
            OKX Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Options Trading */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Options Trading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-purple-400/80 mb-2 block">Strike Price</label>
                  <Input
                    type="number"
                    placeholder="Strike fiyatı"
                    value={selectedStrike}
                    onChange={(e) => setSelectedStrike(e.target.value)}
                    className="bg-black/40 border-purple-500/20 text-purple-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-400/80 mb-2 block">Premium</label>
                  <Input
                    type="number"
                    placeholder="Prim miktarı"
                    value={optionsPremium}
                    onChange={(e) => setOptionsPremium(e.target.value)}
                    className="bg-black/40 border-purple-500/20 text-purple-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-purple-400/80 mb-2 block">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Kontrat sayısı"
                    value={optionsQuantity}
                    onChange={(e) => setOptionsQuantity(e.target.value)}
                    className="bg-black/40 border-purple-500/20 text-purple-400"
                    step="0.1"
                  />
                </div>

                {currentPrice && selectedStrike && (
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-400/80">Mevcut Fiyat:</span>
                        <span className="text-purple-400">${currentPrice.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400/80">Strike:</span>
                        <span className="text-purple-400">${parseFloat(selectedStrike).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400/80">Moneyness:</span>
                        <span className={`${
                          currentPrice.price > parseFloat(selectedStrike) ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {currentPrice.price > parseFloat(selectedStrike) ? 'ITM' : 'OTM'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => buyOption('CALL')}
                    disabled={!selectedStrike || !optionsPremium || !optionsQuantity}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    CALL Al
                  </Button>
                  <Button 
                    onClick={() => buyOption('PUT')}
                    disabled={!selectedStrike || !optionsPremium || !optionsQuantity}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white"
                  >
                    <TrendingUp className="h-4 w-4 mr-2 rotate-180" />
                    PUT Al
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Options Positions */}
            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Options Pozisyonları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optionsPositions.map((position, index) => (
                    <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            position.type === 'CALL' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}>
                            {position.type}
                          </Badge>
                          <span className="text-purple-400 font-semibold">{position.symbol}</span>
                          <span className="text-purple-400/80 text-sm">${position.strike}</span>
                        </div>
                        <div className={`text-right ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <p className="font-semibold">{position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                        <div>
                          <p className="text-purple-400/60">Delta</p>
                          <p className="text-purple-400">{position.delta.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-purple-400/60">Gamma</p>
                          <p className="text-purple-400">{position.gamma.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-purple-400/60">Theta</p>
                          <p className="text-purple-400">{position.theta.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-purple-400/60">Vega</p>
                          <p className="text-purple-400">{position.vega.toFixed(1)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-400/60">IV: {position.iv.toFixed(1)}%</span>
                        <span className="text-purple-400/60">Expiry: {position.expiry.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="copy-trading" className="space-y-6">
          <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Copy Trading Sinyalleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {copyTradingSignals.map((signal, index) => (
                  <div key={index} className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                          <Activity className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-cyan-400">{signal.trader}</h3>
                          <p className="text-cyan-400/60 text-sm">{signal.followers.toLocaleString()} takipçi</p>
                        </div>
                      </div>
                      <Badge className={`${
                        signal.side === 'BUY' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                      }`}>
                        {signal.side}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">Symbol</p>
                        <p className="text-cyan-400 font-semibold">{signal.symbol}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">Fiyat</p>
                        <p className="text-cyan-400 font-semibold">${signal.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">ROI</p>
                        <p className="text-green-400 font-semibold">+{signal.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400/60 uppercase">Win Rate</p>
                        <p className="text-cyan-400 font-semibold">{signal.winRate}%</p>
                      </div>
                    </div>
                    
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-3">
                      <p className="text-cyan-400/80 text-sm">{signal.signal}</p>
                    </div>
                    
                    <Button 
                      onClick={() => followTrader(signal)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Trader'ı Takip Et
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-6">
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                DeFi Ürünleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defiProducts.map((product, index) => (
                  <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-green-400">{product.name}</h3>
                        <p className="text-green-400/60 text-sm">{product.protocol}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(product.risk)}>
                          {product.risk}
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-500/30">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-green-400/60 uppercase">APY</p>
                        <p className="text-green-400 font-semibold text-lg">{product.apy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-400/60 uppercase">TVL</p>
                        <p className="text-green-400 font-semibold">{product.tvl}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-400/60 uppercase">Risk</p>
                        <p className={`font-semibold ${
                          product.risk === 'LOW' ? 'text-green-400' :
                          product.risk === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {product.risk}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => investInDeFi(product)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Yatırım Yap
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                OKX Wallet Entegrasyonu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 mb-2">OKX Wallet'ı bağlayın:</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold">
                  <Wallet className="h-4 w-4 mr-2" />
                  OKX Wallet Bağla
                </Button>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400/80 text-sm">
                  • Multi-chain desteği (ETH, BSC, Polygon, Solana)
                  • DeFi protokollerine doğrudan erişim
                  • NFT koleksiyonu yönetimi
                  • Cross-chain bridge işlemleri
                  • Gelişmiş güvenlik özellikleri
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}