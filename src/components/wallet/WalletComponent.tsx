import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface WalletProps {
  user: User;
  exchange: string;
}

interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export const WalletComponent: React.FC<WalletProps> = ({ user, exchange }) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = async () => {
    try {
      setIsLoading(true);
      const { data: exchangeKeys } = await supabase
        .from('exchange_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('exchange', exchange)
        .single();

      if (!exchangeKeys) {
        toast.error('Borsa API anahtarları bulunamadı');
        return;
      }

      // Exchange API entegrasyonu
      const response = await fetch(`/api/balances?exchange=${exchange}`, {
        headers: {
          'Authorization': `Bearer ${exchangeKeys.api_key}`,
          'X-API-SECRET': exchangeKeys.api_secret
        }
      });

      const data = await response.json();
      setBalances(data.balances);
    } catch (error) {
      toast.error('Bakiye bilgileri alınamadı');
      console.error('Bakiye alma hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [exchange, user]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Wallet className="w-4 h-4 mr-2 inline-block" />
          {exchange} Cüzdan
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchBalances}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {balances.map((balance) => (
            <div
              key={balance.asset}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div>
                <span className="font-medium">{balance.asset}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {balance.total.toFixed(8)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Kullanılabilir: {balance.free.toFixed(8)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};