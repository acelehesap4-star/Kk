import { Exchange } from '@/types/trading';
import { BinanceTools } from './binance/BinanceTools';
import { OKXTools } from './okx/OKXTools';
import { CoinbaseTools } from './coinbase/CoinbaseTools';
import { BybitTools } from './bybit/BybitTools';
import { KrakenTools } from './kraken/KrakenTools';
import { KuCoinTools } from './kucoin/KuCoinTools';
import { NASDAQTools } from './nasdaq/NASDAQTools';
import { NYSETools } from './nyse/NYSETools';
import { ForexTools } from './forex/ForexTools';
import { CommoditiesTools } from './commodities/CommoditiesTools';

interface ExchangeToolsFactoryProps {
  exchange: Exchange;
  symbol: string;
  userId: string;
}

export function ExchangeToolsFactory({ exchange, symbol, userId }: ExchangeToolsFactoryProps) {
  switch (exchange) {
    case 'BINANCE':
      return <BinanceTools symbol={symbol} userId={userId} />;
    case 'OKX':
      return <OKXTools symbol={symbol} userId={userId} />;
    case 'COINBASE':
      return <CoinbaseTools symbol={symbol} userId={userId} />;
    case 'BYBIT':
      return <BybitTools symbol={symbol} userId={userId} />;
    case 'KRAKEN':
      return <KrakenTools symbol={symbol} userId={userId} />;
    case 'KUCOIN':
      return <KuCoinTools symbol={symbol} userId={userId} />;
    case 'NASDAQ':
      return <NASDAQTools symbol={symbol} userId={userId} />;
    case 'NYSE':
      return <NYSETools symbol={symbol} userId={userId} />;
    case 'FOREX':
      return <ForexTools symbol={symbol} userId={userId} />;
    case 'COMMODITIES':
      return <CommoditiesTools symbol={symbol} userId={userId} />;
    default:
      return (
        <div className="text-center py-8">
          <p className="text-red-400">Bu borsa için özel araçlar henüz mevcut değil</p>
          <p className="text-red-400/60 text-sm mt-1">Exchange: {exchange}</p>
        </div>
      );
  }
}