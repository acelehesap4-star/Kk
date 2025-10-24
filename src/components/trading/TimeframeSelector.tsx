import { Clock } from 'lucide-react';
import { Timeframe } from '@/types/trading';
import { Button } from '@/components/ui/button';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1d' },
];

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-bold text-foreground">Timeframe</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {timeframes.map(({ value, label }) => (
          <Button
            key={value}
            variant={selected === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(value)}
            className="font-mono text-xs"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}