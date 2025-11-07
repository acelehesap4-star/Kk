import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface KrakenToolsProps {
  symbol: string;
  userId: string;
}

export function KrakenTools({ symbol, userId }: KrakenToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border-purple-600/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20">
              <span className="text-purple-400 font-bold text-sm">K</span>
            </div>
            Kraken Pro Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-16 w-16 mx-auto mb-4 text-purple-400/30" />
            <p className="text-purple-400/60 text-lg mb-2">Kraken araçları geliştiriliyor</p>
            <p className="text-purple-400/40 text-sm">
              • Advanced Trading<br/>
              • Kraken Staking<br/>
              • Margin Trading<br/>
              • Futures Trading
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}