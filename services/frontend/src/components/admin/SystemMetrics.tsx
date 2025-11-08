import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface Metrics {
  dailyTrades: any[];
  dailyVolume: any[];
  newUsers: any[];
  activeUsers: any[];
}

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/metrics`
      );
      setMetrics(data);
    } catch (error) {
      console.error('Metrikler alınamadı:', error);
    }
  };

  if (!metrics) {
    return null;
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
      {/* Günlük İşlem Sayısı */}
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={6}>
          Günlük İşlem Sayısı
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.dailyTrades}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              name="İşlem Sayısı"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Günlük İşlem Hacmi */}
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={6}>
          Günlük İşlem Hacmi
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.dailyVolume}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#82ca9d"
              name="İşlem Hacmi ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Yeni Kullanıcılar */}
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={6}>
          Yeni Kullanıcılar
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.newUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ffc658"
              name="Yeni Kullanıcı Sayısı"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Aktif Kullanıcılar */}
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={6}>
          Aktif Kullanıcılar
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.activeUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ff7300"
              name="Aktif Kullanıcı Sayısı"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </SimpleGrid>
  );
}