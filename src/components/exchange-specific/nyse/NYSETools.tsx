import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface NYSEToolsProps {
  symbol: string;
  userId: string;
}

export function NYSETools({ symbol, userId }: NYSEToolsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-700/10 to-rose-700/10 border-red-700/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-700/20">
              <span className="text-red-400 font-bold text-sm">N</span>
            </div>
            NYSE Trading Araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-red-400/30" />
            <p className="text-red-400/60 text-lg mb-2">NYSE araçları geliştiriliyor</p>
            <p className="text-red-400/40 text-sm">
              • Blue Chip Analysis<br/>
              • Dividend Tracking<br/>
              • Sector Analysis<br/>
              • Risk Management
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}