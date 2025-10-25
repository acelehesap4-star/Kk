import { useState } from 'react';
import { Shield, Calculator, TrendingUp, AlertTriangle, Target, DollarSign, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export const RiskCalculator = () => {
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [capital, setCapital] = useState('');
  const [risk, setRisk] = useState('2');

  const calculate = () => {
    const e = parseFloat(entry);
    const sl = parseFloat(stopLoss);
    const t = parseFloat(target);
    const c = parseFloat(capital);
    const r = parseFloat(risk);

    if (!e || !sl || !t || !c || !r) return null;

    const riskAmount = (c * r) / 100;
    const stopLossDistance = Math.abs(e - sl);
    const targetDistance = Math.abs(t - e);
    const riskReward = targetDistance / stopLossDistance;
    const positionSize = riskAmount / stopLossDistance;
    const potentialProfit = positionSize * targetDistance;
    const potentialLoss = riskAmount;
    
    // Kelly Criterion: f = (bp - q) / b where b=odds, p=win%, q=loss%
    const winProbability = 0.6; // Assumed 60% win rate
    const kellyPercent = ((riskReward * winProbability - (1 - winProbability)) / riskReward) * 100;
    
    // Position Value
    const positionValue = positionSize * e;
    const leverage = positionValue / c;
    
    // Risk Score (0-100)
    const riskScore = Math.min(100, (r * 10) + (leverage * 5) + (riskReward < 2 ? 20 : 0));

    return {
      riskReward: riskReward.toFixed(2),
      positionSize: positionSize.toFixed(4),
      potentialProfit: potentialProfit.toFixed(2),
      potentialLoss: potentialLoss.toFixed(2),
      breakeven: e.toFixed(2),
      kellyPercent: Math.max(0, kellyPercent).toFixed(2),
      positionValue: positionValue.toFixed(2),
      leverage: leverage.toFixed(2),
      riskScore: Math.round(riskScore),
      stopLossPercent: ((stopLossDistance / e) * 100).toFixed(2),
      targetPercent: ((targetDistance / e) * 100).toFixed(2),
    };
  };

  const result = calculate();

  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-chart-4" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Advanced Risk Calculator</h3>
        </div>
        <Calculator className="w-4 h-4 text-chart-4" />
      </div>

      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-3">
        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-muted/30 to-transparent border border-border">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Entry Price</Label>
            <Input
              type="number"
              placeholder="50000"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Stop Loss</Label>
              <Input
                type="number"
                placeholder="48000"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Target</Label>
              <Input
                type="number"
                placeholder="55000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Capital ($)</Label>
              <Input
                type="number"
                placeholder="10000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Risk (%)</Label>
              <Input
                type="number"
                placeholder="2"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-2 animate-fade-in">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Risk/Reward Ratio</span>
                <Calculator className="w-3 h-3 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">1:{result.riskReward}</div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {parseFloat(result.riskReward) >= 2 ? '✓ Excellent ratio' : parseFloat(result.riskReward) >= 1.5 ? '✓ Good ratio' : '⚠ Poor ratio'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-[10px] text-muted-foreground uppercase">Potential Profit</span>
                </div>
                <div className="text-lg font-bold text-success">${result.potentialProfit}</div>
                <div className="text-[10px] text-success mt-1">+{result.targetPercent}%</div>
              </div>

              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  <span className="text-[10px] text-muted-foreground uppercase">Potential Loss</span>
                </div>
                <div className="text-lg font-bold text-destructive">${result.potentialLoss}</div>
                <div className="text-[10px] text-destructive mt-1">-{result.stopLossPercent}%</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Position Size</span>
                <span className="text-foreground font-medium">{result.positionSize} units</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Position Value</span>
                <span className="text-foreground font-bold">${result.positionValue}</span>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="advanced" className="space-y-3">
        {result && (
          <>
            {/* Risk Score */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-destructive/10 to-chart-4/10 border border-destructive/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-xs text-muted-foreground uppercase">Risk Score</span>
                </div>
                <span className={`text-sm font-bold ${
                  result.riskScore < 30 ? 'text-success' :
                  result.riskScore < 60 ? 'text-chart-4' :
                  'text-destructive'
                }`}>
                  {result.riskScore}/100
                </span>
              </div>
              <Progress value={result.riskScore} className="h-2 mb-2" />
              <div className="text-[10px] text-muted-foreground">
                {result.riskScore < 30 ? 'Low risk - Safe trade setup' :
                 result.riskScore < 60 ? 'Medium risk - Acceptable with caution' :
                 'High risk - Consider reducing position size'}
              </div>
            </div>

            {/* Kelly Criterion */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Kelly Criterion</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {result.kellyPercent}%
              </div>
              <div className="text-[10px] text-muted-foreground">
                Optimal position size based on risk/reward and win probability
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-chart-2" />
                  <span className="text-[10px] text-muted-foreground uppercase">Leverage</span>
                </div>
                <div className="text-xl font-bold text-chart-2">{result.leverage}x</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {parseFloat(result.leverage) < 2 ? 'Conservative' : parseFloat(result.leverage) < 5 ? 'Moderate' : 'Aggressive'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-1 mb-1">
                  <Percent className="w-3 h-3 text-chart-3" />
                  <span className="text-[10px] text-muted-foreground uppercase">Capital Risk</span>
                </div>
                <div className="text-xl font-bold text-chart-3">{risk}%</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  ${(parseFloat(capital || '0') * parseFloat(risk || '0') / 100).toFixed(2)} at risk
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
              <div className="text-xs font-semibold text-foreground mb-2">Recommendations</div>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                <div>• Position Size: {result.positionSize} units (~${result.positionValue})</div>
                <div>• Stop Loss: {result.stopLossPercent}% from entry</div>
                <div>• Take Profit: {result.targetPercent}% from entry</div>
                <div>• Kelly Optimal: {result.kellyPercent}% of capital</div>
              </div>
            </div>
          </>
        )}
        
        {!result && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Enter trade parameters to see advanced risk analysis
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
