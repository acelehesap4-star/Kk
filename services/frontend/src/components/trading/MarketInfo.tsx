import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue
} from '@chakra-ui/react';

interface MarketInfoProps {
  market: string;
  symbol: string;
  data: {
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
  } | null;
}

export default function MarketInfo({ market, symbol, data }: MarketInfoProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <Stat>
          <StatLabel>Son Fiyat</StatLabel>
          <StatNumber>{data?.price?.toFixed(2) || '0.00'}</StatNumber>
          <StatHelpText>
            <StatArrow
              type={data?.change24h && data.change24h > 0 ? 'increase' : 'decrease'}
            />
            {data?.change24h?.toFixed(2)}%
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>24s Yüksek</StatLabel>
          <StatNumber>{data?.high24h?.toFixed(2) || '0.00'}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>24s Düşük</StatLabel>
          <StatNumber>{data?.low24h?.toFixed(2) || '0.00'}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>24s Hacim</StatLabel>
          <StatNumber>{data?.volume24h?.toFixed(2) || '0.00'}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Market</StatLabel>
          <StatNumber>{market}</StatNumber>
          <StatHelpText>{symbol}</StatHelpText>
        </Stat>
      </Grid>
    </Box>
  );
}