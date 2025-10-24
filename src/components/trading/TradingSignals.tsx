import { TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Candle } from '@/types/trading';
import { calcRSI, calcMACD } from '@/lib/indicators';

interface TradingSignalsProps {
  candles: Candle[];
  symbol: string;
}

export function TradingSignals({ candles, symbol }: TradingSignalsProps) {
  if (candles.length < 50) {
    return (
      <div className="glass-panel animate-fade-in rounded-xl p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <Zap className="h-4 w-4 text-primary" />
          Trading Signals
        </h4>
        <div className="text-center text-sm text-muted-foreground">
          Loading signals...
        </div>
      </div>
    );
  }

  const closes = candles.map(c => c.y[3]);
  const rsi = calcRSI(closes, 14);
  const macd = calcMACD(closes);
  
  const currentRSI = rsi[rsi.length - 1];
  const currentMACD = macd.macd[macd.macd.length - 1];
  const currentSignal = macd.signal[macd.signal.length - 1];
  const currentPrice = closes[closes.length - 1];
  const prevPrice = closes[closes.length - 2];

  const signals = [];

  // RSI Signals
  if (currentRSI !== null) {
    if (currentRSI < 30) {
      signals.push({
        type: 'BUY',
        indicator: 'RSI',
        message: 'Oversold condition',
        strength: 'STRONG',
        value: currentRSI.toFixed(2),
      });
    } else if (currentRSI > 70) {
      signals.push({
        type: 'SELL',
        indicator: 'RSI',
        message: 'Overbought condition',
        strength: 'STRONG',
        value: currentRSI.toFixed(2),
      });
    } else if (currentRSI < 40) {
      signals.push({
        type: 'BUY',
        indicator: 'RSI',
        message: 'Approaching oversold',
        strength: 'MODERATE',
        value: currentRSI.toFixed(2),
      });
    } else if (currentRSI > 60) {
      signals.push({
        type: 'SELL',
        indicator: 'RSI',
        message: 'Approaching overbought',
        strength: 'MODERATE',
        value: currentRSI.toFixed(2),
      });
    }
  }

  // MACD Signals
  if (currentMACD !== null && currentSignal !== null) {
    const prevMACD = macd.macd[macd.macd.length - 2];
    const prevSignal = macd.signal[macd.signal.length - 2];
    
    if (prevMACD !== null && prevSignal !== null) {
      // Bullish crossover
      if (prevMACD < prevSignal && currentMACD > currentSignal) {
        signals.push({
          type: 'BUY',
          indicator: 'MACD',
          message: 'Bullish crossover',
          strength: 'STRONG',
          value: 'Cross Up',
        });
      }
      // Bearish crossover
      if (prevMACD > prevSignal && currentMACD < currentSignal) {
        signals.push({
          type: 'SELL',
          indicator: 'MACD',
          message: 'Bearish crossover',
          strength: 'STRONG',
          value: 'Cross Down',
        });
      }
    }
  }

  // Trend Signals
  const trend = currentPrice > prevPrice ? 'UP' : 'DOWN';
  const momentum = Math.abs(((currentPrice - prevPrice) / prevPrice) * 100);
  
  if (momentum > 0.5) {
    signals.push({
      type: trend === 'UP' ? 'BUY' : 'SELL',
      indicator: 'MOMENTUM',
      message: `Strong ${trend.toLowerCase()}ward movement`,
      strength: momentum > 1 ? 'STRONG' : 'MODERATE',
      value: `${momentum.toFixed(2)}%`,
    });
  }

  return (
    <div className="glass-panel animate-fade-in rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Zap className="h-4 w-4 animate-pulse text-primary" />
          Trading Signals
        </h4>
        <span className="text-xs text-muted-foreground">{signals.length} Active</span>
      </div>

      <div className="space-y-2">
        {signals.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/20 p-3 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            <span>No strong signals at the moment</span>
          </div>
        ) : (
          signals.map((signal, idx) => {
            const isBuy = signal.type === 'BUY';
            const isStrong = signal.strength === 'STRONG';
            
            return (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-lg border p-3 transition-all duration-300 hover:scale-[1.02] ${
                  isBuy
                    ? 'border-success/30 bg-success/5 hover:border-success/50'
                    : 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity group-hover:opacity-5" />
                
                <div className="relative z-10 flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${
                    isBuy ? 'bg-success/20' : 'bg-destructive/20'
                  }`}>
                    {isBuy ? (
                      <TrendingUp className={`h-4 w-4 ${
                        isStrong ? 'text-success' : 'text-success/70'
                      }`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${
                        isStrong ? 'text-destructive' : 'text-destructive/70'
                      }`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${
                        isBuy ? 'text-success' : 'text-destructive'
                      }`}>
                        {signal.type}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-semibold text-foreground">
                        {signal.indicator}
                      </span>
                      {isStrong && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-primary">
                            <AlertTriangle className="h-3 w-3" />
                            STRONG
                          </span>
                        </>
                      )}
                    </div>
                    
                    <p className="mt-1 text-xs text-muted-foreground">
                      {signal.message}
                    </p>
                    
                    <div className="mt-2 font-mono text-xs font-semibold text-foreground">
                      {signal.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border/50 bg-black/10 p-3">
        <div className="text-xs font-semibold text-muted-foreground">Market Summary</div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">RSI:</span>
            <span className={`ml-2 font-mono font-bold ${
              currentRSI && currentRSI < 30 ? 'text-success' :
              currentRSI && currentRSI > 70 ? 'text-destructive' :
              'text-foreground'
            }`}>
              {currentRSI?.toFixed(2) || '—'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Trend:</span>
            <span className={`ml-2 font-bold ${
              trend === 'UP' ? 'text-success' : 'text-destructive'
            }`}>
              {trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
