import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BinanceToolsProps {
  symbol: string;
  userId: string;
}

export function BinanceTools({ symbol, userId }: BinanceToolsProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Binance Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generic tools will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );

}
