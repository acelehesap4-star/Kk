import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/admin/DashboardStats';
import UserManagement from '@/components/admin/UserManagement';
import TradeManagement from '@/components/admin/TradeManagement';
import TransactionManagement from '@/components/admin/TransactionManagement';
import SystemMetrics from '@/components/admin/SystemMetrics';

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      toast({
        title: 'Yetkisiz Erişim',
        description: 'Bu sayfaya erişim yetkiniz bulunmamaktadır.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      router.push('/');
    }
  }, [user, router, toast]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <Heading as="h1" size="xl" mb={8}>
          Yönetim Paneli
        </Heading>

        <Tabs isLazy>
          <TabList mb={8}>
            <Tab>Dashboard</Tab>
            <Tab>Kullanıcılar</Tab>
            <Tab>İşlemler</Tab>
            <Tab>Para Transferleri</Tab>
            <Tab>Sistem Metrikleri</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <DashboardStats />
            </TabPanel>

            <TabPanel>
              <UserManagement />
            </TabPanel>

            <TabPanel>
              <TradeManagement />
            </TabPanel>

            <TabPanel>
              <TransactionManagement />
            </TabPanel>

            <TabPanel>
              <SystemMetrics />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
}