import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface NASDAQToolsProps {
  symbol: string;
  userId: string;
}

export function NASDAQTools({ symbol, userId }: NASDAQToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-700/10 to-indigo-700/10 border-blue-700/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700/20">
              <span className="text-blue-400 font-bold text-sm">N</span>
            </div>
            NASDAQ Trading Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-blue-400/30" />
            <p className="text-blue-400/60 text-lg mb-2">NASDAQ araçları geliştiriliyor</p>
            <p className="text-blue-400/40 text-sm">
              • Stock Analysis<br/>
              • Options Trading<br/>
              • Market Research<br/>
              • Portfolio Management
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}