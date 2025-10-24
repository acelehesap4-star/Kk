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
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4 text-chart-4" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Place Order</h3>
      </div>

      <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
            <TrendingDown className="w-3 h-3 mr-1" />
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="space-y-3">
          {/* Order Type */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    Market
                  </div>
                </SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop_loss">Stop Loss</SelectItem>
                <SelectItem value="stop_limit">Stop Limit</SelectItem>
                <SelectItem value="trailing_stop">Trailing Stop</SelectItem>
                <SelectItem value="oco">OCO (One-Cancels-Other)</SelectItem>
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

          {/* Advanced Options */}
          <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3 h-3 text-chart-4" />
              <span className="text-xs font-medium text-foreground">Risk Management</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Stop Loss</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Take Profit</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">
                ${(parseFloat(price || '0') * parseFloat(quantity || '0')).toFixed(2)} USDT
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={placeOrder}
            className={`w-full h-10 font-semibold ${
              side === 'buy'
                ? 'bg-success hover:bg-success/90 text-white'
                : 'bg-destructive hover:bg-destructive/90 text-white'
            }`}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {orderType.toUpperCase()}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
