import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { IndicatorSettings } from '@/types/trading';

interface IndicatorControlsProps {
  settings: IndicatorSettings;
  onApply: (settings: IndicatorSettings) => void;
}

export function IndicatorControls({ settings, onApply }: IndicatorControlsProps) {
  const [localSettings, setLocalSettings] = useState<IndicatorSettings>({
    ...settings,
    showMACD: settings.showMACD ?? false,
    showBB: settings.showBB ?? false,
    showFib: settings.showFib ?? false,
    showPatterns: settings.showPatterns ?? true,
  });

  const handleApply = () => {
    onApply(localSettings);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card/30 p-4">
      <h4 className="text-sm font-semibold text-foreground">Technical Indicators</h4>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showSMA"
            checked={localSettings.showSMA}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, showSMA: !!checked })
            }
          />
          <Label htmlFor="showSMA" className="text-sm">
            SMA
          </Label>
          <Input
            type="number"
            min={2}
            max={200}
            value={localSettings.smaPeriod}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, smaPeriod: parseInt(e.target.value) || 20 })
            }
            className="w-20"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showEMA"
            checked={localSettings.showEMA}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, showEMA: !!checked })
            }
          />
          <Label htmlFor="showEMA" className="text-sm">
            EMA
          </Label>
          <Input
            type="number"
            min={2}
            max={200}
            value={localSettings.emaPeriod}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, emaPeriod: parseInt(e.target.value) || 20 })
            }
            className="w-20"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showRSI"
            checked={localSettings.showRSI}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, showRSI: !!checked })
            }
          />
          <Label htmlFor="showRSI" className="text-sm">
            RSI
          </Label>
          <Input
            type="number"
            min={2}
            max={100}
            value={localSettings.rsiPeriod}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, rsiPeriod: parseInt(e.target.value) || 14 })
            }
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-border/50 pt-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="macd" className="text-xs">MACD</Label>
          <Switch
            id="macd"
            checked={localSettings.showMACD}
            onCheckedChange={(checked) => 
              setLocalSettings({ ...localSettings, showMACD: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bb" className="text-xs">Bollinger Bands</Label>
          <Switch
            id="bb"
            checked={localSettings.showBB}
            onCheckedChange={(checked) => 
              setLocalSettings({ ...localSettings, showBB: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="fib" className="text-xs">Fibonacci</Label>
          <Switch
            id="fib"
            checked={localSettings.showFib}
            onCheckedChange={(checked) => 
              setLocalSettings({ ...localSettings, showFib: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="patterns" className="text-xs">Patterns</Label>
          <Switch
            id="patterns"
            checked={localSettings.showPatterns}
            onCheckedChange={(checked) => 
              setLocalSettings({ ...localSettings, showPatterns: checked })
            }
          />
        </div>
      </div>

      <Button onClick={handleApply} className="w-full" size="sm">
        Apply Indicators
      </Button>
    </div>
  );
}
