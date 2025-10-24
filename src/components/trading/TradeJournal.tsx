import { useState } from 'react';
import { BookOpen, Plus, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  side: 'buy' | 'sell';
  entry: number;
  exit: number;
  pnl: number;
  notes: string;
}

export const TradeJournal = () => {
  const [entries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2025-01-25',
      symbol: 'BTCUSDT',
      side: 'buy',
      entry: 65000,
      exit: 67500,
      pnl: 2500,
      notes: 'Strong breakout above resistance. Good entry on RSI oversold bounce.',
    },
    {
      id: '2',
      date: '2025-01-24',
      symbol: 'ETHUSDT',
      side: 'sell',
      entry: 3250,
      exit: 3150,
      pnl: -100,
      notes: 'Failed breakdown. Should have used tighter stop loss.',
    },
  ]);

  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    toast.success('Journal entry added!');
    setNewNote('');
    setIsAddingNote(false);
  };

  const totalPnL = entries.reduce((sum, e) => sum + e.pnl, 0);
  const winRate = ((entries.filter(e => e.pnl > 0).length / entries.length) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-chart-4" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Trade Journal</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAddingNote(!isAddingNote)}
          className="gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded-lg border ${totalPnL >= 0 ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Total PnL</div>
          <div className={`text-lg font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            ${totalPnL.toFixed(2)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">Win Rate</div>
          <div className="text-lg font-bold text-primary">{winRate}%</div>
        </div>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border animate-fade-in">
          <Textarea
            placeholder="What did you learn from this trade?"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px] text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={addNote} size="sm" className="flex-1">
              Save Entry
            </Button>
            <Button onClick={() => setIsAddingNote(false)} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-3 rounded-lg border transition-all ${
              entry.pnl >= 0
                ? 'bg-success/5 border-success/20'
                : 'bg-destructive/5 border-destructive/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {entry.pnl >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className="text-sm font-bold text-foreground">{entry.symbol}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  entry.side === 'buy' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                }`}>
                  {entry.side.toUpperCase()}
                </span>
              </div>
              <span className={`text-sm font-bold ${entry.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-muted-foreground">Entry: </span>
                <span className="text-foreground font-medium">${entry.entry}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Exit: </span>
                <span className="text-foreground font-medium">${entry.exit}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {entry.date}
            </div>

            <div className="p-2 rounded bg-muted/50 text-xs text-foreground">
              {entry.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
