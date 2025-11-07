import { GenericTradingInterface } from '../generic/GenericTradingInterface';

interface CoinbaseTradingInterfaceProps {
  symbol: string;
  userId: string;
}

export function CoinbaseTradingInterface({ symbol, userId }: CoinbaseTradingInterfaceProps) {
  return (
    <GenericTradingInterface 
      exchange="COINBASE"
      symbol={symbol}
      userId={userId}
    />
  );
}