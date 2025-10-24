export function calcSMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) result.push(sum / period);
    else result.push(null);
  }

  return result;
}

export function calcEMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let ema = values[0] || 0;

  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      ema = values[i];
      result.push(ema);
      continue;
    }
    ema = values[i] * k + ema * (1 - k);
    result.push(ema);
  }

  return result;
}

export function calcRSI(values: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = values[i] - values[i - 1];
    const gain = Math.max(0, change);
    const loss = Math.max(0, -change);

    if (i <= period) {
      gains += gain;
      losses += loss;

      if (i < period) {
        result.push(null);
        continue;
      }

      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    } else {
      gains = (gains * (period - 1) + gain) / period;
      losses = (losses * (period - 1) + loss) / period;
      const rs = losses === 0 ? 100 : gains / losses;
      result.push(100 - 100 / (1 + rs));
    }
  }

  return result;
}

export function calcMACD(
  data: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const fastEMA = calcEMA(data, fastPeriod);
  const slowEMA = calcEMA(data, slowPeriod);
  
  const macd = fastEMA.map((fast, i) => {
    const slow = slowEMA[i];
    if (fast === null || slow === null) return null;
    return fast - slow;
  });
  
  const macdValues = macd.filter((v): v is number => v !== null);
  const signalEMA = calcEMA(macdValues, signalPeriod);
  
  const signal: (number | null)[] = [];
  let signalIndex = 0;
  
  for (let i = 0; i < macd.length; i++) {
    if (macd[i] === null) {
      signal.push(null);
    } else {
      signal.push(signalEMA[signalIndex] ?? null);
      signalIndex++;
    }
  }
  
  const histogram = macd.map((m, i) => {
    const sig = signal[i];
    if (m === null || sig === null) return null;
    return m - sig;
  });
  
  return { macd, signal, histogram };
}

export function calcBollingerBands(
  data: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const middle = calcSMA(data, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const mean = middle[i]!;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      upper.push(mean + stdDev * std);
      lower.push(mean - stdDev * std);
    }
  }
  
  return { upper, middle, lower };
}

export function calcATR(
  candles: { y: [number, number, number, number] }[],
  period: number = 14
): (number | null)[] {
  const result: (number | null)[] = [null];
  const trueRanges: number[] = [];
  
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].y[1];
    const low = candles[i].y[2];
    const prevClose = candles[i - 1].y[3];
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
    
    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const atr = trueRanges.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;
      result.push(atr);
    } else {
      const prevATR = result[i - 1]!;
      const atr = (prevATR * (period - 1) + tr) / period;
      result.push(atr);
    }
  }
  
  return result;
}

export function calcFibonacciLevels(
  candles: { y: [number, number, number, number] }[],
  lookback: number = 100
): { level: number; price: number; label: string }[] {
  if (candles.length < lookback) lookback = candles.length;
  
  const recentCandles = candles.slice(-lookback);
  const high = Math.max(...recentCandles.map(c => c.y[1]));
  const low = Math.min(...recentCandles.map(c => c.y[2]));
  const diff = high - low;
  
  const levels = [
    { level: 0, label: '0.0%' },
    { level: 0.236, label: '23.6%' },
    { level: 0.382, label: '38.2%' },
    { level: 0.5, label: '50.0%' },
    { level: 0.618, label: '61.8%' },
    { level: 0.786, label: '78.6%' },
    { level: 1, label: '100.0%' },
  ];
  
  return levels.map(({ level, label }) => ({
    level,
    price: high - diff * level,
    label,
  }));
}

export function detectCandlestickPatterns(
  candles: { x: number; y: [number, number, number, number] }[]
): { type: string; name: string; timestamp: number; signal: 'bullish' | 'bearish' | 'neutral'; strength: number }[] {
  const patterns: any[] = [];
  
  for (let i = 2; i < candles.length; i++) {
    const current = candles[i].y;
    const prev = candles[i - 1].y;
    const prev2 = candles[i - 2].y;
    
    const [open, high, low, close] = current;
    const body = Math.abs(close - open);
    const range = high - low;
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;
    
    // Doji
    if (body < range * 0.1) {
      patterns.push({
        type: 'doji',
        name: 'Doji',
        timestamp: candles[i].x,
        signal: 'neutral',
        strength: 0.6,
      });
    }
    
    // Hammer (bullish)
    if (close > open && lowerWick > body * 2 && upperWick < body * 0.3) {
      patterns.push({
        type: 'hammer',
        name: 'Hammer',
        timestamp: candles[i].x,
        signal: 'bullish',
        strength: 0.8,
      });
    }
    
    // Shooting Star (bearish)
    if (open > close && upperWick > body * 2 && lowerWick < body * 0.3) {
      patterns.push({
        type: 'shooting_star',
        name: 'Shooting Star',
        timestamp: candles[i].x,
        signal: 'bearish',
        strength: 0.8,
      });
    }
    
    // Engulfing patterns
    const prevBody = Math.abs(prev[3] - prev[0]);
    if (body > prevBody * 1.2) {
      // Bullish Engulfing
      if (close > open && prev[3] < prev[0] && close > prev[0] && open < prev[3]) {
        patterns.push({
          type: 'bullish_engulfing',
          name: 'Bullish Engulfing',
          timestamp: candles[i].x,
          signal: 'bullish',
          strength: 0.9,
        });
      }
      // Bearish Engulfing
      if (open > close && prev[3] > prev[0] && close < prev[0] && open > prev[3]) {
        patterns.push({
          type: 'bearish_engulfing',
          name: 'Bearish Engulfing',
          timestamp: candles[i].x,
          signal: 'bearish',
          strength: 0.9,
        });
      }
    }
    
    // Morning Star (bullish reversal)
    if (
      prev2[0] > prev2[3] && // First candle bearish
      Math.abs(prev[3] - prev[0]) < prevBody * 0.3 && // Second candle small
      current[3] > current[0] && // Third candle bullish
      current[3] > (prev2[0] + prev2[3]) / 2 // Closes above midpoint
    ) {
      patterns.push({
        type: 'morning_star',
        name: 'Morning Star',
        timestamp: candles[i].x,
        signal: 'bullish',
        strength: 0.95,
      });
    }
    
    // Evening Star (bearish reversal)
    if (
      prev2[3] > prev2[0] && // First candle bullish
      Math.abs(prev[3] - prev[0]) < prevBody * 0.3 && // Second candle small
      current[0] > current[3] && // Third candle bearish
      current[3] < (prev2[0] + prev2[3]) / 2 // Closes below midpoint
    ) {
      patterns.push({
        type: 'evening_star',
        name: 'Evening Star',
        timestamp: candles[i].x,
        signal: 'bearish',
        strength: 0.95,
      });
    }
  }
  
  return patterns;
}
