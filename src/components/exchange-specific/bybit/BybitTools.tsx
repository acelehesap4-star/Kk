import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BybitToolsProps {
  symbol: string;
  userId: string;
}

export function BybitTools({ symbol, userId }: BybitToolsProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Bybit Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generic tools will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );

}
