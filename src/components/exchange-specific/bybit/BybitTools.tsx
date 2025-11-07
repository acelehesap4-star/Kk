import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Shield, Wallet } from 'lucide-react';

interface BybitToolsProps {
  symbol: string;
  userId: string;
}

export function BybitTools({ symbol, userId }: BybitToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border-yellow-600/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-600/20">
              <span className="text-yellow-400 font-bold text-sm">B</span>
            </div>
            Bybit Özel Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-16 w-16 mx-auto mb-4 text-yellow-400/30" />
            <p className="text-yellow-400/60 text-lg mb-2">Bybit araçları geliştiriliyor</p>
            <p className="text-yellow-400/40 text-sm">
              • Derivatives Trading<br/>
              • Copy Trading<br/>
              • Bybit Wallet Integration<br/>
              • Launchpool Programs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}