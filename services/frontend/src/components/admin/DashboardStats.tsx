import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';

interface DashboardData {
  userCount: number;
  totalTrades: number;
  totalVolume: number;
  totalCommission: number;
  kk99InCirculation: number;
}

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`
      );
      setData(data);
    } catch (error) {
      console.error('Dashboard verisi alınamadı:', error);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stat>
          <StatLabel>Toplam Kullanıcı</StatLabel>
          <StatNumber>{data.userCount}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stat>
          <StatLabel>Toplam İşlem Sayısı</StatLabel>
          <StatNumber>{data.totalTrades}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            9.05%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stat>
          <StatLabel>Toplam İşlem Hacmi</StatLabel>
          <StatNumber>${data.totalVolume.toLocaleString()}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            15.82%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stat>
          <StatLabel>Toplam Komisyon (KK99)</StatLabel>
          <StatNumber>{data.totalCommission.toLocaleString()} KK99</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            12.48%
          </StatHelpText>
        </Stat>
      </Box>

      <Box
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stat>
          <StatLabel>Dolaşımdaki KK99</StatLabel>
          <StatNumber>{data.kk99InCirculation.toLocaleString()} KK99</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            8.14%
          </StatHelpText>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}