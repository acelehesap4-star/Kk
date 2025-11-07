import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface OKXToolsProps {
  symbol: string;
  userId: string;
}

export function OKXTools({ symbol, userId }: OKXToolsProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>OKX Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generic tools will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );

}
