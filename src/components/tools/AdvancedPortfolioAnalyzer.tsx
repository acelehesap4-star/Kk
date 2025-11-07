import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
  Calendar,
  Zap
} from 'lucide-react';
import { Exchange } from '@/types/trading';
import { supabaseAPI } from '@/lib/api/supabaseAPI';
import { exchangeAPI, RealTimePrice } from '@/lib/api/exchangeAPI';

interface PortfolioPosition {
  symbol: string;
  exchange: Exchange;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocation: number;
  lastUpdated: Date;
}

interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
}

interface RiskMetrics {
  valueAtRisk: number; // VaR at 95% confidence
  expectedShortfall: number; // CVaR
  concentrationRisk: number;
  correlationRisk: number;
  liquidityRisk: number;
  overallRiskScore: number;
}

interface PerformanceMetrics {
  returns1D: number;
  returns7D: number;
  returns30D: number;
  returns90D: number;
  returns1Y: number;
  winRate: number;
  profitFactor: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
}

interface AdvancedPortfolioAnalyzerProps {
  userId: string;
}

export function AdvancedPortfolioAnalyzer({ userId }: AdvancedPortfolioAnalyzerProps) {
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rebalanceRecommendations, setRebalanceRecommendations] = useState<any[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadPortfolioData();
    const interval = setInterval(loadPortfolioData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [userId]);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    try {
      // Load user's trading orders to build portfolio
      const orders = await supabaseAPI.getTradingOrders(userId);
      const filledOrders = orders.filter(order => order.status === 'filled');
      
      // Group orders by symbol and exchange to calculate positions
      const positionMap = new Map<string, any>();
      
      for (const order of filledOrders) {
        const key = `${order.symbol}-${order.exchange}`;
        const existing = positionMap.get(key);
        
        if (existing) {
          if (order.side === 'buy') {
            existing.quantity += order.filled_amount || order.amount;
            existing.totalCost += order.total;
          } else {
            existing.quantity -= order.filled_amount || order.amount;
            existing.totalCost -= order.total;
          }
        } else {
          positionMap.set(key, {
            symbol: order.symbol,
            exchange: order.exchange,
            quantity: order.side === 'buy' ? (order.filled_amount || order.amount) : -(order.filled_amount || order.amount),
            totalCost: order.side === 'buy' ? order.total : -order.total,
            orders: [order]
          });
        }
      }

      // Convert to positions array and fetch current prices
      const positionsArray: PortfolioPosition[] = [];
      let totalPortfolioValue = 0;
      
      for (const [key, positionData] of positionMap) {
        if (positionData.quantity > 0) { // Only include positions with positive quantity
          try {
            const currentPriceData = await exchangeAPI.getRealTimePrice(positionData.exchange, positionData.symbol);
            const currentPrice = currentPriceData.price;
            const averagePrice = positionData.totalCost / positionData.quantity;
            const totalValue = positionData.quantity * currentPrice;
            const unrealizedPnL = totalValue - positionData.totalCost;
            const unrealizedPnLPercent = (unrealizedPnL / positionData.totalCost) * 100;
            
            totalPortfolioValue += totalValue;
            
            positionsArray.push({
              symbol: positionData.symbol,
              exchange: positionData.exchange,
              quantity: positionData.quantity,
              averagePrice,
              currentPrice,
              totalValue,
              unrealizedPnL,
              unrealizedPnLPercent,
              allocation: 0, // Will be calculated after we have total value
              lastUpdated: new Date()
            });
          } catch (error) {
            console.error(`Error fetching price for ${positionData.symbol}:`, error);
          }
        }
      }

      // Calculate allocations
      positionsArray.forEach(position => {
        position.allocation = (position.totalValue / totalPortfolioValue) * 100;
      });

      setPositions(positionsArray);
      
      // Calculate portfolio metrics
      await calculatePortfolioMetrics(positionsArray, totalPortfolioValue);
      await calculateRiskMetrics(positionsArray);
      await calculatePerformanceMetrics(filledOrders);
      await generateRebalanceRecommendations(positionsArray);
      await generateRiskAlerts(positionsArray);
      
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePortfolioMetrics = async (positions: PortfolioPosition[], totalValue: number) => {
    const totalCost = positions.reduce((sum, pos) => sum + (pos.averagePrice * pos.quantity), 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = (totalPnL / totalCost) * 100;
    
    // Simulate additional metrics (in production, these would be calculated from historical data)
    const metrics: PortfolioMetrics = {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      dayChange: totalValue * (Math.random() * 0.1 - 0.05), // -5% to +5%
      dayChangePercent: Math.random() * 10 - 5,
      sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
      maxDrawdown: Math.random() * 30 + 5, // 5% to 35%
      volatility: Math.random() * 40 + 10, // 10% to 50%
      beta: Math.random() * 1.5 + 0.5 // 0.5 to 2.0
    };
    
    setMetrics(metrics);
  };

  const calculateRiskMetrics = async (positions: PortfolioPosition[]) => {
    // Simulate risk calculations (in production, these would use historical data and Monte Carlo simulations)
    const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    
    // Calculate concentration risk (Herfindahl index)
    const concentrationRisk = positions.reduce((sum, pos) => {
      const weight = pos.allocation / 100;
      return sum + (weight * weight);
    }, 0) * 100;

    const riskMetrics: RiskMetrics = {
      valueAtRisk: totalValue * (Math.random() * 0.15 + 0.05), // 5% to 20% of portfolio
      expectedShortfall: totalValue * (Math.random() * 0.25 + 0.08), // 8% to 33% of portfolio
      concentrationRisk,
      correlationRisk: Math.random() * 100,
      liquidityRisk: Math.random() * 100,
      overallRiskScore: Math.random() * 100
    };
    
    setRiskMetrics(riskMetrics);
  };

  const calculatePerformanceMetrics = async (orders: any[]) => {
    // Simulate performance metrics calculation
    const performanceMetrics: PerformanceMetrics = {
      returns1D: Math.random() * 10 - 5,
      returns7D: Math.random() * 20 - 10,
      returns30D: Math.random() * 40 - 20,
      returns90D: Math.random() * 60 - 30,
      returns1Y: Math.random() * 200 - 100,
      winRate: Math.random() * 40 + 40, // 40% to 80%
      profitFactor: Math.random() * 2 + 0.5, // 0.5 to 2.5
      maxConsecutiveWins: Math.floor(Math.random() * 10) + 1,
      maxConsecutiveLosses: Math.floor(Math.random() * 8) + 1
    };
    
    setPerformanceMetrics(performanceMetrics);
  };

  const generateRebalanceRecommendations = async (positions: PortfolioPosition[]) => {
    const recommendations = [];
    
    // Find overweight positions (>20% allocation)
    const overweightPositions = positions.filter(pos => pos.allocation > 20);
    for (const pos of overweightPositions) {
      recommendations.push({
        type: 'REDUCE',
        symbol: pos.symbol,
        currentAllocation: pos.allocation,
        targetAllocation: 15,
        action: `${pos.symbol} pozisyonunu %${pos.allocation.toFixed(1)}'den %15'e düşürün`,
        priority: 'HIGH',
        reason: 'Aşırı konsantrasyon riski'
      });
    }

    // Suggest diversification if portfolio has less than 5 positions
    if (positions.length < 5) {
      recommendations.push({
        type: 'DIVERSIFY',
        symbol: 'PORTFOLIO',
        currentAllocation: 0,
        targetAllocation: 0,
        action: 'Portföyünüze farklı sektörlerden varlıklar ekleyin',
        priority: 'MEDIUM',
        reason: 'Yetersiz çeşitlendirme'
      });
    }

    setRebalanceRecommendations(recommendations);
  };

  const generateRiskAlerts = async (positions: PortfolioPosition[]) => {
    const alerts = [];
    
    // Check for high volatility positions
    for (const pos of positions) {
      if (pos.unrealizedPnLPercent < -15) {
        alerts.push({
          type: 'HIGH_LOSS',
          symbol: pos.symbol,
          severity: 'HIGH',
          message: `${pos.symbol} %${Math.abs(pos.unrealizedPnLPercent).toFixed(1)} zarar ediyor`,
          recommendation: 'Stop-loss seviyelerini gözden geçirin'
        });
      }
      
      if (pos.allocation > 25) {
        alerts.push({
          type: 'CONCENTRATION',
          symbol: pos.symbol,
          severity: 'MEDIUM',
          message: `${pos.symbol} portföyün %${pos.allocation.toFixed(1)}'ini oluşturuyor`,
          recommendation: 'Pozisyon boyutunu azaltmayı düşünün'
        });
      }
    }

    setRiskAlerts(alerts);
  };

  const getMetricColor = (value: number, isPercentage: boolean = false) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-400';
    if (score > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Portföy Genel Bakış
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-xs text-blue-400/60 uppercase mb-1">Toplam Değer</p>
                <p className="text-2xl font-bold text-blue-400">${metrics.totalValue.toLocaleString()}</p>
                <p className={`text-sm ${getMetricColor(metrics.dayChange)}`}>
                  {metrics.dayChange > 0 ? '+' : ''}${metrics.dayChange.toFixed(2)} ({metrics.dayChangePercent.toFixed(2)}%)
                </p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-xs text-green-400/60 uppercase mb-1">Toplam P&L</p>
                <p className={`text-2xl font-bold ${getMetricColor(metrics.totalPnL)}`}>
                  {metrics.totalPnL > 0 ? '+' : ''}${metrics.totalPnL.toLocaleString()}
                </p>
                <p className={`text-sm ${getMetricColor(metrics.totalPnLPercent)}`}>
                  {metrics.totalPnLPercent > 0 ? '+' : ''}{metrics.totalPnLPercent.toFixed(2)}%
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-xs text-purple-400/60 uppercase mb-1">Sharpe Oranı</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.sharpeRatio.toFixed(2)}</p>
                <p className="text-sm text-purple-400/80">Risk Ayarlı Getiri</p>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <p className="text-xs text-orange-400/60 uppercase mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.maxDrawdown.toFixed(1)}%</p>
                <p className="text-sm text-orange-400/80">En Büyük Düşüş</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-blue-500/20">
          <TabsTrigger value="positions" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Pozisyonlar
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Risk Analizi
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Performans
          </TabsTrigger>
          <TabsTrigger value="rebalance" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Rebalans
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Uyarılar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card className="bg-black/40 border-blue-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Mevcut Pozisyonlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="h-16 w-16 mx-auto mb-4 text-blue-400/30" />
                  <p className="text-blue-400/60">Henüz pozisyon bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {positions.map((position, index) => (
                    <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                            {position.symbol}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400/80 border-blue-500/30">
                            {position.exchange}
                          </Badge>
                          <Badge className={`${getMetricColor(position.unrealizedPnL)} bg-current/10 border-current/20`}>
                            {position.unrealizedPnL > 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-400">{position.allocation.toFixed(1)}%</p>
                          <p className="text-xs text-blue-400/60">Portföy Ağırlığı</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-blue-400/60">Miktar</p>
                          <p className="text-blue-400 font-semibold">{position.quantity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-blue-400/60">Ortalama Fiyat</p>
                          <p className="text-blue-400 font-semibold">${position.averagePrice.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-blue-400/60">Mevcut Fiyat</p>
                          <p className="text-blue-400 font-semibold">${position.currentPrice.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-blue-400/60">Toplam Değer</p>
                          <p className="text-blue-400 font-semibold">${position.totalValue.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className={`text-sm ${getMetricColor(position.unrealizedPnLPercent)}`}>
                          P&L: {position.unrealizedPnLPercent > 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-blue-400/60">
                          Son Güncelleme: {position.lastUpdated.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskMetrics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-xs text-red-400/60 uppercase mb-1">Value at Risk (95%)</p>
                      <p className="text-2xl font-bold text-red-400">${riskMetrics.valueAtRisk.toLocaleString()}</p>
                      <p className="text-sm text-red-400/80">Günlük potansiyel kayıp</p>
                    </div>
                    
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <p className="text-xs text-orange-400/60 uppercase mb-1">Expected Shortfall</p>
                      <p className="text-2xl font-bold text-orange-400">${riskMetrics.expectedShortfall.toLocaleString()}</p>
                      <p className="text-sm text-orange-400/80">Ortalama kuyruk riski</p>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <p className="text-xs text-yellow-400/60 uppercase mb-1">Konsantrasyon Riski</p>
                      <p className="text-2xl font-bold text-yellow-400">{riskMetrics.concentrationRisk.toFixed(1)}</p>
                      <p className="text-sm text-yellow-400/80">Herfindahl İndeksi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-red-400/80 mb-2">Korelasyon Riski</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-red-500/20 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${getRiskColor(riskMetrics.correlationRisk)} bg-current`}
                            style={{ width: `${riskMetrics.correlationRisk}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getRiskColor(riskMetrics.correlationRisk)}`}>
                          {riskMetrics.correlationRisk.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-red-400/80 mb-2">Likidite Riski</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-red-500/20 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${getRiskColor(riskMetrics.liquidityRisk)} bg-current`}
                            style={{ width: `${riskMetrics.liquidityRisk}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getRiskColor(riskMetrics.liquidityRisk)}`}>
                          {riskMetrics.liquidityRisk.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-red-400/80 mb-2">Genel Risk Skoru</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-red-500/20 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${getRiskColor(riskMetrics.overallRiskScore)} bg-current`}
                            style={{ width: `${riskMetrics.overallRiskScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getRiskColor(riskMetrics.overallRiskScore)}`}>
                          {riskMetrics.overallRiskScore.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-black/40 border-green-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performans Metrikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceMetrics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getMetricColor(performanceMetrics.returns1D)}`}>
                        {performanceMetrics.returns1D > 0 ? '+' : ''}{performanceMetrics.returns1D.toFixed(2)}%
                      </p>
                      <p className="text-xs text-green-400/60 uppercase">1 Gün</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getMetricColor(performanceMetrics.returns7D)}`}>
                        {performanceMetrics.returns7D > 0 ? '+' : ''}{performanceMetrics.returns7D.toFixed(2)}%
                      </p>
                      <p className="text-xs text-green-400/60 uppercase">7 Gün</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getMetricColor(performanceMetrics.returns30D)}`}>
                        {performanceMetrics.returns30D > 0 ? '+' : ''}{performanceMetrics.returns30D.toFixed(2)}%
                      </p>
                      <p className="text-xs text-green-400/60 uppercase">30 Gün</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getMetricColor(performanceMetrics.returns90D)}`}>
                        {performanceMetrics.returns90D > 0 ? '+' : ''}{performanceMetrics.returns90D.toFixed(2)}%
                      </p>
                      <p className="text-xs text-green-400/60 uppercase">90 Gün</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${getMetricColor(performanceMetrics.returns1Y)}`}>
                        {performanceMetrics.returns1Y > 0 ? '+' : ''}{performanceMetrics.returns1Y.toFixed(2)}%
                      </p>
                      <p className="text-xs text-green-400/60 uppercase">1 Yıl</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-xs text-green-400/60 uppercase mb-1">Kazanma Oranı</p>
                      <p className="text-2xl font-bold text-green-400">{performanceMetrics.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-xs text-blue-400/60 uppercase mb-1">Kar Faktörü</p>
                      <p className="text-2xl font-bold text-blue-400">{performanceMetrics.profitFactor.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <p className="text-xs text-purple-400/60 uppercase mb-1">Max Kazanç Serisi</p>
                      <p className="text-2xl font-bold text-purple-400">{performanceMetrics.maxConsecutiveWins}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <p className="text-xs text-orange-400/60 uppercase mb-1">Max Kayıp Serisi</p>
                      <p className="text-2xl font-bold text-orange-400">{performanceMetrics.maxConsecutiveLosses}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rebalance" className="space-y-4">
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rebalans Önerileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rebalanceRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400/30" />
                  <p className="text-green-400/60">Portföyünüz dengeli görünüyor</p>
                  <p className="text-green-400/40 text-sm mt-1">Şu anda rebalans önerisi bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rebalanceRecommendations.map((rec, index) => (
                    <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={`${
                            rec.priority === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                            rec.priority === 'MEDIUM' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                            'text-green-400 bg-green-500/10 border-green-500/20'
                          }`}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                            {rec.type}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Uygula
                        </Button>
                      </div>
                      
                      <p className="text-purple-400 mb-2">{rec.action}</p>
                      <p className="text-sm text-purple-400/60">{rec.reason}</p>
                      
                      {rec.currentAllocation > 0 && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <span className="text-purple-400/80">
                            Mevcut: %{rec.currentAllocation.toFixed(1)}
                          </span>
                          <span className="text-purple-400/80">→</span>
                          <span className="text-purple-400/80">
                            Hedef: %{rec.targetAllocation.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Uyarıları
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400/30" />
                  <p className="text-green-400/60">Aktif risk uyarısı bulunmuyor</p>
                  <p className="text-green-400/40 text-sm mt-1">Portföyünüz güvenli parametreler içinde</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {riskAlerts.map((alert, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-semibold">{alert.symbol}</span>
                        </div>
                        <Badge variant="outline" className="border-current/30">
                          {alert.type}
                        </Badge>
                      </div>
                      
                      <p className="mb-2">{alert.message}</p>
                      <p className="text-sm opacity-80">{alert.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}