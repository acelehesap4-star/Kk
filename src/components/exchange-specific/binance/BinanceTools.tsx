import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Zap, 
  Coins,
  Rocket,
  Wallet,
  Shield,
  Target,
  DollarSign,
  Percent,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface BinanceToolsProps {
  symbol: string;
  userId: string;
}

export function BinanceTools({ symbol, userId }: BinanceToolsProps) {
  const [stakingAmount, setStakingAmount] = useState('');
  const [futuresLeverage, setFuturesLeverage] = useState('10');
  const [launchpadAmount, setLaunchpadAmount] = useState('');

  const handleStaking = async () => {
    if (!stakingAmount) {
      toast.error('Lütfen staking miktarını girin');
      return;
    }
    toast.success(`${stakingAmount} BNB staking başlatıldı!`);
    setStakingAmount('');
  };

  const handleFuturesOrder = async () => {
    toast.success(`${futuresLeverage}x kaldıraçlı futures pozisyonu açıldı!`);
  };

  const handleLaunchpadParticipation = async () => {
    if (!launchpadAmount) {
      toast.error('Lütfen katılım miktarını girin');
      return;
    }
    toast.success(`${launchpadAmount} BNB ile Launchpad'e katıldınız!`);
    setLaunchpadAmount('');
  };

  return (
    <div className="space-y-6">
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
          <p className="text-yellow-400/80 text-sm">
            Binance'in sunduğu gelişmiş trading araçları ve özelliklerini kullanın
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="futures" className="space-y-4">
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
            <Rocket className="h-4 w-4 mr-2" />
            Launchpad
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Wallet className="h-4 w-4 mr-2" />
            BNB Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="futures" className="space-y-4">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Binance Futures Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Kaldıraç Seçimi</h4>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Kaldıraç (1-125x)"
                      value={futuresLeverage}
                      onChange={(e) => setFuturesLeverage(e.target.value)}
                      className="bg-black/40 border-yellow-500/20 text-yellow-400"
                      min="1"
                      max="125"
                    />
                    <div className="flex gap-2">
                      {['5', '10', '20', '50'].map((lev) => (
                        <Button
                          key={lev}
                          variant="outline"
                          size="sm"
                          onClick={() => setFuturesLeverage(lev)}
                          className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          {lev}x
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Pozisyon Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Mevcut Kaldıraç:</span>
                      <span className="text-yellow-400">{futuresLeverage}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Margin Gereksinimi:</span>
                      <span className="text-yellow-400">{(1000 / parseInt(futuresLeverage)).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Tahmini Kar/Zarar:</span>
                      <span className="text-green-400">+{(parseInt(futuresLeverage) * 0.5).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleFuturesOrder}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {futuresLeverage}x Kaldıraçlı Pozisyon Aç
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking" className="space-y-4">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Binance Staking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { coin: 'BNB', apy: '8.5%', min: '0.1', color: 'yellow' },
                  { coin: 'BUSD', apy: '6.2%', min: '10', color: 'green' },
                  { coin: 'USDT', apy: '5.8%', min: '10', color: 'blue' },
                  { coin: 'ETH', apy: '4.5%', min: '0.01', color: 'purple' }
                ].map((stake) => (
                  <div key={stake.coin} className={`bg-${stake.color}-500/10 border border-${stake.color}-500/20 rounded-lg p-4`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`text-${stake.color}-400 font-semibold`}>{stake.coin} Staking</h4>
                      <Badge className={`bg-${stake.color}-500/20 text-${stake.color}-400`}>
                        {stake.apy} APY
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`text-${stake.color}-400/80`}>Min. Miktar:</span>
                        <span className={`text-${stake.color}-400`}>{stake.min} {stake.coin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-${stake.color}-400/80`}>Süre:</span>
                        <span className={`text-${stake.color}-400`}>30 gün</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">BNB Staking</h4>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Staking miktarı (BNB)"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    className="bg-black/40 border-yellow-500/20 text-yellow-400"
                    step="0.1"
                  />
                  <Button 
                    onClick={handleStaking}
                    disabled={!stakingAmount}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    BNB Staking Başlat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="launchpad" className="space-y-4">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Binance Launchpad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Aktif Proje: NEXUS Token (NXT)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Token Fiyatı:</span>
                      <span className="text-yellow-400">$0.10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Toplam Arz:</span>
                      <span className="text-yellow-400">100M NXT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Kalan Süre:</span>
                      <span className="text-green-400">2 gün 14 saat</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Min. Katılım:</span>
                      <span className="text-yellow-400">1 BNB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Max. Katılım:</span>
                      <span className="text-yellow-400">100 BNB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Tahmini ROI:</span>
                      <span className="text-green-400">+250%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Launchpad'e Katıl</h4>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Katılım miktarı (BNB)"
                    value={launchpadAmount}
                    onChange={(e) => setLaunchpadAmount(e.target.value)}
                    className="bg-black/40 border-yellow-500/20 text-yellow-400"
                    step="0.1"
                    min="1"
                    max="100"
                  />
                  <Button 
                    onClick={handleLaunchpadParticipation}
                    disabled={!launchpadAmount}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Launchpad'e Katıl
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Binance Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">BNB Bakiyesi</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">12.45 BNB</p>
                    <p className="text-yellow-400/60 text-sm">≈ $3,735.00</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Komisyon İndirimi</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Mevcut İndirim:</span>
                      <span className="text-green-400">%25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-400/80">Aylık Tasarruf:</span>
                      <span className="text-green-400">$45.20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Binance Wallet Özellikleri</h4>
                <ul className="text-yellow-400/80 text-sm space-y-1">
                  <li>• BNB ile %25 komisyon indirimi</li>
                  <li>• Otomatik staking ödülleri</li>
                  <li>• Launchpad erken erişimi</li>
                  <li>• VIP seviye avantajları</li>
                  <li>• Cross-margin trading desteği</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Binance Wallet'ı Bağla
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
