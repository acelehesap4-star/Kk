import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Candle } from '@/types/trading';
import { calcSMA, calcEMA, calcRSI, calcMACD, calcBollingerBands, calcFibonacciLevels } from '@/lib/indicators';
import { ApexOptions } from 'apexcharts';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartProps {
  candles: Candle[];
  showSMA: boolean;
  showEMA: boolean;
  showRSI: boolean;
  showMACD?: boolean;
  showBB?: boolean;
  showFib?: boolean;
  smaPeriod: number;
  emaPeriod: number;
  rsiPeriod: number;
  symbol: string;
}

export function Chart({
  candles,
  showSMA,
  showEMA,
  showRSI,
  showMACD = false,
  showBB = false,
  showFib = false,
  smaPeriod,
  emaPeriod,
  rsiPeriod,
  symbol,
}: ChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const closes = candles.map((c) => c.y[3]);
  const smaData = calcSMA(closes, smaPeriod);
  const emaData = calcEMA(closes, emaPeriod);
  const rsiData = calcRSI(closes, rsiPeriod);
  const macdData = calcMACD(closes);
  const bbData = calcBollingerBands(closes);
  const fibLevels = showFib ? calcFibonacciLevels(candles) : [];

  const candlestickSeries: any[] = [
    {
      name: 'Price',
      type: 'candlestick',
      data: candles,
    },
  ];

  if (showSMA) {
    candlestickSeries.push({
      name: `SMA(${smaPeriod})`,
      type: 'line',
      data: candles.map((c, i) => ({
        x: c.x,
        y: smaData[i],
      })),
    });
  }

  if (showEMA) {
    candlestickSeries.push({
      name: `EMA(${emaPeriod})`,
      type: 'line',
      data: candles.map((c, i) => ({
        x: c.x,
        y: emaData[i],
      })),
    });
  }

  if (showBB) {
    candlestickSeries.push(
      {
        name: 'BB Upper',
        type: 'line',
        data: candles.map((c, i) => ({ x: c.x, y: bbData.upper[i] })),
      },
      {
        name: 'BB Lower',
        type: 'line',
        data: candles.map((c, i) => ({ x: c.x, y: bbData.lower[i] })),
      }
    );
  }

  const fibAnnotations = showFib
    ? fibLevels.map((fib) => ({
        y: fib.price,
        borderColor: 'hsl(var(--primary))',
        strokeDashArray: 2,
        opacity: 0.4,
        label: {
          text: fib.label,
          style: {
            color: 'hsl(var(--primary-foreground))',
            background: 'hsl(var(--primary))',
            fontSize: '10px',
          },
        },
      }))
    : [];

  const candlestickOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: isFullscreen ? 600 : 360,
      background: 'transparent',
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: 'hsl(var(--success))',
          downward: 'hsl(var(--destructive))',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
        },
        formatter: (value) => value.toFixed(2),
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
    },
    legend: {
      show: true,
      position: 'top',
      labels: {
        colors: 'hsl(var(--foreground))',
      },
    },
    stroke: {
      width: [1, 2, 2, 2, 2],
    },
    colors: [
      'hsl(var(--primary))',
      '#f1c40f',
      'hsl(var(--chart-1))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
    ],
    annotations: {
      yaxis: fibAnnotations,
    },
  };

  const rsiSeries = [
    {
      name: 'RSI',
      data: candles.map((c, i) => ({
        x: c.x,
        y: rsiData[i],
      })),
    },
  ];

  const rsiOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 120,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false,
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    colors: ['hsl(var(--chart-2))'],
    xaxis: {
      type: 'datetime',
      labels: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: 'hsl(var(--muted-foreground))',
        },
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 70,
          borderColor: 'hsl(var(--destructive))',
          strokeDashArray: 4,
          label: {
            text: 'Overbought',
            style: {
              color: 'hsl(var(--destructive-foreground))',
              background: 'hsl(var(--destructive))',
            },
          },
        },
        {
          y: 30,
          borderColor: 'hsl(var(--success))',
          strokeDashArray: 4,
          label: {
            text: 'Oversold',
            style: {
              color: 'hsl(var(--success-foreground))',
              background: 'hsl(var(--success))',
            },
          },
        },
      ],
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
    },
  };

  const macdSeries = [
    {
      name: 'MACD',
      type: 'line',
      data: candles.map((c, i) => ({ x: c.x, y: macdData.macd[i] })),
    },
    {
      name: 'Signal',
      type: 'line',
      data: candles.map((c, i) => ({ x: c.x, y: macdData.signal[i] })),
    },
    {
      name: 'Histogram',
      type: 'bar',
      data: candles.map((c, i) => ({ x: c.x, y: macdData.histogram[i] })),
    },
  ];

  const macdOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 140,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false },
    },
    stroke: { width: [2, 2, 0], curve: 'smooth' },
    colors: ['hsl(var(--chart-1))', 'hsl(var(--chart-4))', 'hsl(var(--chart-2))'],
    xaxis: {
      type: 'datetime',
      labels: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: 'hsl(var(--muted-foreground))' },
      },
    },
    grid: {
      borderColor: 'hsl(var(--border))',
      strokeDashArray: 4,
    },
    legend: {
      show: true,
      position: 'top',
      labels: { colors: 'hsl(var(--foreground))' },
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM yyyy HH:mm' },
    },
  };

  if (!candles.length) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-lg border border-border bg-black/20">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card/80 to-card/60 p-6 shadow-2xl shadow-primary/10 backdrop-blur-2xl hover:shadow-3xl hover:shadow-primary/15 transition-all duration-500">
        {/* Ultra Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-2 ring-primary/40 shadow-lg shadow-primary/25">
                <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/60 animate-pulse" />
              </div>
              <div>
                <h3 className="font-mono text-lg font-black text-foreground tracking-tight flex items-center gap-2">
                  {symbol.toUpperCase()} <span className="text-primary/50 text-base">/</span> USDT
                  <div className="status-dot bg-success shadow-lg shadow-success/40" />
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-wider">Live Trading Chart</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-10 w-10 rounded-xl hover:bg-primary/15 hover:text-primary hover:ring-2 hover:ring-primary/30 transition-all duration-300"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="rounded-2xl overflow-hidden border-2 border-border/40 bg-background/30 shadow-inner shadow-black/20 backdrop-blur-sm">
            <ReactApexChart
              options={candlestickOptions}
              series={candlestickSeries}
              type="candlestick"
              height={isFullscreen ? 600 : 440}
            />
          </div>
        </div>
      </div>

      {showRSI && (
        <div className="relative overflow-hidden rounded-2xl border border-chart-2/25 bg-gradient-to-br from-card to-card/70 p-5 shadow-xl shadow-chart-2/10 backdrop-blur-xl animate-fade-in-up hover:shadow-2xl hover:shadow-chart-2/15 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-chart-2 to-transparent opacity-40" />
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-chart-2/8 rounded-full blur-3xl" />
          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-chart-2 animate-breathe shadow-lg shadow-chart-2/40" />
            <div className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              RSI Oscillator <span className="text-chart-2 font-mono">({rsiPeriod})</span>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-border/30 bg-background/20 shadow-inner shadow-black/15">
            <ReactApexChart options={rsiOptions} series={rsiSeries} type="line" height={140} />
          </div>
        </div>
      )}

      {showMACD && (
        <div className="relative overflow-hidden rounded-2xl border border-chart-1/25 bg-gradient-to-br from-card to-card/70 p-5 shadow-xl shadow-chart-1/10 backdrop-blur-xl animate-fade-in-up hover:shadow-2xl hover:shadow-chart-1/15 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-chart-1 to-transparent opacity-40" />
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-chart-1/8 rounded-full blur-3xl" />
          <div className="mb-4 flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-chart-1 animate-breathe shadow-lg shadow-chart-1/40" />
            <div className="text-xs font-black text-foreground uppercase tracking-wider">
              MACD Indicator
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border-2 border-border/30 bg-background/20 shadow-inner shadow-black/15">
            <ReactApexChart options={macdOptions} series={macdSeries} type="line" height={160} />
          </div>
        </div>
      )}
    </div>
  );
}
