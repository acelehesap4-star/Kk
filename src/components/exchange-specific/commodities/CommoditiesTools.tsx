import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface CommoditiesToolsProps {
  symbol: string;
  userId: string;
}

export function CommoditiesTools({ symbol, userId }: CommoditiesToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-amber-700/10 to-yellow-700/10 border-amber-700/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-amber-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-700/20">
              <span className="text-amber-400 font-bold text-sm">C</span>
            </div>
            Emtia Trading Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Coins className="h-16 w-16 mx-auto mb-4 text-amber-400/30" />
            <p className="text-amber-400/60 text-lg mb-2">Emtia araçları geliştiriliyor</p>
            <p className="text-amber-400/40 text-sm">
              • Gold/Silver Analysis<br/>
              • Oil Price Tracker<br/>
              • Agricultural Futures<br/>
              • Supply/Demand Analysis
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}