import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalProps {
  logs: Array<{ message: string; level: 'info' | 'warn' | 'error'; timestamp: Date }>;
}

export function Terminal({ logs }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">Terminal</h4>
      <ScrollArea className="h-[180px] rounded-lg border border-border bg-black/40 p-3 font-mono text-xs terminal-scroll">
        <div ref={scrollRef} className="space-y-1">
          {logs.length === 0 && (
            <div className="text-muted-foreground">Waiting for logs...</div>
          )}
          {logs.slice(0, 200).map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.level === 'error'
                  ? 'text-destructive'
                  : log.level === 'warn'
                  ? 'text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="text-primary">[{log.timestamp.toLocaleTimeString()}]</span>{' '}
              {log.message}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
