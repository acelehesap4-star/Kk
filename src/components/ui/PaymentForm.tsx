import { useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { coldWalletSystem } from '@/lib/coldWalletSystem';

const paymentSchema = z.object({
  network: z.string().min(1, 'Ağ seçin'),
  amount: z.number().positive('Geçerli bir miktar girin'),
  walletAddress: z.string().min(30, 'Geçerli bir cüzdan adresi girin'),
  txHash: z.string().optional()
});

interface PaymentFormProps {
  user: any;
  onSuccess?: () => void;
}

export function PaymentForm({ user, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [networkAddresses, setNetworkAddresses] = useState<any>({});

  useEffect(() => {
    const loadNetworks = async () => {
      try {
        const networks = await coldWalletSystem.getNetworkAddresses();
        setNetworkAddresses(networks);
      } catch (err) {
        console.error('Ağ bilgileri yüklenemedi:', err);
        toast.error('Ağ bilgileri yüklenirken bir hata oluştu');
      }
    };

    loadNetworks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        network,
        amount: parseFloat(amount),
        walletAddress,
        txHash: txHash || undefined
      };

      await paymentSchema.parseAsync(data);

      await coldWalletSystem.submitTransaction(
        user.id,
        data.network,
        data.amount,
        data.walletAddress,
        data.txHash
      );

      toast.success('Ödeme talebi başarıyla oluşturuldu');
      
      // Form alanlarını temizle
      setNetwork('');
      setAmount('');
      setWalletAddress('');
      setTxHash('');

      // Callback fonksiyonunu çağır
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Ödeme talebi oluşturma hatası:', err);
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error('Ödeme talebi oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedNetwork = networkAddresses[network];
  const estimatedCoins = selectedNetwork && !isNaN(parseFloat(amount))
    ? Math.floor(parseFloat(amount) * selectedNetwork.coinRate)
    : null;

  return (
    <Card className="bg-black/30 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Yeni Ödeme Talebi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="network">Ödeme Ağı</Label>
            <Select
              value={network}
              onValueChange={setNetwork}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ağ seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(networkAddresses).map(([key, info]: [string, any]) => (
                  <SelectItem key={key} value={key}>
                    {key} (Min: {info.minAmount} {key})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Miktar</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={selectedNetwork ? \`Min: \${selectedNetwork.minAmount}\` : "Miktar girin"}
                step="any"
                className="pr-16"
              />
              {network && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-400">{network}</span>
                </div>
              )}
            </div>
            {estimatedCoins !== null && (
              <p className="text-sm text-gray-400">
                ≈ {estimatedCoins.toLocaleString()} Coin
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Gönderen Cüzdan Adresi</Label>
            <Input
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Ödemeyi yapacağınız cüzdan adresi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="txHash">İşlem Hash (Opsiyonel)</Label>
            <Input
              id="txHash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="İşlem hash'i varsa girin"
            />
            <p className="text-xs text-gray-400">
              İşlem hash'i daha sonra da ekleyebilirsiniz
            </p>
          </div>

          {selectedNetwork && (
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <h3 className="font-medium text-white">Ödeme Adresi</h3>
              <p className="font-mono text-sm text-gray-400 break-all">
                {selectedNetwork.address}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Bu adrese {selectedNetwork.minAmount} {network} veya üzeri ödeme yapın
              </p>
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
                <p className="text-sm text-yellow-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Önemli
                </p>
                <ul className="mt-2 text-xs text-yellow-500/80 space-y-1 list-disc list-inside">
                  <li>Ödemeyi YALNIZCA yukarıdaki adrese yapın</li>
                  <li>Farklı bir adrese yapılan ödemeler kabul edilmeyecektir</li>
                  <li>Ödeme ağını ({network}) doğru seçtiğinizden emin olun</li>
                  <li>{network} ağında {selectedNetwork.verificationConfirmations || 'yeterli'} blok onayı beklenecektir</li>
                  <li>Bu işlem için {selectedNetwork.coinRate} coin/{network} oranı uygulanacaktır</li>
                </ul>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !network || !amount || !walletAddress}
          >
            {loading ? 'İşleniyor...' : 'Ödeme Talebi Oluştur'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}