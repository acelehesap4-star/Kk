import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, PieChart, BarChart2 } from 'lucide-react';

interface KuCoinToolsProps {
  symbol: string;
  userId: string;
}

export function KuCoinTools({ symbol, userId }: KuCoinToolsProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>KuCoin Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generic tools will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );


}
