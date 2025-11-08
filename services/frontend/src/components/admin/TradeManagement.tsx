import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Select,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';

interface Trade {
  id: string;
  userId: string;
  user: {
    email: string;
  };
  marketType: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  commission: number;
  status: string;
  createdAt: string;
}

export default function TradeManagement() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [filter, setFilter] = useState('ALL');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trades`
      );
      setTrades(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem listesi alınamadı',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleTradeDetails = (trade: Trade) => {
    setSelectedTrade(trade);
    onOpen();
  };

  const filteredTrades = trades.filter((trade) => {
    if (filter === 'ALL') return true;
    return trade.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <Box mb={6}>
        <HStack spacing={4}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            width="200px"
          >
            <option value="ALL">Tüm İşlemler</option>
            <option value="COMPLETED">Tamamlananlar</option>
            <option value="PENDING">Bekleyenler</option>
            <option value="FAILED">Başarısızlar</option>
          </Select>
          <Button onClick={fetchTrades}>Yenile</Button>
        </HStack>
      </Box>

      <Box
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Kullanıcı</Th>
              <Th>Market</Th>
              <Th>Sembol</Th>
              <Th>Tip</Th>
              <Th>Miktar</Th>
              <Th>Fiyat</Th>
              <Th>Komisyon</Th>
              <Th>Durum</Th>
              <Th>Tarih</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTrades.map((trade) => (
              <Tr key={trade.id}>
                <Td>{trade.id.slice(0, 8)}...</Td>
                <Td>{trade.user.email}</Td>
                <Td>{trade.marketType}</Td>
                <Td>{trade.symbol}</Td>
                <Td>
                  <Badge
                    colorScheme={trade.type === 'BUY' ? 'green' : 'red'}
                  >
                    {trade.type}
                  </Badge>
                </Td>
                <Td>{trade.amount}</Td>
                <Td>{trade.price}</Td>
                <Td>{trade.commission} KK99</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(trade.status)}>
                    {trade.status}
                  </Badge>
                </Td>
                <Td>
                  {new Date(trade.createdAt).toLocaleDateString('tr-TR')}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => handleTradeDetails(trade)}
                  >
                    Detaylar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>İşlem Detayları</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTrade && (
              <VStack spacing={4} align="stretch" pb={6}>
                <Box>
                  <Text fontWeight="bold">İşlem ID:</Text>
                  <Text>{selectedTrade.id}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Kullanıcı:</Text>
                  <Text>{selectedTrade.user.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Market Tipi:</Text>
                  <Text>{selectedTrade.marketType}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Sembol:</Text>
                  <Text>{selectedTrade.symbol}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">İşlem Tipi:</Text>
                  <Badge
                    colorScheme={selectedTrade.type === 'BUY' ? 'green' : 'red'}
                  >
                    {selectedTrade.type}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Miktar:</Text>
                  <Text>{selectedTrade.amount}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Fiyat:</Text>
                  <Text>{selectedTrade.price}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Toplam Değer:</Text>
                  <Text>
                    {(selectedTrade.amount * selectedTrade.price).toFixed(2)}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Komisyon:</Text>
                  <Text>{selectedTrade.commission} KK99</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Durum:</Text>
                  <Badge colorScheme={getStatusColor(selectedTrade.status)}>
                    {selectedTrade.status}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Tarih:</Text>
                  <Text>
                    {new Date(selectedTrade.createdAt).toLocaleString('tr-TR')}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}