import { useState } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const OrderPanel = () => {
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const placeOrder = () => {
    if (!price || !quantity) {
      toast.error('Please fill in price and quantity');
      return;
    }

    toast.success(`${side.toUpperCase()} order placed!`, {
      description: `${orderType.toUpperCase()}: ${quantity} @ $${price}`,
    });

    // Reset form
    setPrice('');
    setQuantity('');
    setStopLoss('');
    setTakeProfit('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-chart-4/15 ring-2 ring-chart-4/35 shadow-lg shadow-chart-4/20">
            <ShoppingCart className="w-5 h-5 text-chart-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">Order Execution</h3>
            <p className="text-[9px] text-muted-foreground font-mono">Elite Trading Interface</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-primary">ACTIVE</span>
        </div>
      </div>

      <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/40 backdrop-blur-2xl rounded-xl border border-border/40">
          <TabsTrigger 
            value="buy" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-success/30 data-[state=active]:to-success/20 data-[state=active]:text-success data-[state=active]:shadow-2xl data-[state=active]:shadow-success/30 data-[state=active]:ring-2 data-[state=active]:ring-success/40 font-black text-xs transition-all duration-300 rounded-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            BUY LONG
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-destructive/30 data-[state=active]:to-destructive/20 data-[state=active]:text-destructive data-[state=active]:shadow-2xl data-[state=active]:shadow-destructive/30 data-[state=active]:ring-2 data-[state=active]:ring-destructive/40 font-black text-xs transition-all duration-300 rounded-lg"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            SELL SHORT
          </TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="space-y-3">
          {/* Order Type */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="h-10 border-primary/20 bg-primary/5 hover:bg-primary/10 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">
                  <div className="flex items-center gap-2 font-semibold">
                    <Zap className="w-4 h-4 text-warning" />
                    <span>Market Order</span>
                  </div>
                </SelectItem>
                <SelectItem value="limit">
                  <div className="flex items-center gap-2">
                    <span>📊 Limit Order</span>
                  </div>
                </SelectItem>
                <SelectItem value="stop_loss">
                  <div className="flex items-center gap-2">
                    <span>🛡️ Stop Loss</span>
                  </div>
                </SelectItem>
                <SelectItem value="stop_limit">
                  <div className="flex items-center gap-2">
                    <span>🎯 Stop Limit</span>
                  </div>
                </SelectItem>
                <SelectItem value="trailing_stop">
                  <div className="flex items-center gap-2">
                    <span>📈 Trailing Stop</span>
                  </div>
                </SelectItem>
                <SelectItem value="oco">
                  <div className="flex items-center gap-2">
                    <span>🔄 OCO Order</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Input */}
          {orderType !== 'market' && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Price (USDT)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-9"
              />
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quantity</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-9"
            />
            <div className="flex gap-1">
              {[25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => setQuantity((1000 * (pct / 100)).toString())}
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Risk Management */}
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chart-4/20 ring-2 ring-chart-4/30">
                <Shield className="w-4 h-4 text-chart-4" />
              </div>
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Risk Management</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-destructive" />
                  Stop Loss
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="h-9 text-xs font-mono font-bold border-destructive/30 bg-destructive/5 focus:border-destructive focus:ring-destructive"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-success" />
                  Take Profit
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="h-9 text-xs font-mono font-bold border-success/30 bg-success/5 focus:border-success focus:ring-success"
                />
              </div>
            </div>

            {/* Risk/Reward Display */}
            {stopLoss && takeProfit && price && (
              <div className="metric-card p-2.5 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Risk/Reward</span>
                  <span className="font-mono font-bold text-primary">
                    1:{((parseFloat(takeProfit) - parseFloat(price)) / (parseFloat(price) - parseFloat(stopLoss))).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Total Display */}
          <div className="data-panel p-4 rounded-xl border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Total</span>
                <span className="text-[10px] font-mono text-muted-foreground">USDT</span>
              </div>
              <div className="font-mono text-2xl font-black text-primary glow-text">
                ${(parseFloat(price || '0') * parseFloat(quantity || '0')).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Ultra-Elite Execution Button */}
          <Button
            onClick={placeOrder}
            className={`relative w-full h-14 font-black text-base uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden rounded-xl ${
              side === 'buy'
                ? 'bg-gradient-to-r from-success via-success to-success/80 hover:from-success/90 hover:to-success/70 text-white shadow-2xl shadow-success/40 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] ring-2 ring-success/50'
                : 'bg-gradient-to-r from-destructive via-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white shadow-2xl shadow-destructive/40 hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] ring-2 ring-destructive/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="relative z-10 flex items-center justify-center gap-3">
              {side === 'buy' ? (
                <>
                  <TrendingUp className="w-6 h-6" />
                  <span>EXECUTE BUY {orderType.toUpperCase()}</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-6 h-6" />
                  <span>EXECUTE SELL {orderType.toUpperCase()}</span>
                </>
              )}
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
