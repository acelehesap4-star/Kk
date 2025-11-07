import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap,
  MessageSquare,
  Lightbulb,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { supabaseAPI, TradingSignal } from '@/lib/api/supabaseAPI';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { toast } from 'sonner';

interface AIAnalysis {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  technicalIndicators: {
    rsi: number;
    macd: string;
    bollinger: string;
    volume: string;
  };
}

interface MarketSentiment {
  overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number;
  factors: string[];
  newsImpact: number;
  socialSentiment: number;
}

interface AITradingAssistantProps {
  exchange: Exchange;
  symbol: string;
  currentPrice?: RealTimePrice;
}

export function AITradingAssistant({ exchange, symbol, currentPrice }: AITradingAssistantProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTradingSignals();
    generateMarketSentiment();
  }, [exchange, symbol]);

  const loadTradingSignals = async () => {
    try {
      const signals = await supabaseAPI.getTradingSignals(exchange, symbol);
      setSignals(signals);
    } catch (error) {
      console.error('Error loading trading signals:', error);
    }
  };

  const generateAIAnalysis = async () => {
    if (!currentPrice) {
      toast.error('Fiyat verisi gerekli');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - in production, this would call a real AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: AIAnalysis = {
        signal: Math.random() > 0.5 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'HOLD',
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        reasoning: generateAIReasoning(currentPrice),
        targetPrice: currentPrice.price * (1 + (Math.random() * 0.1 - 0.05)),
        stopLoss: currentPrice.price * (1 - Math.random() * 0.05),
        timeframe: ['1H', '4H', '1D', '1W'][Math.floor(Math.random() * 4)],
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as 'LOW' | 'MEDIUM' | 'HIGH',
        technicalIndicators: {
          rsi: Math.floor(Math.random() * 100),
          macd: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
          bollinger: Math.random() > 0.5 ? 'OVERSOLD' : 'OVERBOUGHT',
          volume: Math.random() > 0.5 ? 'HIGH' : 'NORMAL'
        }
      };

      setAnalysis(mockAnalysis);

      // Save signal to database
      await supabaseAPI.createTradingSignal({
        exchange,
        symbol,
        signal_type: mockAnalysis.signal.toLowerCase() as 'buy' | 'sell' | 'hold',
        confidence: mockAnalysis.confidence,
        target_price: mockAnalysis.targetPrice,
        stop_loss: mockAnalysis.stopLoss,
        reasoning: mockAnalysis.reasoning,
        ai_generated: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

      await loadTradingSignals();
      toast.success('AI analizi tamamlandı!');
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast.error('AI analizi sırasında hata oluştu');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIReasoning = (price: RealTimePrice): string => {
    const reasons = [
      `${symbol} için teknik analiz güçlü ${price.change24h > 0 ? 'yükseliş' : 'düşüş'} sinyali gösteriyor.`,
      `Hacim analizi ${price.volume24h > 1000000 ? 'yüksek' : 'normal'} aktivite seviyesi gösteriyor.`,
      `Piyasa yapısı ve destek/direnç seviyeleri ${price.change24h > 2 ? 'pozitif' : 'nötr'} görünüm sergiliyor.`,
      `Makroekonomik faktörler ve sektör analizi ${Math.random() > 0.5 ? 'destekleyici' : 'karışık'} sinyaller veriyor.`,
      `Risk/ödül oranı mevcut seviyelerden ${Math.random() > 0.5 ? 'cazip' : 'dikkatli'} görünüyor.`
    ];
    
    return reasons.slice(0, 3).join(' ');
  };

  const generateMarketSentiment = async () => {
    try {
      // Simulate sentiment analysis
      const mockSentiment: MarketSentiment = {
        overall: ['BULLISH', 'BEARISH', 'NEUTRAL'][Math.floor(Math.random() * 3)] as 'BULLISH' | 'BEARISH' | 'NEUTRAL',
        score: Math.floor(Math.random() * 100),
        factors: [
          'Sosyal medya analizi',
          'Haber sentiment analizi',
          'Teknik göstergeler',
          'Hacim analizi',
          'Kurumsal aktivite'
        ],
        newsImpact: Math.floor(Math.random() * 100),
        socialSentiment: Math.floor(Math.random() * 100)
      };

      setSentiment(mockSentiment);
    } catch (error) {
      console.error('Error generating market sentiment:', error);
    }
  };

  const handleChatMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user' as const, content: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponses = [
        `${symbol} için mevcut piyasa koşullarında ${currentPrice?.change24h && currentPrice.change24h > 0 ? 'pozitif' : 'negatif'} bir trend gözlemliyorum. Risk yönetimi önemli.`,
        `Teknik analiz açısından ${symbol} ${Math.random() > 0.5 ? 'güçlü destek seviyesinde' : 'kritik direnç seviyesinde'} bulunuyor.`,
        `Piyasa volatilitesi göz önüne alındığında, ${symbol} için ${Math.random() > 0.5 ? 'kademeli pozisyon alma' : 'stop-loss kullanma'} stratejisi önerebilirim.`,
        `Makroekonomik veriler ${symbol} sektörü için ${Math.random() > 0.5 ? 'destekleyici' : 'karışık'} sinyaller gönderiyor.`
      ];

      const aiResponse = {
        role: 'ai' as const,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)]
      };

      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('AI yanıtı alınamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case 'BUY': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'SELL': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Card */}
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Trading Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button 
              onClick={generateAIAnalysis}
              disabled={isAnalyzing || !currentPrice}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  AI Analizi Başlat
                </>
              )}
            </Button>
            
            {currentPrice && (
              <div className="text-sm text-purple-400/80">
                Mevcut Fiyat: ${currentPrice.price.toLocaleString()}
              </div>
            )}
          </div>

          {analysis && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${getSignalColor(analysis.signal)} font-semibold`}>
                    {analysis.signal === 'BUY' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {analysis.signal === 'SELL' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {analysis.signal === 'HOLD' && <Target className="h-3 w-3 mr-1" />}
                    {analysis.signal}
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                    {analysis.confidence}% Güven
                  </Badge>
                  <Badge variant="outline" className={`${getRiskColor(analysis.riskLevel)} border-current/30`}>
                    {analysis.riskLevel} Risk
                  </Badge>
                </div>
                <div className="text-sm text-purple-400/80">
                  {analysis.timeframe} Zaman Dilimi
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-purple-400/60 uppercase mb-1">Hedef Fiyat</p>
                  <p className="text-lg font-semibold text-green-400">${analysis.targetPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-400/60 uppercase mb-1">Stop Loss</p>
                  <p className="text-lg font-semibold text-red-400">${analysis.stopLoss.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-purple-400/60 uppercase mb-2">AI Analiz Sonucu</p>
                <p className="text-sm text-purple-400/80">{analysis.reasoning}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-purple-400/60">RSI</p>
                  <p className="text-purple-400 font-semibold">{analysis.technicalIndicators.rsi}</p>
                </div>
                <div>
                  <p className="text-purple-400/60">MACD</p>
                  <p className="text-purple-400 font-semibold">{analysis.technicalIndicators.macd}</p>
                </div>
                <div>
                  <p className="text-purple-400/60">Bollinger</p>
                  <p className="text-purple-400 font-semibold">{analysis.technicalIndicators.bollinger}</p>
                </div>
                <div>
                  <p className="text-purple-400/60">Hacim</p>
                  <p className="text-purple-400 font-semibold">{analysis.technicalIndicators.volume}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      {sentiment && (
        <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Piyasa Duyarlılığı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${
                  sentiment.overall === 'BULLISH' ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                  sentiment.overall === 'BEARISH' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                } text-lg px-3 py-1`}>
                  {sentiment.overall}
                </Badge>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{sentiment.score}/100</p>
                  <p className="text-xs text-blue-400/60">Sentiment Skoru</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-400/60 uppercase mb-2">Haber Etkisi</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-500/20 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sentiment.newsImpact}%` }}
                      />
                    </div>
                    <span className="text-sm text-blue-400">{sentiment.newsImpact}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-400/60 uppercase mb-2">Sosyal Medya</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-500/20 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sentiment.socialSentiment}%` }}
                      />
                    </div>
                    <span className="text-sm text-blue-400">{sentiment.socialSentiment}%</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-blue-400/60 uppercase mb-2">Analiz Faktörleri</p>
                <div className="flex flex-wrap gap-2">
                  {sentiment.factors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-blue-400 border-blue-500/30 text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Signals */}
      {signals.length > 0 && (
        <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Son AI Sinyalleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signals.slice(0, 5).map((signal) => (
                <div key={signal.id} className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getSignalColor(signal.signal_type)}>
                        {signal.signal_type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                        {signal.confidence}%
                      </Badge>
                    </div>
                    <div className="text-xs text-cyan-400/60">
                      {new Date(signal.created_at).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-sm text-cyan-400/80 mb-2">{signal.reasoning}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-400">Hedef: ${signal.target_price.toFixed(2)}</span>
                    <span className="text-red-400">Stop: ${signal.stop_loss.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Chat Assistant */}
      <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Sohbet Asistanı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto bg-green-500/10 border border-green-500/20 rounded-lg p-3 space-y-2">
              {chatMessages.length === 0 ? (
                <div className="text-center text-green-400/60 py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>AI asistanınızla sohbete başlayın</p>
                  <p className="text-xs mt-1">Piyasa analizi, strateji önerileri ve daha fazlası...</p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.role === 'user' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-black/40 text-green-400/80'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/40 text-green-400/80 p-2 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-3 w-3 border border-green-400 border-t-transparent rounded-full"></div>
                      AI düşünüyor...
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="AI asistanına sorunuzu yazın..."
                className="bg-black/40 border-green-500/20 text-green-400"
                onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
              />
              <Button 
                onClick={handleChatMessage}
                disabled={!userMessage.trim() || isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}