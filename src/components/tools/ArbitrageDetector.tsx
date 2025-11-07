import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  ArrowRightLeft, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Target
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { EXCHANGES } from '@/lib/exchanges';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';
import { supabaseAPI, ArbitrageOpportunity } from '@/lib/api/supabaseAPI';
import { toast } from 'sonner';

interface ArbitrageOpportunityExtended extends ArbitrageOpportunity {
  buyExchangeData?: RealTimePrice;
  sellExchangeData?: RealTimePrice;
  estimatedProfit?: number;
  executionTime?: number;
}

interface ArbitrageDetectorProps {
  symbols: string[];
  exchanges: Exchange[];
}

export function ArbitrageDetector({ symbols, exchanges }: ArbitrageDetectorProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunityExtended[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbols[0] || '');
  const [minProfitThreshold, setMinProfitThreshold] = useState(0.5); // 0.5% minimum profit
  const [scanInterval, setScanInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoScan, setAutoScan] = useState(false);

  useEffect(() => {
    if (autoScan) {
      startAutoScan();
    } else {
      stopAutoScan();
    }

    return () => stopAutoScan();
  }, [autoScan]);

  const startAutoScan = () => {
    if (scanInterval) clearInterval(scanInterval);
    
    const interval = setInterval(() => {
      scanForArbitrageOpportunities();
    }, 30000); // Scan every 30 seconds
    
    setScanInterval(interval);
  };

  const stopAutoScan = () => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
  };

  const scanForArbitrageOpportunities = async () => {
    setIsScanning(true);
    const newOpportunities: ArbitrageOpportunityExtended[] = [];

    try {
      for (const symbol of symbols) {
        const prices: { exchange: Exchange; price: RealTimePrice }[] = [];
        
        // Fetch prices from all exchanges for this symbol
        for (const exchange of exchanges) {
          try {
            const price = await exchangeAPI.getRealTimePrice(exchange, symbol);
            prices.push({ exchange, price });
          } catch (error) {
            console.warn(`Failed to fetch price for ${symbol} on ${exchange}:`, error);
          }
        }

        // Find arbitrage opportunities
        for (let i = 0; i < prices.length; i++) {
          for (let j = i + 1; j < prices.length; j++) {
            const buyExchange = prices[i];
            const sellExchange = prices[j];
            
            let profitPercentage = 0;
            let buyPrice = 0;
            let sellPrice = 0;
            let actualBuyExchange = buyExchange;
            let actualSellExchange = sellExchange;

            // Check both directions
            if (buyExchange.price.price < sellExchange.price.price) {
              buyPrice = buyExchange.price.price;
              sellPrice = sellExchange.price.price;
              profitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
            } else if (sellExchange.price.price < buyExchange.price.price) {
              buyPrice = sellExchange.price.price;
              sellPrice = buyExchange.price.price;
              profitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100;
              actualBuyExchange = sellExchange;
              actualSellExchange = buyExchange;
            }

            // Only include opportunities above the minimum threshold
            if (profitPercentage >= minProfitThreshold) {
              const opportunity: ArbitrageOpportunityExtended = {
                id: `${symbol}-${actualBuyExchange.exchange}-${actualSellExchange.exchange}-${Date.now()}`,
                symbol,
                buy_exchange: actualBuyExchange.exchange,
                sell_exchange: actualSellExchange.exchange,
                buy_price: buyPrice,
                sell_price: sellPrice,
                profit_percentage: profitPercentage,
                volume_available: Math.min(
                  actualBuyExchange.price.volume24h * 0.001, // Assume 0.1% of daily volume is available
                  actualSellExchange.price.volume24h * 0.001
                ),
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes expiry
                buyExchangeData: actualBuyExchange.price,
                sellExchangeData: actualSellExchange.price,
                estimatedProfit: (sellPrice - buyPrice) * 1000, // Profit for 1000 units
                executionTime: Math.floor(Math.random() * 30) + 10 // 10-40 seconds estimated execution time
              };

              newOpportunities.push(opportunity);

              // Save to database
              try {
                await supabaseAPI.createArbitrageOpportunity({
                  symbol,
                  buy_exchange: actualBuyExchange.exchange,
                  sell_exchange: actualSellExchange.exchange,
                  buy_price: buyPrice,
                  sell_price: sellPrice,
                  profit_percentage: profitPercentage,
                  volume_available: opportunity.volume_available,
                  expires_at: opportunity.expires_at
                });
              } catch (error) {
                console.error('Error saving arbitrage opportunity:', error);
              }
            }
          }
        }
      }

      // Sort by profit percentage (highest first)
      newOpportunities.sort((a, b) => b.profit_percentage - a.profit_percentage);
      
      setOpportunities(newOpportunities);
      setLastScanTime(new Date());

      if (newOpportunities.length > 0) {
        toast.success(`${newOpportunities.length} arbitraj fırsatı bulundu!`);
      }

    } catch (error) {
      console.error('Error scanning for arbitrage opportunities:', error);
      toast.error('Arbitraj taraması sırasında hata oluştu');
    } finally {
      setIsScanning(false);
    }
  };

  const executeArbitrage = async (opportunity: ArbitrageOpportunityExtended) => {
    toast.info('Arbitraj işlemi simüle ediliyor...');
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, opportunity.executionTime! * 100));
    
    // In a real implementation, this would:
    // 1. Place buy order on the cheaper exchange
    // 2. Place sell order on the more expensive exchange
    // 3. Monitor execution
    // 4. Handle any failures or partial fills
    
    const success = Math.random() > 0.2; // 80% success rate simulation
    
    if (success) {
      toast.success(`Arbitraj işlemi başarılı! Tahmini kar: $${opportunity.estimatedProfit?.toFixed(2)}`);
      
      // Remove executed opportunity
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunity.id));
    } else {
      toast.error('Arbitraj işlemi başarısız - piyasa koşulları değişti');
    }
  };

  const getProfitColor = (percentage: number) => {
    if (percentage >= 2) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (percentage >= 1) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const getRiskLevel = (percentage: number, volume: number) => {
    if (percentage > 3 || volume < 1000) return 'HIGH';
    if (percentage > 1.5 || volume < 5000) return 'MEDIUM';
    return 'LOW';
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
      {/* Control Panel */}
      <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Arbitraj Fırsatları Detektörü
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              onClick={scanForArbitrageOpportunities}
              disabled={isScanning}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Taranıyor...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Arbitraj Tara
                </>
              )}
            </Button>

            <Button 
              onClick={() => setAutoScan(!autoScan)}
              variant={autoScan ? "default" : "outline"}
              className={autoScan ? 
                "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : 
                "bg-black/40 border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
              }
            >
              {autoScan ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Otomatik Tarama Açık
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Otomatik Tarama Kapalı
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-orange-400/80">Min Kar (%):</label>
              <input
                type="number"
                value={minProfitThreshold}
                onChange={(e) => setMinProfitThreshold(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 bg-black/40 border border-orange-500/20 rounded text-orange-400 text-sm"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          {lastScanTime && (
            <div className="text-sm text-orange-400/60">
              Son tarama: {lastScanTime.toLocaleTimeString()}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <p className="text-orange-400/60 uppercase text-xs mb-1">Aktif Fırsatlar</p>
              <p className="text-2xl font-bold text-orange-400">{opportunities.length}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400/60 uppercase text-xs mb-1">En Yüksek Kar</p>
              <p className="text-2xl font-bold text-green-400">
                {opportunities.length > 0 ? `${opportunities[0].profit_percentage.toFixed(2)}%` : '0%'}
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-400/60 uppercase text-xs mb-1">Tarama Durumu</p>
              <p className="text-lg font-semibold text-blue-400">
                {isScanning ? 'Taranıyor' : autoScan ? 'Otomatik' : 'Manuel'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Mevcut Arbitraj Fırsatları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-orange-400/30" />
              <p className="text-orange-400/60 text-lg mb-2">Henüz arbitraj fırsatı bulunamadı</p>
              <p className="text-orange-400/40 text-sm">
                {isScanning ? 'Piyasalar taranıyor...' : 'Tarama başlatmak için yukarıdaki butonu kullanın'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => {
                const riskLevel = getRiskLevel(opportunity.profit_percentage, opportunity.volume_available);
                const timeLeft = Math.max(0, new Date(opportunity.expires_at).getTime() - Date.now());
                const minutesLeft = Math.floor(timeLeft / 60000);
                const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

                return (
                  <div key={opportunity.id} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="text-orange-400 bg-orange-500/20 border-orange-500/30 font-semibold">
                          {opportunity.symbol}
                        </Badge>
                        <Badge className={getProfitColor(opportunity.profit_percentage)}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {opportunity.profit_percentage.toFixed(2)}% Kar
                        </Badge>
                        <Badge variant="outline" className={`${getRiskColor(riskLevel)} border-current/30`}>
                          {riskLevel} Risk
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-orange-400/60">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => executeArbitrage(opportunity)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Çalıştır
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-xs text-red-400/60 uppercase mb-1">Satın Al</p>
                        <p className="text-lg font-semibold text-red-400">
                          {EXCHANGES[opportunity.buy_exchange].name}
                        </p>
                        <p className="text-sm text-red-400/80">${opportunity.buy_price.toFixed(4)}</p>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-xs text-green-400/60 uppercase mb-1">Sat</p>
                        <p className="text-lg font-semibold text-green-400">
                          {EXCHANGES[opportunity.sell_exchange].name}
                        </p>
                        <p className="text-sm text-green-400/80">${opportunity.sell_price.toFixed(4)}</p>
                      </div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-xs text-blue-400/60 uppercase mb-1">Tahmini Kar</p>
                        <p className="text-lg font-semibold text-blue-400">
                          ${opportunity.estimatedProfit?.toFixed(2)}
                        </p>
                        <p className="text-sm text-blue-400/80">1000 birim için</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-orange-400/60">
                          Mevcut Hacim: {opportunity.volume_available.toLocaleString()}
                        </span>
                        <span className="text-orange-400/60">
                          Tahmini Süre: {opportunity.executionTime}s
                        </span>
                      </div>
                      
                      {riskLevel === 'HIGH' && (
                        <div className="flex items-center gap-1 text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Yüksek Risk</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-black/40 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Arbitraj İstatistikleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {opportunities.reduce((sum, opp) => sum + (opp.estimatedProfit || 0), 0).toFixed(2)}
              </p>
              <p className="text-xs text-orange-400/60 uppercase">Toplam Potansiyel Kar ($)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {opportunities.length > 0 ? (opportunities.reduce((sum, opp) => sum + opp.profit_percentage, 0) / opportunities.length).toFixed(2) : '0'}%
              </p>
              <p className="text-xs text-orange-400/60 uppercase">Ortalama Kar Oranı</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {exchanges.length}
              </p>
              <p className="text-xs text-orange-400/60 uppercase">Takip Edilen Borsa</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {symbols.length}
              </p>
              <p className="text-xs text-orange-400/60 uppercase">Takip Edilen Sembol</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}