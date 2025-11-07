import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  testnet: boolean;
  enabled: boolean;
}

export const ExchangeSettings = () => {
  const [configs, setConfigs] = useState<ExchangeConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<string>('');
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    testnet: false,
    enabled: true
  });

  // Exchange templates with their required fields
  const exchangeTemplates = {
    BINANCE: {
      name: 'Binance',
      requiresPassphrase: false,
      features: ['Spot Trading', 'Futures', 'Margin Trading', 'Grid Trading'],
      websocketSupport: true,
      documentation: 'https://binance-docs.github.io/apidocs/',
    },
    KUCOIN: {
      name: 'KuCoin',
      requiresPassphrase: true,
      features: ['Spot Trading', 'Futures', 'Margin Trading', 'Lending'],
      websocketSupport: true,
      documentation: 'https://docs.kucoin.com/',
    },
    BYBIT: {
      name: 'Bybit',
      requiresPassphrase: false,
      features: ['Spot Trading', 'Futures', 'Copy Trading'],
      websocketSupport: true,
      documentation: 'https://bybit-exchange.github.io/docs/',
    },
    COINBASE: {
      name: 'Coinbase Pro',
      requiresPassphrase: false,
      features: ['Spot Trading', 'Margin Trading'],
      websocketSupport: true,
      documentation: 'https://docs.cloud.coinbase.com/',
    },
    OKX: {
      name: 'OKX',
      requiresPassphrase: true,
      features: ['Spot Trading', 'Futures', 'Options', 'Grid Trading'],
      websocketSupport: true,
      documentation: 'https://www.okx.com/docs-v5/',
    },
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exchange_configs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading exchange configs:', error);
      toast.error('Failed to load exchange configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeSelect = (exchange: string) => {
    setSelectedExchange(exchange);
    const existingConfig = configs.find(c => c.id === exchange);
    if (existingConfig) {
      setFormData({
        apiKey: existingConfig.apiKey,
        apiSecret: existingConfig.apiSecret,
        passphrase: existingConfig.passphrase || '',
        testnet: existingConfig.testnet,
        enabled: existingConfig.enabled
      });
    } else {
      setFormData({
        apiKey: '',
        apiSecret: '',
        passphrase: '',
        testnet: false,
        enabled: true
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedExchange) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const configData = {
        user_id: user.id,
        exchange: selectedExchange,
        api_key: formData.apiKey,
        api_secret: formData.apiSecret,
        passphrase: formData.passphrase,
        testnet: formData.testnet,
        enabled: formData.enabled,
      };

      const { error } = await supabase
        .from('exchange_configs')
        .upsert([configData], {
          onConflict: 'exchange',
        });

      if (error) throw error;

      toast.success('Exchange configuration saved');
      loadConfigs();
    } catch (error) {
      console.error('Error saving exchange config:', error);
      toast.error('Failed to save exchange configuration');
    }
  };

  const handleTestConnection = async () => {
    try {
      if (!selectedExchange || !formData.apiKey || !formData.apiSecret) return;

      // Add appropriate API test calls based on the selected exchange
      switch (selectedExchange) {
        case 'BINANCE':
          // Test Binance connection
          break;
        case 'KUCOIN':
          // Test KuCoin connection
          break;
        // Add other exchanges
      }

      toast.success('API connection successful');
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error('API connection failed');
    }
  };

  if (loading) {
    return <div>Loading exchange configurations...</div>;
  }

  const selectedTemplate = selectedExchange ? exchangeTemplates[selectedExchange as keyof typeof exchangeTemplates] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exchange Configuration</CardTitle>
          <CardDescription>
            Configure your crypto exchange API credentials and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Exchange</Label>
            <Select value={selectedExchange} onValueChange={handleExchangeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select an exchange" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(exchangeTemplates).map(([id, exchange]) => (
                  <SelectItem key={id} value={id}>
                    {exchange.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                />
              </div>

              {selectedTemplate.requiresPassphrase && (
                <div className="space-y-2">
                  <Label>API Passphrase</Label>
                  <Input
                    type="password"
                    value={formData.passphrase}
                    onChange={(e) => setFormData({ ...formData, passphrase: e.target.value })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Use Testnet</Label>
                <Switch
                  checked={formData.testnet}
                  onCheckedChange={(checked) => setFormData({ ...formData, testnet: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Enable Exchange</Label>
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button onClick={handleSubmit}>Save Configuration</Button>
        </CardFooter>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name} Features</CardTitle>
            <CardDescription>
              Available trading features and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              {selectedTemplate.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href={selectedTemplate.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View API Documentation
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};