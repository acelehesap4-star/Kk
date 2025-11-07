import { Exchange } from '@/types/trading';
import { DepthChartHeader } from './DepthChartHeader';
import { DepthChartLoader } from './DepthChartLoader';
import { DepthChartGraphWrapper } from './DepthChartGraphWrapper';
import { useDepthData } from './useDepthData';

interface DepthChartContainerProps {
  exchange: Exchange;
  symbol: string;
}

export function DepthChartContainer({ exchange, symbol }: DepthChartContainerProps) {
  const { loading, processedData } = useDepthData(exchange, symbol);

  if (loading || !processedData) {
    return <DepthChartLoader />;
  }

  return (
    <div className="relative glass-panel animate-fade-in rounded-xl p-5 border border-border/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="relative z-10">
        <DepthChartHeader />
        <DepthChartGraphWrapper 
          bidsDepth={processedData.bidsDepth} 
          asksDepth={processedData.asksDepth} 
        />
      </div>
    </div>
  );
}