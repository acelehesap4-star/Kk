import { calcSMA, calcEMA, calcRSI, calcMACD, calcBollingerBands } from './indicators';

export interface TechnicalIndicators {
  sma: (number | null)[];
  ema: (number | null)[];
  rsi: (number | null)[];
  macd: {
    macdLine: (number | null)[];
    signalLine: (number | null)[];
    histogram: (number | null)[];
  };
  bollingerBands: {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
  };
}

export class TechnicalAnalysis {
  constructor(private prices: number[]) {}

  calculateAll(): TechnicalIndicators {
    return {
      sma: this.calculateSMA(20),
      ema: this.calculateEMA(20),
      rsi: this.calculateRSI(14),
      macd: this.calculateMACD(),
      bollingerBands: this.calculateBollingerBands()
    };
  }

  private calculateSMA(period: number): (number | null)[] {
    return calcSMA(this.prices, period);
  }

  private calculateEMA(period: number): (number | null)[] {
    return calcEMA(this.prices, period);
  }

  private calculateRSI(period: number): (number | null)[] {
    return calcRSI(this.prices, period);
  }

  private calculateMACD(shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    return calcMACD(this.prices, shortPeriod, longPeriod, signalPeriod);
  }

  private calculateBollingerBands(period = 20, standardDeviations = 2) {
    return calcBollingerBands(this.prices, period, standardDeviations);
  }
}