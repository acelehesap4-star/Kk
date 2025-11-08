import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import Layout from '@/components/Layout';
import TradingViewWidget from '@/components/TradingViewWidget';
import OrderBook from '@/components/trading/OrderBook';
import TradeForm from '@/components/trading/TradeForm';
import MarketInfo from '@/components/trading/MarketInfo';
import { useAuth } from '@/contexts/AuthContext';

const socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
  autoConnect: false
});

export default function Trading() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [market, setMarket] = useState('CRYPTO');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // WebSocket bağlantısı
    socket.connect();
    socket.emit('subscribe', [market]);

    socket.on('market:update', (data) => {
      setMarketData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, market, router]);

  const handleMarketChange = (market: string) => {
    setMarket(market);
    // Market değiştiğinde varsayılan sembolleri ayarla
    switch (market) {
      case 'CRYPTO':
        setSymbol('BTC/USDT');
        break;
      case 'FOREX':
        setSymbol('EUR/USD');
        break;
      case 'STOCKS':
        setSymbol('AAPL');
        break;
    }
  };

  const handleTrade = async (order: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trades/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...order,
          marketType: market,
          symbol
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'İşlem başarılı',
          description: 'Emiriniz başarıyla gerçekleştirildi',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'İşlem başarısız',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Tabs onChange={(index) => handleMarketChange(['CRYPTO', 'FOREX', 'STOCKS'][index])}>
          <TabList mb={4}>
            <Tab>Kripto</Tab>
            <Tab>Forex</Tab>
            <Tab>Hisse Senetleri</Tab>
          </TabList>

          <TabPanels>
            {['CRYPTO', 'FOREX', 'STOCKS'].map((marketType) => (
              <TabPanel key={marketType} p={0}>
                <Grid
                  templateColumns={{ base: '1fr', lg: '3fr 1fr' }}
                  gap={8}
                >
                  <Box>
                    {/* TradingView Grafik */}
                    <Box height="600px" mb={8}>
                      <TradingViewWidget
                        symbol={symbol}
                        market={marketType}
                      />
                    </Box>

                    {/* Market Bilgileri */}
                    <MarketInfo
                      market={marketType}
                      symbol={symbol}
                      data={marketData}
                    />
                  </Box>

                  <Box>
                    {/* Alım-Satım Formu */}
                    <TradeForm
                      market={marketType}
                      symbol={symbol}
                      onTrade={handleTrade}
                    />

                    {/* Emir Defteri */}
                    <OrderBook
                      market={marketType}
                      symbol={symbol}
                    />
                  </Box>
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
}