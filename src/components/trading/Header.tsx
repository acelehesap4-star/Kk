import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Exchange, DataSource } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface HeaderProps {
  exchange: Exchange;
  symbol: string;
  source: DataSource;
  symbols: string[];
  onExchangeChange: (exchange: Exchange) => void;
  onSymbolChange: (symbol: string) => void;
  onSourceChange: (source: DataSource) => void;
  onRefresh: () => void;
}

export function Header({
  exchange,
  symbol,
  source,
  symbols,
  onExchangeChange,
  onSymbolChange,
  onSourceChange,
  onRefresh,
}: HeaderProps) {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="group relative flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-card via-card/80 to-card/60 p-6 shadow-2xl shadow-primary/20 backdrop-blur-2xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_60px_rgba(56,189,248,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-accent/8 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-2xl shadow-primary/30 ring-2 ring-primary/30 backdrop-blur-xl">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary via-primary to-primary/60 animate-pulse shadow-lg shadow-primary/50" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-3xl font-black tracking-tighter text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              KK TRADING
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Multi-Exchange Trading Platform
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Exchange:</label>
          <Select value={exchange} onValueChange={(v) => onExchangeChange(v as Exchange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(EXCHANGES).map((ex) => (
                <SelectItem key={ex} value={ex}>
                  {EXCHANGES[ex as Exchange].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Symbol:</label>
          <Select value={symbol} onValueChange={onSymbolChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {symbols.map((sym) => (
                <SelectItem key={sym} value={sym}>
                  {sym.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Source:</label>
          <Select value={source} onValueChange={(v) => onSourceChange(v as DataSource)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ws">WebSocket</SelectItem>
              <SelectItem value="rest">REST</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onRefresh} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>

        {!user && (
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-to-r from-primary to-chart-2">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
