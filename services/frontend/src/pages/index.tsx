import { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  useColorModeValue,
  VStack,
  SimpleGrid,
  Icon,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaBitcoin, FaChartLine, FaExchangeAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const features = [
    {
      icon: FaBitcoin,
      title: 'Kripto Piyasaları',
      description: 'Bitcoin, Ethereum ve diğer kripto paralar için spot ve türev işlemleri'
    },
    {
      icon: FaExchangeAlt,
      title: 'Forex Trading',
      description: 'Major ve minor para birimlerinde forex işlemleri'
    },
    {
      icon: FaChartLine,
      title: 'Hisse Senetleri',
      description: 'Global hisse senedi piyasalarında alım-satım'
    }
  ];

  return (
    <Layout>
      <Box as="main">
        {/* Hero Section */}
        <Box
          bgGradient={bgGradient}
          color="white"
          py={20}
          px={4}
          textAlign="center"
        >
          <Container maxW="container.xl">
            <Heading
              as="h1"
              size="2xl"
              mb={6}
              bgGradient="linear(to-r, white, gray.200)"
              bgClip="text"
            >
              Tüm Piyasalar Tek Platformda
            </Heading>
            <Text fontSize="xl" mb={8} maxW="2xl" mx="auto">
              Kripto, Forex ve Hisse Senedi piyasalarında güvenli ve hızlı trading deneyimi
            </Text>
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              onClick={() => router.push('/register')}
              mr={4}
            >
              Hemen Başla
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="whiteAlpha"
              onClick={() => router.push('/login')}
            >
              Giriş Yap
            </Button>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxW="container.xl" py={20}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {features.map((feature, index) => (
              <VStack
                key={index}
                align="center"
                p={8}
                borderRadius="lg"
                boxShadow="lg"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <Icon as={feature.icon} w={12} h={12} color="blue.500" mb={4} />
                <Heading as="h3" size="lg" mb={4}>
                  {feature.title}
                </Heading>
                <Text textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                  {feature.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>

        {/* KK99 Token Section */}
        <Box bg={useColorModeValue('gray.50', 'gray.800')} py={20}>
          <Container maxW="container.xl">
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10}>
              <Box>
                <Heading as="h2" size="xl" mb={6}>
                  KK99 Token İle Trading
                </Heading>
                <Text fontSize="lg" mb={6}>
                  Platform'un yerel token'ı KK99 ile trading işlemlerinizi gerçekleştirin ve
                  avantajlardan yararlanın.
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => router.push('/kk99')}
                >
                  KK99 Hakkında
                </Button>
              </Box>
              <Box>
                {/* KK99 Token Stats or Chart Component */}
              </Box>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}