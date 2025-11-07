import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  Settings,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  email: string;
  password: string;
}

interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  network: string;
  cryptoAmount: string;
  nxtAmount: number;
  walletAddress: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: Date;
  adminNotes?: string;
}

interface TradingActivity {
  id: string;
  userId: string;
  userEmail: string;
  exchange: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  commission: number;
  nxtUsed: number;
  timestamp: Date;
}

interface PlatformStats {
  totalUsers: number;
  totalVolume: string;
  totalCommissions: number;
  nxtCirculation: number;
  activeExchanges: number;
  pendingTransactions: number;
}

const ADMIN_CREDENTIALS: AdminUser = {
  email: 'berkecansuskun1998@gmail.com',
  password: '7892858a'
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tradingActivities, setTradingActivities] = useState<TradingActivity[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalVolume: '$0',
    totalCommissions: 0,
    nxtCirculation: 0,
    activeExchanges: 15,
    pendingTransactions: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = () => {
    // Simulated admin data
    setTransactions([
      {
        id: '1',
        userId: 'user1',
        userEmail: 'user1@example.com',
        network: 'Ethereum',
        cryptoAmount: '0.5',
        nxtAmount: 1250,
        walletAddress: '0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1',
        txHash: '0x1234567890abcdef',
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        userId: 'user2',
        userEmail: 'user2@example.com',
        network: 'Bitcoin',
        cryptoAmount: '0.001',
        nxtAmount: 50,
        walletAddress: 'bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8',
        txHash: 'bc1q1234567890',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]);

    setTradingActivities([
      {
        id: '1',
        userId: 'user1',
        userEmail: 'user1@example.com',
        exchange: 'BINANCE',
        symbol: 'BTCUSDT',
        side: 'buy',
        amount: 0.1,
        price: 45000,
        commission: 4.5,
        nxtUsed: 45,
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: '2',
        userId: 'user2',
        userEmail: 'user2@example.com',
        exchange: 'NASDAQ',
        symbol: 'AAPL',
        side: 'sell',
        amount: 10,
        price: 150,
        commission: 1.5,
        nxtUsed: 15,
        timestamp: new Date(Date.now() - 7200000)
      }
    ]);

    setStats({
      totalUsers: 1247,
      totalVolume: '$12.4M',
      totalCommissions: 45678.90,
      nxtCirculation: 2500000,
      activeExchanges: 15,
      pendingTransactions: 3
    });
  };

  const handleLogin = () => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      toast.success('Admin paneline giriş yapıldı');
    } else {
      toast.error('Geçersiz email veya şifre');
    }
  };

  const handleTransactionAction = (transactionId: string, action: 'approve' | 'reject', notes?: string) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === transactionId 
          ? { 
              ...tx, 
              status: action === 'approve' ? 'confirmed' : 'rejected',
              adminNotes: notes 
            }
          : tx
      )
    );
    toast.success(`İşlem ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Onaylandı</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Bekliyor</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Reddedildi</Badge>;
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        
        <Card className="w-full max-w-md bg-black/40 border-red-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 shadow-2xl shadow-red-500/30 ring-2 ring-red-500/40">
                <Shield className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-400">Admin Panel</CardTitle>
            <p className="text-red-400/60">Yetkili giriş gerekli</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-red-400/80 mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-red-500/20 text-red-400"
              />
            </div>
            <div>
              <label className="text-sm text-red-400/80 mb-2 block">Şifre</label>
              <Input
                type="password"
                placeholder="Admin şifresi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/40 border-red-500/20 text-red-400"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-semibold"
            >
              <Shield className="h-4 w-4 mr-2" />
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/30 shadow-lg shadow-red-500/30">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-400">Admin Panel</h1>
                <p className="text-red-400/60 text-sm">NEXUS TRADE Yönetim Merkezi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={loadAdminData}
                variant="outline"
                size="sm"
                className="bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Button 
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
                size="sm"
                className="bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Çıkış
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-xs text-cyan-400/60 uppercase">Toplam Kullanıcı</p>
                    <p className="text-xl font-bold text-cyan-400">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-xs text-green-400/60 uppercase">Toplam Hacim</p>
                    <p className="text-xl font-bold text-green-400">{stats.totalVolume}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-xs text-yellow-400/60 uppercase">Komisyon</p>
                    <p className="text-xl font-bold text-yellow-400">${stats.totalCommissions.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-xs text-purple-400/60 uppercase">NXT Dolaşım</p>
                    <p className="text-xl font-bold text-purple-400">{stats.nxtCirculation.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-xs text-blue-400/60 uppercase">Aktif Borsa</p>
                    <p className="text-xl font-bold text-blue-400">{stats.activeExchanges}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-xs text-orange-400/60 uppercase">Bekleyen</p>
                    <p className="text-xl font-bold text-orange-400">{stats.pendingTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-red-500/20">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Token İşlemleri
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Trading Aktivitesi
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Sistem Ayarları
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Token Satın Alma İşlemleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="bg-black/40 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30">
                              <Wallet className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-cyan-400">{tx.userEmail}</p>
                              <p className="text-xs text-cyan-400/60">{tx.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          {getStatusBadge(tx.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">Network & Amount</p>
                            <p className="text-sm text-cyan-400">{tx.network}</p>
                            <p className="text-sm font-semibold text-yellow-400">{tx.cryptoAmount} → {tx.nxtAmount.toLocaleString()} NXT</p>
                          </div>
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">TX Hash</p>
                            <p className="text-xs text-cyan-400 font-mono break-all">{tx.txHash}</p>
                          </div>
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">Wallet Address</p>
                            <p className="text-xs text-cyan-400 font-mono break-all">{tx.walletAddress}</p>
                          </div>
                        </div>

                        {tx.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-3 border-t border-red-500/20">
                            <Button
                              size="sm"
                              onClick={() => handleTransactionAction(tx.id, 'approve')}
                              className="bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Onayla
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTransactionAction(tx.id, 'reject', 'Admin tarafından reddedildi')}
                              className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reddet
                            </Button>
                          </div>
                        )}

                        {tx.adminNotes && (
                          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                            <p className="text-xs text-yellow-400">Admin Notu: {tx.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trading" className="space-y-4">
              <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Trading Aktiviteleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tradingActivities.map((activity) => (
                      <div key={activity.id} className="bg-black/40 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              activity.side === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                              <TrendingUp className={`h-5 w-5 ${
                                activity.side === 'buy' ? 'text-green-400' : 'text-red-400'
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold text-cyan-400">{activity.userEmail}</p>
                              <p className="text-xs text-cyan-400/60">{activity.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge className={`${
                            activity.side === 'buy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {activity.side.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">Exchange & Symbol</p>
                            <p className="text-sm text-cyan-400">{activity.exchange}</p>
                            <p className="text-sm font-semibold text-yellow-400">{activity.symbol}</p>
                          </div>
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">Amount & Price</p>
                            <p className="text-sm text-cyan-400">{activity.amount}</p>
                            <p className="text-sm text-cyan-400">${activity.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">Commission</p>
                            <p className="text-sm text-cyan-400">${activity.commission}</p>
                          </div>
                          <div>
                            <p className="text-xs text-cyan-400/60 uppercase">NXT Used</p>
                            <p className="text-sm font-semibold text-yellow-400">{activity.nxtUsed} NXT</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Platform Ayarları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-red-400/80 mb-2 block">NXT Token Fiyatı (USD)</label>
                      <Input
                        type="number"
                        defaultValue="0.10"
                        className="bg-black/40 border-red-500/20 text-red-400"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-red-400/80 mb-2 block">Minimum Komisyon (%)</label>
                      <Input
                        type="number"
                        defaultValue="0.1"
                        className="bg-black/40 border-red-500/20 text-red-400"
                        step="0.01"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white">
                      Ayarları Kaydet
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Raporlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Download className="h-4 w-4 mr-2" />
                      İşlem Raporu İndir
                    </Button>
                    <Button variant="outline" className="w-full bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Download className="h-4 w-4 mr-2" />
                      Kullanıcı Raporu İndir
                    </Button>
                    <Button variant="outline" className="w-full bg-black/40 border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Download className="h-4 w-4 mr-2" />
                      Komisyon Raporu İndir
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}