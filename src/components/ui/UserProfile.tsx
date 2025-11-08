import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Wallet,
  History,
  Settings,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { coinSystem } from '@/lib/coinSystem';
import { coldWalletSystem } from '@/lib/coldWalletSystem';

interface ColdWalletAddress {
  address: string;
  minAmount: number;
  coinRate: number;
}

export default function UserProfile({ user }: { user: any }) {
  const [coinBalance, setCoinBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [coldWalletTransactions, setColdWalletTransactions] = useState<any[]>([]);
  const [networkAddresses, setNetworkAddresses] = useState<{ [key: string]: ColdWalletAddress }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // Paralel olarak tüm verileri yükle
        const [balance, txHistory, coldWalletTxs, networks] = await Promise.all([
          coinSystem.getUserBalance(user.id),
          coinSystem.getUserTransactions(user.id),
          coldWalletSystem.getUserTransactions(user.id),
          coldWalletSystem.getNetworkAddresses()
        ]);

        setCoinBalance(balance);
        setTransactions(txHistory);
        setColdWalletTransactions(coldWalletTxs);
        setNetworkAddresses(networks);
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        toast.error('Bilgiler yüklenirken bir hata oluştu');
      }
    };

    loadData();
  }, [user.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Adres kopyalandı!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tamamlandı
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">
            <History className="h-3 w-3 mr-1" />
            Bekliyor
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Reddedildi
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Üst Bilgi Kartı */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Coin Bakiyesi</h3>
                  <Wallet className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {coinBalance.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Toplam İşlem</h3>
                  <History className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {transactions.length + coldWalletTransactions.length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400">Bekleyen İşlem</h3>
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {coldWalletTransactions.filter(tx => tx.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Soğuk Cüzdan Adresleri */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Ödeme Adresleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(networkAddresses).map(([network, info]) => (
              <div key={network} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400">{network}</Badge>
                  <span className="text-xs text-gray-400">
                    Min: {info.minAmount} {network}
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-sm text-white break-all">
                  <span className="flex-1">{info.address}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(info.address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {info.minAmount} {network} = {(info.minAmount * info.coinRate).toLocaleString()} Coin
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* İşlem Geçmişi */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...transactions, ...coldWalletTransactions]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((tx, index) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.transactionType === 'credit' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                    )}>
                      {tx.network ? (
                        <Wallet className="h-5 w-5 text-white" />
                      ) : (
                        <History className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">
                          {tx.network ? `${tx.amount} ${tx.network}` : tx.amount.toLocaleString()} 
                          {!tx.network && ' Coin'}
                        </p>
                        {tx.network && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {(tx.amount * networkAddresses[tx.network]?.coinRate).toLocaleString()} Coin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                      {tx.txHash && (
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          TX: {tx.txHash}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 ml-2"
                            onClick={() => copyToClipboard(tx.txHash)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>
              ))}

            {transactions.length + coldWalletTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz işlem geçmişi yok</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}