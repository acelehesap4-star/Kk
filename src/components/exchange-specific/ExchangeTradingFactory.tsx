import { Exchange } from '@/types/trading';
import { BinanceTradingInterface } from './binance/BinanceTradingInterface';
import { OKXTradingInterface } from './okx/OKXTradingInterface';
import { CoinbaseTradingInterface } from './coinbase/CoinbaseTradingInterface';
import { GenericTradingInterface } from './generic/GenericTradingInterface';

interface ExchangeTradingFactoryProps {
  exchange: Exchange;
  symbol: string;
  userId: string;
}

export function ExchangeTradingFactory({ exchange, symbol, userId }: ExchangeTradingFactoryProps) {
  switch (exchange) {
    case 'BINANCE':
      return <BinanceTradingInterface symbol={symbol} userId={userId} />;
    case 'OKX':
      return <OKXTradingInterface symbol={symbol} userId={userId} />;
    case 'COINBASE':
      return <CoinbaseTradingInterface symbol={symbol} userId={userId} />;
    default:
      return <GenericTradingInterface exchange={exchange} symbol={symbol} userId={userId} />;
  }
}