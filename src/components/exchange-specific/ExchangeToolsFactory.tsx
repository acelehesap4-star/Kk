import { Exchange } from '@/types/trading';
import { BinanceTools } from './binance/BinanceTools';
import { OKXTools } from './okx/OKXTools';
import { BybitTools } from './bybit/BybitTools';
import { KuCoinTools } from './kucoin/KuCoinTools';

interface ExchangeToolsFactoryProps {
  exchange: Exchange;
  symbol: string;
  userId: string;
  onError?: (error: Error) => void;
}

export function ExchangeToolsFactory({ exchange, symbol, userId, onError }: ExchangeToolsFactoryProps) {
  try {
    switch (exchange) {
      case 'BINANCE':
        return <BinanceTools symbol={symbol} userId={userId} />;
      case 'OKX':
        return <OKXTools symbol={symbol} userId={userId} />;
      case 'BYBIT':
        return <BybitTools symbol={symbol} userId={userId} />;
      case 'KUCOIN':
        return <KuCoinTools symbol={symbol} userId={userId} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-red-400">Bu borsa için özel araçlar henüz mevcut değil</p>
            <p className="text-red-400/60 text-sm mt-1">Exchange: {exchange}</p>
          </div>
        );
    }
  } catch (error) {
    onError?.(error as Error);
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Borsa araçları yüklenirken bir hata oluştu</p>
        <p className="text-red-400/60 text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }
  }
}