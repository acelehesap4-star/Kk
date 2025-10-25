import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Zap, Filter, BarChart3, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ScanResult {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  rsi: number;
  macd: number;
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  volatility: number;
  momentum: number;
}

export const MarketScanner = () => {
  const [filter, setFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('1h');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    scanMarket();
    const interval = setInterval(scanMarket, 10000);
    return () => clearInterval(interval);
  }, []);

  const scanMarket = () => {
    setIsScanning(true);
    
    const cryptos = ['APE', 'ARB', 'LINK', 'DOGE', 'MATIC', 'AVAX', 'UNI', 'ATOM', 'FIL', 'NEAR'];
    const results: ScanResult[] = cryptos.map(symbol => {
      const rsi = Math.random() * 100;
      const change = (Math.random() - 0.5) * 20;
      
      let signal: ScanResult['signal'] = 'neutral';
      if (rsi < 30 && change > 0) signal = 'strong_buy';
      else if (rsi < 40 && change > 0) signal = 'buy';
      else if (rsi > 70 && change < 0) signal = 'strong_sell';
      else if (rsi > 60 && change < 0) signal = 'sell';
      
      return {
        symbol: `${symbol}USDT`,
        price: Math.random() * 100 + 1,
        change24h: change,
        volume: Math.random() * 100000000 + 10000000,
        rsi: rsi,
        macd: (Math.random() - 0.5) * 10,
        signal,
        volatility: Math.random() * 5 + 1,
        momentum: (Math.random() - 0.5) * 100,
      };
    });

    setScanResults(results.sort((a, b) => {
      if (a.signal === 'strong_buy' && b.signal !== 'strong_buy') return -1;
      if (b.signal === 'strong_buy' && a.signal !== 'strong_buy') return 1;
      return Math.abs(b.change24h) - Math.abs(a.change24h);
    }));
    
    setTimeout(() => setIsScanning(false), 1000);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'text-success';
      case 'buy': return 'text-success/70';
      case 'neutral': return 'text-muted-foreground';
      case 'sell': return 'text-destructive/70';
      case 'strong_sell': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'strong_buy': return 'bg-success/20 border-success/30';
      case 'buy': return 'bg-success/10 border-success/20';
      case 'neutral': return 'bg-muted/30 border-border';
      case 'sell': return 'bg-destructive/10 border-destructive/20';
      case 'strong_sell': return 'bg-destructive/20 border-destructive/30';
      default: return 'bg-muted/30 border-border';
    }
  };

  const filteredResults = scanResults.filter(result => {
    if (filter === 'all') return true;
    if (filter === 'strong_buy') return result.signal === 'strong_buy';
    if (filter === 'buy') return result.signal === 'buy';
    if (filter === 'overbought') return result.rsi > 70;
    if (filter === 'oversold') return result.rsi < 30;
    return true;
  });

  return (
    <Tabs defaultValue="signals" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-chart-4" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Market Scanner</h3>
        </div>
        <div className="flex items-center gap-2">
          {isScanning && <Activity className="w-3 h-3 text-success animate-pulse" />}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={scanMarket}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className={cn("w-3 h-3", isScanning && "animate-spin")} />
          </Button>
        </div>
      </div>

      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signals">Signals</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
      </TabsList>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Signals ({scanResults.length})</SelectItem>
            <SelectItem value="strong_buy">Strong Buy ({scanResults.filter(r => r.signal === 'strong_buy').length})</SelectItem>
            <SelectItem value="buy">Buy ({scanResults.filter(r => r.signal === 'buy').length})</SelectItem>
            <SelectItem value="overbought">Overbought (RSI &gt; 70)</SelectItem>
            <SelectItem value="oversold">Oversold (RSI &lt; 30)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="h-9 w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5m">5m</SelectItem>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
            <SelectItem value="4h">4h</SelectItem>
            <SelectItem value="1d">1D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="signals" className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredResults.map((result) => (
          <div
            key={result.symbol}
            className={`p-3 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer group ${getSignalBg(result.signal)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {result.symbol.replace('USDT', '')}
                </span>
                {result.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
              </div>
              <Badge className={`text-[10px] font-semibold uppercase ${getSignalColor(result.signal)}`}>
                {result.signal.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="text-foreground font-medium">${result.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">24h</div>
                <div className={`font-bold ${result.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {result.change24h >= 0 ? '+' : ''}{result.change24h.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">RSI</div>
                <div className={`font-medium ${
                  result.rsi > 70 ? 'text-destructive' : result.rsi < 30 ? 'text-success' : 'text-foreground'
                }`}>
                  {result.rsi.toFixed(0)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Vol</div>
                <div className="text-foreground font-medium">
                  ${(result.volume / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Momentum indicator */}
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className={`w-3 h-3 ${result.momentum > 0 ? 'text-success' : 'text-destructive'}`} />
              <div className="flex-1 h-1 rounded-full bg-muted">
                <div 
                  className={`h-full rounded-full ${result.momentum > 0 ? 'bg-success' : 'bg-destructive'}`}
                  style={{ width: `${Math.min(100, Math.abs(result.momentum))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="technical" className="space-y-2">
        {filteredResults.slice(0, 5).map((result) => (
          <div
            key={result.symbol}
            className="p-3 rounded-lg border border-border bg-muted/30 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-foreground">
                {result.symbol.replace('USDT', '')}
              </span>
              <span className="text-xs text-muted-foreground">{timeframe}</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">RSI (14)</span>
                  <span className={`font-bold ${
                    result.rsi > 70 ? 'text-destructive' : 
                    result.rsi < 30 ? 'text-success' : 
                    'text-foreground'
                  }`}>
                    {result.rsi.toFixed(1)}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-muted">
                  <div 
                    className={`h-full rounded-full ${
                      result.rsi > 70 ? 'bg-destructive' : 
                      result.rsi < 30 ? 'bg-success' : 
                      'bg-primary'
                    }`}
                    style={{ width: `${result.rsi}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">MACD</span>
                  <span className={`font-bold ${result.macd >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {result.macd.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Volatility</span>
                  <span className="text-foreground font-medium">
                    {result.volatility.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};