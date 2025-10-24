import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { NewsItem } from '@/types/trading';

const NEWS_URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=cointelegraph,coindesk';

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(NEWS_URL);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setNews(data.Data?.slice(0, 20) || []);
    } catch (error) {
      console.error('News fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Crypto News</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchNews}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {loading && news.length === 0 && (
            <div className="text-sm text-muted-foreground">Loading news...</div>
          )}
          
          {news.map((item, idx) => (
            <div
              key={idx}
              className="space-y-2 rounded-lg border border-border bg-card/30 p-3 transition-colors hover:bg-card/50"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <span className="flex-1">{item.title}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
              
              <p className="text-xs text-muted-foreground line-clamp-2">{item.body}</p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{item.source}</span>
                <span>•</span>
                <span>{new Date(item.published_on * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
