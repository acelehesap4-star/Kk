import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Coins,
  Wallet,
  Target,
  BarChart3,
  Zap,
  Shield,
  Copy,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface OKXToolsProps {
  symbol: string;
  userId: string;
}

export function OKXTools({ symbol, userId }: OKXToolsProps) {
  const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');
  const [strikePrice, setStrikePrice] = useState('');
  const [copyAmount, setCopyAmount] = useState('');
  const [selectedTrader, setSelectedTrader] = useState('');
  const [defiAmount, setDefiAmount] = useState('');

  const handleOptionsTrading = async () => {
    if (!strikePrice) {
      toast.error('Lütfen strike price girin');
      return;
    }
    toast.success(`${optionType} opsiyonu ${strikePrice} strike price ile açıldı!`);
    setStrikePrice('');
  };

  const handleCopyTrading = async () => {
    if (!copyAmount || !selectedTrader) {
      toast.error('Lütfen trader ve miktar seçin');
      return;
    }
    toast.success(`${selectedTrader} trader'ı ${copyAmount} USDT ile kopyalanıyor!`);
    setCopyAmount('');
  };

  const handleDeFiStaking = async () => {
    if (!defiAmount) {
      toast.error('Lütfen staking miktarını girin');
      return;
    }
    toast.success(`${defiAmount} OKB DeFi staking başlatıldı!`);
    setDefiAmount('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-blue-400 font-bold text-sm">O</span>
            </div>
            OKX Özel Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-400/80 text-sm">
            OKX'in sunduğu gelişmiş trading araçları ve DeFi özelliklerini kullanın
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="options" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-blue-500/20">
          <TabsTrigger value="options" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Target className="h-4 w-4 mr-2" />
            Options
          </TabsTrigger>
          <TabsTrigger value="copy-trading" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Copy className="h-4 w-4 mr-2" />
            Copy Trading
          </TabsTrigger>
          <TabsTrigger value="defi" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Coins className="h-4 w-4 mr-2" />
            DeFi
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Wallet className="h-4 w-4 mr-2" />
            Multi-Chain
          </TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-4">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Options Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Opsiyon Tipi</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={optionType === 'CALL' ? 'default' : 'outline'}
                      onClick={() => setOptionType('CALL')}
                      className={`${
                        optionType === 'CALL' 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'border-green-500/50 text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      CALL
                    </Button>
                    <Button
                      variant={optionType === 'PUT' ? 'default' : 'outline'}
                      onClick={() => setOptionType('PUT')}
                      className={`${
                        optionType === 'PUT' 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      PUT
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Greeks Analizi</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-400/80">Delta:</span>
                      <span className="text-blue-400">0.65</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/80">Gamma:</span>
                      <span className="text-blue-400">0.02</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/80">Theta:</span>
                      <span className="text-red-400">-0.05</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/80">Vega:</span>
                      <span className="text-blue-400">0.12</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Strike Price</h4>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Strike price (USDT)"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    className="bg-black/40 border-blue-500/20 text-blue-400"
                    step="0.01"
                  />
                  <div className="flex gap-2">
                    {['42000', '43000', '44000', '45000'].map((price) => (
                      <Button
                        key={price}
                        variant="outline"
                        size="sm"
                        onClick={() => setStrikePrice(price)}
                        className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                      >
                        ${price}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleOptionsTrading}
                disabled={!strikePrice}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold"
              >
                <Target className="h-4 w-4 mr-2" />
                {optionType} Opsiyonu Aç
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="copy-trading" className="space-y-4">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Copy Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'CryptoMaster', roi: '+245%', followers: '12.5K', risk: 'Orta' },
                  { name: 'BTCWhale', roi: '+189%', followers: '8.2K', risk: 'Yüksek' },
                  { name: 'SafeTrader', roi: '+67%', followers: '25.1K', risk: 'Düşük' },
                  { name: 'AltcoinKing', roi: '+156%', followers: '6.8K', risk: 'Orta' }
                ].map((trader) => (
                  <div key={trader.name} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-blue-400 font-semibold">{trader.name}</h4>
                      <Badge className="bg-green-500/20 text-green-400">
                        {trader.roi}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400/80">Takipçi:</span>
                        <span className="text-blue-400">{trader.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400/80">Risk:</span>
                        <span className={`${
                          trader.risk === 'Düşük' ? 'text-green-400' :
                          trader.risk === 'Orta' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {trader.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Copy Trading Başlat</h4>
                <div className="space-y-2">
                  <Select value={selectedTrader} onValueChange={setSelectedTrader}>
                    <SelectTrigger className="bg-black/40 border-blue-500/20 text-blue-400">
                      <SelectValue placeholder="Trader seçin" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-blue-500/20">
                      <SelectItem value="CryptoMaster" className="text-blue-400">CryptoMaster (+245%)</SelectItem>
                      <SelectItem value="BTCWhale" className="text-blue-400">BTCWhale (+189%)</SelectItem>
                      <SelectItem value="SafeTrader" className="text-blue-400">SafeTrader (+67%)</SelectItem>
                      <SelectItem value="AltcoinKing" className="text-blue-400">AltcoinKing (+156%)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="Kopyalama miktarı (USDT)"
                    value={copyAmount}
                    onChange={(e) => setCopyAmount(e.target.value)}
                    className="bg-black/40 border-blue-500/20 text-blue-400"
                    step="10"
                    min="100"
                  />
                  
                  <Button 
                    onClick={handleCopyTrading}
                    disabled={!copyAmount || !selectedTrader}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Trading Başlat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Coins className="h-5 w-5" />
                DeFi Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'OKB Staking', apy: '12.5%', tvl: '$45M', chain: 'OKC' },
                  { name: 'USDT Yield', apy: '8.2%', tvl: '$120M', chain: 'ETH' },
                  { name: 'BTC Lending', apy: '6.8%', tvl: '$89M', chain: 'BTC' },
                  { name: 'ETH Farming', apy: '15.3%', tvl: '$67M', chain: 'ETH' }
                ].map((defi) => (
                  <div key={defi.name} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-blue-400 font-semibold">{defi.name}</h4>
                      <Badge className="bg-green-500/20 text-green-400">
                        {defi.apy} APY
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400/80">TVL:</span>
                        <span className="text-blue-400">{defi.tvl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400/80">Chain:</span>
                        <span className="text-blue-400">{defi.chain}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">DeFi Staking</h4>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Staking miktarı (OKB)"
                    value={defiAmount}
                    onChange={(e) => setDefiAmount(e.target.value)}
                    className="bg-black/40 border-blue-500/20 text-blue-400"
                    step="0.1"
                  />
                  <Button 
                    onClick={handleDeFiStaking}
                    disabled={!defiAmount}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    DeFi Staking Başlat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                OKX Multi-Chain Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { chain: 'Ethereum', balance: '2.45 ETH', value: '$6,125', color: 'purple' },
                  { chain: 'BSC', balance: '12.8 BNB', value: '$3,840', color: 'yellow' },
                  { chain: 'Polygon', balance: '1,250 MATIC', value: '$1,125', color: 'indigo' },
                  { chain: 'Solana', balance: '45.2 SOL', value: '$2,260', color: 'green' }
                ].map((wallet) => (
                  <div key={wallet.chain} className={`bg-${wallet.color}-500/10 border border-${wallet.color}-500/20 rounded-lg p-4`}>
                    <h4 className={`text-${wallet.color}-400 font-semibold mb-2`}>{wallet.chain}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className={`text-${wallet.color}-400/80`}>Bakiye:</span>
                        <span className={`text-${wallet.color}-400`}>{wallet.balance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-${wallet.color}-400/80`}>Değer:</span>
                        <span className={`text-${wallet.color}-400`}>{wallet.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Multi-Chain Özellikler</h4>
                <ul className="text-blue-400/80 text-sm space-y-1">
                  <li>• Cross-chain bridge desteği</li>
                  <li>• Multi-chain DeFi erişimi</li>
                  <li>• NFT koleksiyonu yönetimi</li>
                  <li>• Tek cüzdanda tüm chainler</li>
                  <li>• Düşük gas fee optimizasyonu</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold"
              >
                <Wallet className="h-4 w-4 mr-2" />
                OKX Wallet'ı Bağla
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
