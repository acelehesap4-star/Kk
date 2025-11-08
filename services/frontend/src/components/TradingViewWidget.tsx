import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  symbol: string;
  market: string;
}

export default function TradingViewWidget({ symbol, market }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          container_id: container.current.id,
          symbol: getSymbolForTradingView(symbol, market),
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'tr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          width: '100%',
          height: '100%'
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol, market]);

  function getSymbolForTradingView(symbol: string, market: string): string {
    switch (market) {
      case 'CRYPTO':
        return `BINANCE:${symbol.replace('/', '')}`;
      case 'FOREX':
        return `FX:${symbol}`;
      case 'STOCKS':
        return `NYSE:${symbol}`;
      default:
        return symbol;
    }
  }

  return (
    <Box
      ref={container}
      id="tradingview_widget"
      h="100%"
      w="100%"
      bg="gray.800"
      borderRadius="lg"
      overflow="hidden"
    />
  );
}