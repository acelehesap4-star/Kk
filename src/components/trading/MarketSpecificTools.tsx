import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MarketSpecificToolsProps {
  marketType: string;
  onMarketChange?: (market: string) => void;
}

export const MarketSpecificTools: React.FC<MarketSpecificToolsProps> = ({
  marketType,
  onMarketChange
}) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Market Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Market-specific tools will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};