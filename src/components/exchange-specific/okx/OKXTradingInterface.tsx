import { GenericTradingInterface } from '../generic/GenericTradingInterface';

interface OKXTradingInterfaceProps {
  symbol: string;
  userId: string;
}

export function OKXTradingInterface({ symbol, userId }: OKXTradingInterfaceProps) {
  return (
    <GenericTradingInterface 
      exchange="OKX"
      symbol={symbol}
      userId={userId}
    />
  );
}