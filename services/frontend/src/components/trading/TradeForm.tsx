import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';

interface TradeFormProps {
  market: string;
  symbol: string;
  onTrade: (order: any) => Promise<void>;
}

export default function TradeForm({ market, symbol, onTrade }: TradeFormProps) {
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onTrade({
        type,
        amount: parseFloat(amount),
        price: parseFloat(price)
      });

      setAmount('');
      setPrice('');
    } catch (error: any) {
      toast({
        title: 'İşlem Hatası',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mb={8}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold" alignSelf="start">
            {symbol} İşlem Formu
          </Text>

          <RadioGroup value={type} onChange={(value: 'BUY' | 'SELL') => setType(value)}>
            <Stack direction="row" spacing={4}>
              <Radio
                value="BUY"
                colorScheme="green"
                size="lg"
              >
                Alış
              </Radio>
              <Radio
                value="SELL"
                colorScheme="red"
                size="lg"
              >
                Satış
              </Radio>
            </Stack>
          </RadioGroup>

          <FormControl>
            <FormLabel>Miktar</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="İşlem miktarı"
              />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Fiyat</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="İşlem fiyatı"
              />
            </NumberInput>
          </FormControl>

          <Text fontSize="sm" color="gray.500">
            Toplam: {amount && price ? (parseFloat(amount) * parseFloat(price)).toFixed(2) : '0.00'}
          </Text>

          <Text fontSize="sm" color="gray.500">
            Komisyon: {amount && price ? (parseFloat(amount) * parseFloat(price) * 0.002).toFixed(2)} KK99
          </Text>

          <Button
            type="submit"
            colorScheme={type === 'BUY' ? 'green' : 'red'}
            width="full"
            isLoading={loading}
          >
            {type === 'BUY' ? 'Satın Al' : 'Sat'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}