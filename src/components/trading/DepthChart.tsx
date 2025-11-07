import { Exchange } from '@/types/trading';
import dynamic from 'next/dynamic';

const DepthChartContainer = dynamic(
  () => import('./depth').then((mod) => mod.DepthChartContainer),
  { ssr: false }
);

interface DepthChartProps {
  exchange: Exchange;
  symbol: string;
}

export function DepthChart({ exchange, symbol }: DepthChartProps) {
  return <DepthChartContainer exchange={exchange} symbol={symbol} />;
}
