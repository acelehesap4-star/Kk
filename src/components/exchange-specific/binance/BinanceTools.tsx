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
  Percent,
  Clock,
  Wallet,
  Settings,
  Activity
} from 'lucide-react';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { supabaseAPI } from '@/lib/api/supabaseAPI';
import { toast } from 'sonner';

interface BinanceToolsProps {
  symbol: string;
  userId: string;
}

interface BinanceFuturesPosition {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
  margin: number;
}

interface BinanceStakingReward {
  asset: string;
  amount: number;
  apy: number;
  duration: number;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
}

interface BinanceLaunchpadProject {
  name: string;
  token: string;
  price: number;
  totalSupply: number;
  allocation: number;
  startTime: Date;
  endTime: Date;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
}

export function BinanceTools({ symbol, userId }: BinanceToolsProps) {
  const [currentPrice, setCurrentPrice] = useState<RealTimePrice | null>(null);
  const [futuresPositions, setFuturesPositions] = useState<BinanceFuturesPosition[]>([]);
  const [stakingRewards, setStakingRewards] = useState<BinanceStakingReward[]>([]);
  const [launchpadProjects, setLaunchpadProjects] = useState<BinanceLaunchpadProject[]>([]);
  const [leverage, setLeverage] = useState(10);
  const [marginAmount, setMarginAmount] = useState('');
  const [stakingAmount, setStakingAmount] = useState('');
  const [selectedStakingAsset, setSelectedStakingAsset] = useState('BNB');

  useEffect(() => {
    loadBinanceData();
    const interval = setInterval(loadBinanceData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const loadBinanceData = async () => {
    try {
      // Load current price
      const price = await exchangeAPI.getRealTimePrice('BINANCE', symbol);
      setCurrentPrice(price);

      // Load mock futures positions
      setFuturesPositions([
        {
          symbol: 'BTCUSDT',
          side: 'LONG',
          size: 0.5,
          entryPrice: 43500,
          markPrice: 45200,
          pnl: 850,
          pnlPercent: 3.9,
          leverage: 10,
          margin: 2175
        },
        {
          symbol: 'ETHUSDT',
          side: 'SHORT',
          size: 2.0,
          entryPrice: 2650,
          markPrice: 2580,
          pnl: 140,
          pnlPercent: 2.6,
          leverage: 5,
          margin: 1060
        }
      ]);

      // Load mock staking rewards
      setStakingRewards([
        {
          asset: 'BNB',
          amount: 10.5,
          apy: 8.2,
          duration: 30,
          status: 'ACTIVE'
        },
        {
          asset: 'BUSD',
          amount: 1000,
          apy: 5.5,
          duration: 7,
          status: 'ACTIVE'
        }
      ]);

      // Load mock launchpad projects
      setLaunchpadProjects([
        {
          name: 'DeFi Protocol X',
          token: 'DPX',
          price: 0.05,
          totalSupply: 1000000000,
          allocation: 50000,
          startTime: new Date(Date.now() + 86400000),
          endTime: new Date(Date.now() + 259200000),
          status: 'UPCOMING'
        }
      ]);

    } catch (error) {
      console.error('Error loading Binance data:', error);
    }
  };

  const openFuturesPosition = async () => {
    if (!marginAmount || !currentPrice) {
      toast.error('Lütfen margin miktarını girin');
      return;
    }

    const margin = parseFloat(marginAmount);
    const positionSize = (margin * leverage) / currentPrice.price;

    try {
      // Simulate opening futures position
      const newPosition: BinanceFuturesPosition = {
        symbol: symbol,
        side: 'LONG',
        size: positionSize,
        entryPrice: currentPrice.price,
        markPrice: currentPrice.price,
        pnl: 0,
        pnlPercent: 0,
        leverage: leverage,
        margin: margin
      };

      setFuturesPositions(prev => [...prev, newPosition]);
      setMarginAmount('');
      toast.success(`${leverage}x kaldıraçlı LONG pozisyon açıldı!`);
    } catch (error) {
      toast.error('Pozisyon açma hatası');
    }
  };

  const startStaking = async () => {
    if (!stakingAmount) {
      toast.error('Lütfen staking miktarını girin');
      return;
    }

    try {
      const newStaking: BinanceStakingReward = {
        asset: selectedStakingAsset,
        amount: parseFloat(stakingAmount),
        apy: selectedStakingAsset === 'BNB' ? 8.2 : 5.5,
        duration: 30,
        status: 'PENDING'
      };

      setStakingRewards(prev => [...prev, newStaking]);
      setStakingAmount('');
      toast.success(`${selectedStakingAsset} staking başlatıldı!`);
    } catch (error) {
      toast.error('Staking başlatma hatası');
    }
  };

  const participateInLaunchpad = async (project: BinanceLaunchpadProject) => {
    try {
      toast.success(`${project.name} projesine katılım başvurusu gönderildi!`);
    } catch (error) {
      toast.error('Launchpad katılım hatası');
    }
  };

  return (
    <div className="space-y-6">
      {/* Binance Header */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20">
              <span className="text-yellow-400 font-bold text-sm">B</span>
            </div>
            Binance Özel Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-xs text-yellow-400/60 uppercase">Spot Trading</p>
              <p className="text-lg font-bold text-yellow-400">Aktif</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-xs text-orange-400/60 uppercase">Futures</p>
              <p className="text-lg font-bold text-orange-400">{futuresPositions.length} Pozisyon</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-400/60 uppercase">Staking</p>
              <p className="text-lg font-bold text-green-400">{stakingRewards.length} Aktif</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-400/60 uppercase">Launchpad</p>
              <p className="text-lg font-bold text-purple-400">{launchpadProjects.length} Proje</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="futures" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-yellow-500/20">
          <TabsTrigger value="futures" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <TrendingUp className="h-4 w-4 mr-2" />
            Futures
          </TabsTrigger>
          <TabsTrigger value="staking" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Coins className="h-4 w-4 mr-2" />
            Staking
          </TabsTrigger>
          <TabsTrigger value="launchpad" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Zap className="h-4 w-4 mr-2" />
            Launchpad
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Wallet className="h-4 w-4 mr-2" />
            Binance Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="futures" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Futures Trading */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Futures Trading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-orange-400/80 mb-2 block">Kaldıraç</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="125"
                      value={leverage}
                      onChange={(e) => setLeverage(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                      {leverage}x
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-orange-400/80 mb-2 block">Margin (USDT)</label>
                  <Input
                    type="number"
                    placeholder="Margin miktarı"
                    value={marginAmount}
                    onChange={(e) => setMarginAmount(e.target.value)}
                    className="bg-black/40 border-orange-500/20 text-orange-400"
                  />
                </div>

                {currentPrice && marginAmount && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-orange-400/80">Pozisyon Boyutu:</span>
                        <span className="text-orange-400">
                          {((parseFloat(marginAmount) * leverage) / currentPrice.price).toFixed(6)} {symbol.replace('USDT', '')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-400/80">Tasfiye Fiyatı:</span>
                        <span className="text-red-400">
                          ${(currentPrice.price * (1 - 0.8 / leverage)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={openFuturesPosition}
                  disabled={!marginAmount || !currentPrice}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  LONG Pozisyon Aç
                </Button>
              </CardContent>
            </Card>

            {/* Active Positions */}
            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Aktif Pozisyonlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {futuresPositions.map((position, index) => (
                    <div key={index} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            position.side === 'LONG' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}>
                            {position.side}
                          </Badge>
                          <span className="text-orange-400 font-semibold">{position.symbol}</span>
                          <Badge variant="outline" className="text-orange-400/80 border-orange-500/30">
                            {position.leverage}x
                          </Badge>
                        </div>
                        <div className={`text-right ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <p className="font-semibold">{position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}</p>
                          <p className="text-xs">{position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-orange-400/60">Boyut</p>
                          <p className="text-orange-400">{position.size}</p>
                        </div>
                        <div>
                          <p className="text-orange-400/60">Giriş</p>
                          <p className="text-orange-400">${position.entryPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-orange-400/60">Mark</p>
                          <p className="text-orange-400">${position.markPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staking Interface */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Binance Staking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-green-400/80 mb-2 block">Asset</label>
                  <select
                    value={selectedStakingAsset}
                    onChange={(e) => setSelectedStakingAsset(e.target.value)}
                    className="w-full p-2 bg-black/40 border border-green-500/20 rounded text-green-400"
                  >
                    <option value="BNB">BNB (8.2% APY)</option>
                    <option value="BUSD">BUSD (5.5% APY)</option>
                    <option value="USDT">USDT (4.8% APY)</option>
                    <option value="ETH">ETH (6.1% APY)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-green-400/80 mb-2 block">Miktar</label>
                  <Input
                    type="number"
                    placeholder="Staking miktarı"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    className="bg-black/40 border-green-500/20 text-green-400"
                  />
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-400/80">APY:</span>
                      <span className="text-green-400">{selectedStakingAsset === 'BNB' ? '8.2%' : '5.5%'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400/80">Süre:</span>
                      <span className="text-green-400">30 gün</span>
                    </div>
                    {stakingAmount && (
                      <div className="flex justify-between">
                        <span className="text-green-400/80">Tahmini Ödül:</span>
                        <span className="text-green-400">
                          {(parseFloat(stakingAmount) * (selectedStakingAsset === 'BNB' ? 0.082 : 0.055) / 12).toFixed(4)} {selectedStakingAsset}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={startStaking}
                  disabled={!stakingAmount}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Staking Başlat
                </Button>
              </CardContent>
            </Card>

            {/* Active Staking */}
            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Aktif Staking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stakingRewards.map((staking, index) => (
                    <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-semibold">{staking.asset}</span>
                          <Badge className={`${
                            staking.status === 'ACTIVE' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                            staking.status === 'PENDING' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                            'text-blue-400 bg-blue-500/10 border-blue-500/20'
                          }`}>
                            {staking.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">{staking.apy}% APY</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-green-400/60">Miktar</p>
                          <p className="text-green-400">{staking.amount.toLocaleString()} {staking.asset}</p>
                        </div>
                        <div>
                          <p className="text-green-400/60">Süre</p>
                          <p className="text-green-400">{staking.duration} gün</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="launchpad" className="space-y-6">
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Binance Launchpad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {launchpadProjects.map((project, index) => (
                  <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-400">{project.name}</h3>
                        <p className="text-purple-400/60 text-sm">{project.token}</p>
                      </div>
                      <Badge className={`${
                        project.status === 'UPCOMING' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                        project.status === 'ACTIVE' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                        'text-gray-400 bg-gray-500/10 border-gray-500/20'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-purple-400/60 uppercase">Token Fiyatı</p>
                        <p className="text-purple-400 font-semibold">${project.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400/60 uppercase">Toplam Arz</p>
                        <p className="text-purple-400 font-semibold">{project.totalSupply.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400/60 uppercase">Tahsis</p>
                        <p className="text-purple-400 font-semibold">{project.allocation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400/60 uppercase">Başlangıç</p>
                        <p className="text-purple-400 font-semibold">{project.startTime.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => participateInLaunchpad(project)}
                      disabled={project.status !== 'UPCOMING'}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {project.status === 'UPCOMING' ? 'Katıl' : project.status === 'ACTIVE' ? 'Aktif' : 'Tamamlandı'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Binance Wallet Entegrasyonu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400 mb-2">Binance Wallet'ı bağlayın:</p>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold">
                  <Wallet className="h-4 w-4 mr-2" />
                  Binance Wallet Bağla
                </Button>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-400/80 text-sm">
                  • Binance Wallet ile doğrudan işlem yapın
                  • Düşük komisyon oranları
                  • Hızlı para transferi
                  • Güvenli saklama
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}