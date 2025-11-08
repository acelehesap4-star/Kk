import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { io } from 'socket.io-client';

interface OrderBookProps {
  market: string;
  symbol: string;
}

interface Order {
  price: number;
  amount: number;
  total: number;
}

const socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
  autoConnect: false
});

export default function OrderBook({ market, symbol }: OrderBookProps) {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    socket.connect();
    socket.emit('subscribe:orderbook', { market, symbol });

    socket.on('orderbook:update', (data: { bids: Order[]; asks: Order[] }) => {
      setBids(data.bids);
      setAsks(data.asks);
    });

    return () => {
      socket.disconnect();
    };
  }, [market, symbol]);

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Emir Defteri
      </Text>

      <Box overflowY="auto" maxHeight="400px">
        {/* Satış Emirleri */}
        <Table size="sm" mb={4}>
          <Thead>
            <Tr>
              <Th>Fiyat</Th>
              <Th isNumeric>Miktar</Th>
              <Th isNumeric>Toplam</Th>
            </Tr>
          </Thead>
          <Tbody>
            {asks.slice(0, 10).map((ask, index) => (
              <Tr key={index}>
                <Td color="red.400">{ask.price.toFixed(2)}</Td>
                <Td isNumeric>{ask.amount.toFixed(4)}</Td>
                <Td isNumeric>{ask.total.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Güncel Fiyat */}
        <Box textAlign="center" py={2}>
          <Text fontSize="xl" fontWeight="bold">
            {asks[0]?.price.toFixed(2) || '0.00'}
          </Text>
        </Box>

        {/* Alış Emirleri */}
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Fiyat</Th>
              <Th isNumeric>Miktar</Th>
              <Th isNumeric>Toplam</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bids.slice(0, 10).map((bid, index) => (
              <Tr key={index}>
                <Td color="green.400">{bid.price.toFixed(2)}</Td>
                <Td isNumeric>{bid.amount.toFixed(4)}</Td>
                <Td isNumeric>{bid.total.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}