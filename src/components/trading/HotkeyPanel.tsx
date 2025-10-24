import { useState } from 'react';
import { Keyboard, Zap, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Hotkey {
  key: string;
  description: string;
  category: 'trading' | 'navigation' | 'chart';
}

export const HotkeyPanel = () => {
  const [hotkeys] = useState<Hotkey[]>([
    { key: 'B', description: 'Quick Buy Order', category: 'trading' },
    { key: 'S', description: 'Quick Sell Order', category: 'trading' },
    { key: 'Esc', description: 'Cancel All Orders', category: 'trading' },
    { key: 'Space', description: 'Toggle Chart Type', category: 'chart' },
    { key: '1-7', description: 'Switch Timeframes', category: 'chart' },
    { key: 'I', description: 'Toggle Indicators', category: 'chart' },
    { key: 'H', description: 'Toggle Heatmap', category: 'navigation' },
    { key: 'P', description: 'Open Portfolio', category: 'navigation' },
    { key: 'W', description: 'Open Watchlist', category: 'navigation' },
    { key: 'T', description: 'Toggle Terminal', category: 'navigation' },
    { key: '/', description: 'Search Symbols', category: 'navigation' },
    { key: 'F', description: 'Fullscreen Chart', category: 'chart' },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading': return 'text-success';
      case 'chart': return 'text-chart-4';
      case 'navigation': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const categories = Array.from(new Set(hotkeys.map(h => h.category)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-chart-4" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Keyboard Shortcuts</h3>
        </div>
        <Zap className="w-4 h-4 text-chart-4 animate-pulse" />
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <div className={`text-xs font-semibold uppercase tracking-wide ${getCategoryColor(category)}`}>
            {category}
          </div>
          <div className="space-y-1">
            {hotkeys
              .filter(h => h.category === category)
              .map((hotkey, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <span className="text-xs text-muted-foreground">{hotkey.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded">
                    {hotkey.key}
                  </kbd>
                </div>
              ))}
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full gap-2">
        <Command className="w-3 h-3" />
        Customize Hotkeys
      </Button>
    </div>
  );
};
