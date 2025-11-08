import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FaWallet, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import Layout from '@/components/Layout';

export default function KK99Token() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading as="h1" size="2xl">
            KK99 Token
          </Heading>
          <Text fontSize="xl" maxW="2xl">
            KK99, platforma özel bir komisyon token'ıdır. Tüm işlem komisyonları
            KK99 token ile ödenir ve sahiplerine özel avantajlar sunar.
          </Text>
        </VStack>

        {/* Token Özellikleri */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16}>
          <Box
            p={8}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Icon as={FaWallet} w={10} h={10} color="blue.500" mb={4} />
            <Heading as="h3" size="lg" mb={4}>
              Platform Tokeni
            </Heading>
            <Text>
              KK99, tüm işlem komisyonlarının ödendiği platformun yerel tokenidir.
            </Text>
          </Box>

          <Box
            p={8}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Icon as={FaExchangeAlt} w={10} h={10} color="blue.500" mb={4} />
            <Heading as="h3" size="lg" mb={4}>
              İşlem Komisyonları
            </Heading>
            <Text>
              Tüm alım-satım işlemlerinin %0.2'lik komisyonu KK99 ile tahsil edilir.
            </Text>
          </Box>

          <Box
            p={8}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Icon as={FaChartLine} w={10} h={10} color="blue.500" mb={4} />
            <Heading as="h3" size="lg" mb={4}>
              Değer Artışı
            </Heading>
            <Text>
              Platform büyüdükçe KK99'a olan talep artar ve değeri yükselir.
            </Text>
          </Box>
        </SimpleGrid>

        {/* Token Bilgileri */}
        <Box
          mb={16}
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="xl" mb={8}>
            Token Detayları
          </Heading>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Th>Token Adı</Th>
                <Td>KK99 Token</Td>
              </Tr>
              <Tr>
                <Th>Kontrat Adresi</Th>
                <Td>{process.env.NEXT_PUBLIC_KK99_CONTRACT_ADDRESS}</Td>
              </Tr>
              <Tr>
                <Th>Platform</Th>
                <Td>Ethereum (ERC-20)</Td>
              </Tr>
              <Tr>
                <Th>Toplam Arz</Th>
                <Td>1,000,000 KK99</Td>
              </Tr>
              <Tr>
                <Th>Dolaşımdaki Arz</Th>
                <Td>100,000 KK99</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        {/* Token Alma Kılavuzu */}
        <Box
          mb={16}
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="xl" mb={8}>
            KK99 Token Nasıl Alınır?
          </Heading>

          <VStack spacing={6} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Önemli Not</AlertTitle>
                <AlertDescription>
                  KK99 token almak için aşağıdaki soğuk cüzdanlara transfer yapabilirsiniz:
                </AlertDescription>
              </Box>
            </Alert>

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Blockchain</Th>
                  <Th>Cüzdan Adresi</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Ethereum (ETH)</Td>
                  <Td>0x163c9a2fa9eaf8ebc5bb5b8f8e916eb8f24230a1</Td>
                </Tr>
                <Tr>
                  <Td>Solana (SOL)</Td>
                  <Td>Gp4itYBqqkNRNYtC22QAPyTThPB6Kzx8M1yy2rpXBGxbc</Td>
                </Tr>
                <Tr>
                  <Td>Tron (TRX)</Td>
                  <Td>THbevzbdxMmUNaN3XFWPkaJe8oSq2C2739</Td>
                </Tr>
                <Tr>
                  <Td>Bitcoin (BTC)</Td>
                  <Td>bc1pzmdep9lzgzswy0nmepvwmexj286kufcfwjfy4fd6dwuedzltntxse9xmz8</Td>
                </Tr>
              </Tbody>
            </Table>

            <Text>
              Transfer işleminizi gerçekleştirdikten sonra, işlem hash'ini platforma
              girerek KK99 tokenlarınızı hesabınıza aktarabilirsiniz.
            </Text>

            <Button colorScheme="blue" size="lg">
              Token Al
            </Button>
          </VStack>
        </Box>
      </Container>
    </Layout>
  );
}