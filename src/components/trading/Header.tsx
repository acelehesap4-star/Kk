import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, LogIn, TrendingUp, Globe, DollarSign, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Exchange, DataSource } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

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

  const currentExchange = EXCHANGES[exchange];

  return (
    <header className="group relative overflow-hidden">
      {/* Main Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        {/* Left Side - Exchange Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-500/40">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-400">{currentExchange.name}</h2>
              <div className="flex items-center gap-2 text-xs text-cyan-400/60">
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  {currentExchange.type}
                </Badge>
                <span>•</span>
                <span>{currentExchange.region}</span>
              </div>
            </div>
          </div>

          {/* Exchange Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-cyan-400/80">
              <DollarSign className="h-3 w-3" />
              <span>Vol: {currentExchange.volume24h}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400/80">
              <TrendingUp className="h-3 w-3" />
              <span>{currentExchange.pairs} pairs</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400/80">
              <Users className="h-3 w-3" />
              <span>Fee: {currentExchange.fees}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Select value={exchange} onValueChange={(v) => onExchangeChange(v as Exchange)}>
              <SelectTrigger className="w-[160px] bg-black/40 border-cyan-500/20 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-500/20">
                {Object.keys(EXCHANGES).map((ex) => (
                  <SelectItem key={ex} value={ex} className="text-cyan-400 focus:bg-cyan-500/10">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400/80">
                        {EXCHANGES[ex as Exchange].type}
                      </Badge>
                      {EXCHANGES[ex as Exchange].name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={symbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="w-[120px] bg-black/40 border-cyan-500/20 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-500/20">
                {symbols.map((sym) => (
                  <SelectItem key={sym} value={sym} className="text-cyan-400 focus:bg-cyan-500/10">
                    {sym.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={source} onValueChange={(v) => onSourceChange(v as DataSource)}>
              <SelectTrigger className="w-[100px] bg-black/40 border-cyan-500/20 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-500/20">
                <SelectItem value="ws" className="text-cyan-400 focus:bg-cyan-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    WebSocket
                  </div>
                </SelectItem>
                <SelectItem value="rest" className="text-cyan-400 focus:bg-cyan-500/10">REST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={onRefresh} 
            size="sm" 
            variant="outline"
            className="bg-black/40 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/40"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {!user && (
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar - Mobile */}
      <div className="md:hidden border-t border-cyan-500/20 p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-cyan-400/80">
              <DollarSign className="h-3 w-3" />
              <span>{currentExchange.volume24h}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400/80">
              <TrendingUp className="h-3 w-3" />
              <span>{currentExchange.pairs} pairs</span>
            </div>
          </div>
          <div className="text-cyan-400/60">
            Fee: {currentExchange.fees}
          </div>
        </div>
      </div>
    </header>
  );
}
