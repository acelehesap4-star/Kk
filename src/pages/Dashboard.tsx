import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Coins, 
  BarChart3, 
  Activity,
  Wallet,
  Settings,
  Crown,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EXCHANGES } from '@/lib/exchanges';
import { Exchange } from '@/types/trading';

interface MarketCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  exchanges: Exchange[];
  color: string;
  volume: string;
  change24h: string;
  isPositive: boolean;
}

const marketCategories: MarketCategory[] = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, Altcoins ve DeFi tokenları',
    icon: <Coins className="h-8 w-8" />,
    exchanges: ['BINANCE', 'OKX', 'KUCOIN', 'COINBASE', 'BYBIT', 'KRAKEN', 'HUOBI', 'GATE', 'MEXC', 'BITGET', 'CRYPTO_FUTURES'],
    color: 'from-orange-500 to-yellow-500',
    volume: '$2.1T',
    change24h: '+5.2%',
    isPositive: true
  },
  {
    id: 'stocks',
    name: 'Stock Markets',
    description: 'NASDAQ, NYSE ve küresel hisse senetleri',
    icon: <TrendingUp className="h-8 w-8" />,
    exchanges: ['NASDAQ', 'NYSE'],
    color: 'from-blue-500 to-cyan-500',
    volume: '$400B',
    change24h: '+1.8%',
    isPositive: true
  },
  {
    id: 'forex',
    name: 'Foreign Exchange',
    description: 'Döviz çiftleri ve para birimleri',
    icon: <Globe className="h-8 w-8" />,
    exchanges: ['FOREX'],
    color: 'from-green-500 to-emerald-500',
    volume: '$7.5T',
    change24h: '-0.3%',
    isPositive: false
  },
  {
    id: 'commodities',
    name: 'Commodities',
    description: 'Altın, gümüş, petrol ve tarım ürünleri',
    icon: <BarChart3 className="h-8 w-8" />,
    exchanges: ['COMMODITIES'],
    color: 'from-purple-500 to-pink-500',
    volume: '$45B',
    change24h: '+2.1%',
    isPositive: true
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userTokenBalance, setUserTokenBalance] = useState(0);

  useEffect(() => {
    // Simulated token balance - in real app, fetch from backend
    setUserTokenBalance(1250.75);
  }, []);

  const handleMarketSelect = (category: MarketCategory, exchange: Exchange) => {
    navigate(`/trading/${exchange.toLowerCase()}?category=${category.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-500/40">
                <Activity className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                  NEXUS TRADE
                </h1>
                <p className="text-cyan-400/60 text-sm font-semibold uppercase tracking-widest">
                  Multi-Market Trading Platform
                </p>
              </div>
            </div>
            
            {/* Token Balance */}
            <div className="flex items-center justify-center gap-4">
              <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 shadow-lg shadow-yellow-500/30">
                      <Crown className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60 uppercase tracking-wider">NXT Token Balance</p>
                      <p className="text-xl font-bold text-yellow-400">{userTokenBalance.toLocaleString()} NXT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={() => navigate('/wallet')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Token Satın Al
              </Button>
            </div>
          </div>

          {/* Market Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketCategories.map((category) => (
              <Card 
                key={category.id}
                className={`bg-black/40 border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group ${
                  selectedCategory === category.id ? 'ring-2 ring-cyan-400/60' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${category.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {category.change24h}
                      </p>
                      <p className="text-xs text-cyan-400/60">24h</p>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-cyan-400 text-lg">{category.name}</CardTitle>
                    <p className="text-xs text-cyan-400/60 mt-1">{category.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-cyan-400/60">Daily Volume</p>
                      <p className="text-lg font-bold text-cyan-400">{category.volume}</p>
                    </div>
                    <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                      {category.exchanges.length} Exchanges
                    </Badge>
                  </div>
                  
                  {selectedCategory === category.id && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="border-t border-cyan-500/20 pt-3">
                        <p className="text-xs text-cyan-400/60 mb-2 uppercase tracking-wider">Available Exchanges</p>
                        <div className="grid grid-cols-1 gap-2">
                          {category.exchanges.map((exchange) => (
                            <Button
                              key={exchange}
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarketSelect(category, exchange);
                              }}
                              className="justify-between text-cyan-400/80 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                            >
                              <div className="flex items-center gap-2">
                                <Zap className="h-3 w-3" />
                                <span>{EXCHANGES[exchange].name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400/60">
                                  {EXCHANGES[exchange].type}
                                </Badge>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 shadow-lg shadow-green-500/30">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400/60 uppercase tracking-wider">Total Volume</p>
                    <p className="text-2xl font-bold text-cyan-400">$10.1T</p>
                    <p className="text-xs text-green-400">+12.5% today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 shadow-lg shadow-blue-500/30">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400/60 uppercase tracking-wider">Active Markets</p>
                    <p className="text-2xl font-bold text-cyan-400">15</p>
                    <p className="text-xs text-cyan-400/60">Exchanges connected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/30">
                    <DollarSign className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400/60 uppercase tracking-wider">Commission Saved</p>
                    <p className="text-2xl font-bold text-cyan-400">$2,847</p>
                    <p className="text-xs text-purple-400">With NXT tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Access */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/admin')}
              variant="outline"
              className="bg-black/40 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/40"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}