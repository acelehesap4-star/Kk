import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  Crown, 
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletAddress {
  network: string;
  symbol: string;
  address: string;
  icon: string;
  color: string;
  rate: number; // NXT tokens per 1 unit of this crypto
  minAmount: number;
}

const walletAddresses: WalletAddress[] = [
  {
    network: 'Ethereum',
    symbol: 'ETH',
    address: '0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1',
    icon: '⟠',
    color: 'from-blue-500 to-cyan-500',
    rate: 2500,
    minAmount: 0.01
  },
  {
    network: 'Solana',
    symbol: 'SOL',
    address: 'Gp4itYBqqkNRNYtC22QAPyTThPB6Kzx8M1yy2rpXBGxbc',
    icon: '◎',
    color: 'from-purple-500 to-pink-500',
    rate: 150,
    minAmount: 0.1
  },
  {
    network: 'Tron',
    symbol: 'TRX',
    address: 'THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739',
    icon: '⚡',
    color: 'from-red-500 to-orange-500',
    rate: 15,
    minAmount: 100
  },
  {
    network: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8',
    icon: '₿',
    color: 'from-yellow-500 to-orange-500',
    rate: 50000,
    minAmount: 0.001
  }
];

interface Transaction {
  id: string;
  network: string;
  amount: string;
  nxtAmount: number;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

export default function Wallet() {
  const [selectedWallet, setSelectedWallet] = useState<WalletAddress>(walletAddresses[0]);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userBalance, setUserBalance] = useState(1250.75);

  useEffect(() => {
    // Simulated transaction history
    setTransactions([
      {
        id: '1',
        network: 'Ethereum',
        amount: '0.5',
        nxtAmount: 1250,
        txHash: '0x1234...5678',
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        network: 'Bitcoin',
        amount: '0.001',
        nxtAmount: 50,
        txHash: 'bc1q...xyz',
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Adres kopyalandı!');
  };

  const calculateNXTAmount = (cryptoAmount: string): number => {
    const amount = parseFloat(cryptoAmount) || 0;
    return amount * selectedWallet.rate;
  };

  const handlePurchase = () => {
    const cryptoAmount = parseFloat(amount);
    if (cryptoAmount < selectedWallet.minAmount) {
      toast.error(`Minimum ${selectedWallet.minAmount} ${selectedWallet.symbol} gerekli`);
      return;
    }

    const nxtAmount = calculateNXTAmount(amount);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      network: selectedWallet.network,
      amount: amount,
      nxtAmount: nxtAmount,
      txHash: 'pending...',
      status: 'pending',
      timestamp: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    toast.success('Transfer talimatı oluşturuldu! Lütfen belirtilen adrese gönderim yapın.');
    setAmount('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 shadow-2xl shadow-yellow-500/30 ring-2 ring-yellow-500/40">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-4xl font-black tracking-tight text-transparent">
                  NXT TOKEN
                </h1>
                <p className="text-cyan-400/60 text-sm font-semibold uppercase tracking-widest">
                  Platform Native Token
                </p>
              </div>
            </div>
            
            {/* Current Balance */}
            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-xs text-yellow-400/60 uppercase tracking-wider mb-2">Mevcut Bakiye</p>
                  <p className="text-3xl font-bold text-yellow-400">{userBalance.toLocaleString()} NXT</p>
                  <p className="text-xs text-cyan-400/60 mt-1">≈ ${(userBalance * 0.1).toLocaleString()} USD</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="buy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-cyan-500/20">
              <TabsTrigger value="buy" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Token Satın Al
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                İşlem Geçmişi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-6">
              {/* Wallet Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {walletAddresses.map((wallet) => (
                  <Card 
                    key={wallet.symbol}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedWallet.symbol === wallet.symbol 
                        ? 'bg-black/60 border-cyan-400/60 ring-2 ring-cyan-400/40' 
                        : 'bg-black/40 border-cyan-500/20 hover:border-cyan-400/40'
                    } backdrop-blur-xl`}
                    onClick={() => setSelectedWallet(wallet)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${wallet.color} shadow-lg mx-auto`}>
                          <span className="text-2xl">{wallet.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-cyan-400">{wallet.network}</p>
                          <p className="text-xs text-cyan-400/60">{wallet.symbol}</p>
                        </div>
                        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">
                          {wallet.rate.toLocaleString()} NXT/{wallet.symbol}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Purchase Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Token Satın Al
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-cyan-400/80 mb-2 block">
                        {selectedWallet.symbol} Miktarı
                      </label>
                      <Input
                        type="number"
                        placeholder={`Min: ${selectedWallet.minAmount} ${selectedWallet.symbol}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/40 border-cyan-500/20 text-cyan-400"
                        step="0.001"
                        min={selectedWallet.minAmount}
                      />
                    </div>
                    
                    {amount && (
                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400/80">Alacağınız NXT:</span>
                          <span className="text-xl font-bold text-yellow-400">
                            {calculateNXTAmount(amount).toLocaleString()} NXT
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handlePurchase}
                      disabled={!amount || parseFloat(amount) < selectedWallet.minAmount}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Token Satın Al
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Gönderim Adresi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${selectedWallet.color} shadow-lg`}>
                          <span className="text-xl">{selectedWallet.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-cyan-400">{selectedWallet.network}</p>
                          <p className="text-xs text-cyan-400/60">Cold Wallet Address</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/60 border border-cyan-500/20 rounded-lg p-3">
                        <p className="text-xs text-cyan-400/60 mb-1">Adres:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-cyan-400 break-all flex-1">
                            {selectedWallet.address}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(selectedWallet.address)}
                            className="text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-yellow-400/80">
                            <p className="font-semibold mb-1">Önemli Uyarı:</p>
                            <ul className="space-y-1">
                              <li>• Sadece {selectedWallet.network} ağından gönderim yapın</li>
                              <li>• Minimum {selectedWallet.minAmount} {selectedWallet.symbol} göndermelisiniz</li>
                              <li>• Tokenlar 1-3 blok onayından sonra hesabınıza yansır</li>
                              <li>• Yanlış ağdan gönderilen fonlar geri alınamaz</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    İşlem Geçmişi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-cyan-400/60">Henüz işlem geçmişiniz bulunmuyor</p>
                      </div>
                    ) : (
                      transactions.map((tx) => (
                        <div key={tx.id} className="bg-black/40 border border-cyan-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(tx.status)}
                              <div>
                                <p className="font-semibold text-cyan-400">
                                  {tx.amount} {tx.network === 'Ethereum' ? 'ETH' : tx.network === 'Bitcoin' ? 'BTC' : tx.network === 'Solana' ? 'SOL' : 'TRX'}
                                </p>
                                <p className="text-xs text-cyan-400/60">
                                  {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-yellow-400">+{tx.nxtAmount.toLocaleString()} NXT</p>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    tx.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}
                                >
                                  {tx.status === 'confirmed' ? 'Onaylandı' : tx.status === 'pending' ? 'Bekliyor' : 'Başarısız'}
                                </Badge>
                                {tx.txHash !== 'pending...' && (
                                  <Button size="sm" variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10 p-1">
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}