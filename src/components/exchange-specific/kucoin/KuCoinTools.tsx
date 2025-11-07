import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface KuCoinToolsProps {
  symbol: string;
  userId: string;
}

export function KuCoinTools({ symbol, userId }: KuCoinToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-600/10 to-teal-600/10 border-green-600/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/20">
              <span className="text-green-400 font-bold text-sm">K</span>
            </div>
            KuCoin Özel Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-16 w-16 mx-auto mb-4 text-green-400/30" />
            <p className="text-green-400/60 text-lg mb-2">KuCoin araçları geliştiriliyor</p>
            <p className="text-green-400/40 text-sm">
              • KuCoin Earn<br/>
              • Trading Bot<br/>
              • Futures Trading<br/>
              • Pool-X Staking
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}