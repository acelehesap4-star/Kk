import React, { useState } from 'react';
import { MarketType } from '@/types/market';
import { useMarketFeatures } from '@/hooks/useMarketFeatures';

interface AdvancedMarketToolsProps {
  piyasa: MarketType;
  enableAI?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  onFeatureToggle?: (feature: string) => void;
}

export const AdvancedMarketTools: React.FC<AdvancedMarketToolsProps> = ({
  piyasa,
  enableAI = true,
  riskLevel = 'medium',
  onFeatureToggle
}) => {
  const [activeTab, setActiveTab] = useState<'features' | 'analysis' | 'bots' | 'alerts'>('features');
  
  const {
    features,
    analysis,
    alerts,
    bots,
    riskLimits
  } = useMarketFeatures({
    piyasa,
    enableAI,
    riskLevel
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return (
          <div className="space-y-6">
            {/* Temel Özellikler */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Temel Özellikler</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.available.basic.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      features.toggle(feature);
                      onFeatureToggle?.(feature);
                    }}
                    className={`p-2 rounded text-sm ${
                      features.active.some(f => f.id === feature)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </section>

            {/* AI Özellikleri */}
            {enableAI && (
              <section>
                <h3 className="text-lg font-semibold mb-3">AI Özellikleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {features.available.ai.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        features.toggle(feature);
                        onFeatureToggle?.(feature);
                      }}
                      className={`p-2 rounded text-sm ${
                        features.active.some(f => f.id === feature)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Risk Yönetimi */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Risk Yönetimi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.available.risk.map((feature, index) => (
                  <div
                    key={index}
                    className="p-3 rounded border border-gray-200 bg-gray-50"
                  >
                    <h4 className="font-medium">{feature}</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      Limit: {riskLimits[feature.toLowerCase() as keyof typeof riskLimits] || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            {analysis ? (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3">Piyasa Analizi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Teknik Göstergeler */}
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">Teknik Göstergeler</h4>
                      {Object.entries(analysis.indicators.technical).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span>{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Temel Göstergeler */}
                    <div className="p-4 border rounded">
                      <h4 className="font-medium mb-2">Temel Göstergeler</h4>
                      {Object.entries(analysis.indicators.fundamental).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span>{key}:</span>
                          <span>{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Sinyaller */}
                <section>
                  <h3 className="text-lg font-semibold mb-3">İşlem Sinyalleri</h3>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Yön:</span>
                      <span className={`font-medium ${
                        analysis.signals.direction === 'buy'
                          ? 'text-green-600'
                          : analysis.signals.direction === 'sell'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {analysis.signals.direction.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Güç:</span>
                      <span>{analysis.signals.strength}%</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Güven:</span>
                      <span>{analysis.signals.confidence}%</span>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Analiz verisi yükleniyor...
              </div>
            )}
          </div>
        );

      case 'bots':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">Trading Botları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bots.map(bot => (
                <div key={bot.id} className="p-4 border rounded">
                  <h4 className="font-medium">{bot.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{bot.description}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Durum:</span>
                      <span className={`font-medium ${
                        bot.status === 'active'
                          ? 'text-green-600'
                          : bot.status === 'paused'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}>
                        {bot.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Min. Kapital:</span>
                      <span>{bot.requirements.minCapital}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kazanç Oranı:</span>
                      <span>{bot.performance.winRate}%</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    {bot.status === 'active' ? 'Durdur' : 'Başlat'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">Piyasa Alarmları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map(alert => (
                <div key={alert.id} className="p-4 border rounded">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{alert.type.toUpperCase()}</h4>
                    <span className={`px-2 py-1 rounded text-sm ${
                      alert.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : alert.status === 'triggered'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>Koşul: {alert.condition.operator} {alert.condition.value}</div>
                    {alert.action.autoTrade && (
                      <div>
                        Otomatik İşlem: {alert.action.autoTrade.side} {alert.action.autoTrade.size}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600">
                      Sil
                    </button>
                    <button className="flex-1 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Düzenle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {/* Sekmeler */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded ${
            activeTab === 'features'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Özellikler
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 rounded ${
            activeTab === 'analysis'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Analiz
        </button>
        <button
          onClick={() => setActiveTab('bots')}
          className={`px-4 py-2 rounded ${
            activeTab === 'bots'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Botlar
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded ${
            activeTab === 'alerts'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Alarmlar
        </button>
      </div>

      {/* Sekme İçeriği */}
      {renderTabContent()}
    </div>
  );
};