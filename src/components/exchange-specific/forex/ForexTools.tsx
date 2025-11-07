import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface ForexToolsProps {
  symbol: string;
  userId: string;
}

export function ForexTools({ symbol, userId }: ForexToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-700/10 to-teal-700/10 border-emerald-700/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/20">
              <span className="text-emerald-400 font-bold text-sm">F</span>
            </div>
            Forex Trading Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-emerald-400/30" />
            <p className="text-emerald-400/60 text-lg mb-2">Forex araçları geliştiriliyor</p>
            <p className="text-emerald-400/40 text-sm">
              • Currency Analysis<br/>
              • Economic Calendar<br/>
              • Carry Trade Calculator<br/>
              • Central Bank Tracker
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}