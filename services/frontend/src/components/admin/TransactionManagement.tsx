import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';

interface Transaction {
  id: string;
  userId: string;
  user: {
    email: string;
  };
  amount: number;
  currency: string;
  txHash: string;
  status: string;
  createdAt: string;
}

export default function TransactionManagement() {
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [txHash, setTxHash] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`
      );
      setDeposits(data.deposits);
      setWithdrawals(data.withdrawals);
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

  const handleApproveDeposit = async (id: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions/deposit/${id}/approve`
      );
      fetchTransactions();
      toast({
        title: 'Başarılı',
        description: 'Para yatırma işlemi onaylandı',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem onaylanamadı',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleApproveWithdrawal = async () => {
    if (!selectedTx || !txHash) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions/withdrawal/${selectedTx.id}/approve`,
        { txHash }
      );
      fetchTransactions();
      onClose();
      toast({
        title: 'Başarılı',
        description: 'Para çekme işlemi onaylandı',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem onaylanamadı',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleWithdrawalApproval = (tx: Transaction) => {
    setSelectedTx(tx);
    setTxHash('');
    onOpen();
  };

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
      <Tabs>
        <TabList mb={4}>
          <Tab>Para Yatırma</Tab>
          <Tab>Para Çekme</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
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
                    <Th>Miktar</Th>
                    <Th>Para Birimi</Th>
                    <Th>TX Hash</Th>
                    <Th>Durum</Th>
                    <Th>Tarih</Th>
                    <Th>İşlemler</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {deposits.map((tx) => (
                    <Tr key={tx.id}>
                      <Td>{tx.id.slice(0, 8)}...</Td>
                      <Td>{tx.user.email}</Td>
                      <Td>{tx.amount}</Td>
                      <Td>{tx.currency}</Td>
                      <Td>{tx.txHash.slice(0, 8)}...</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </Td>
                      <Td>
                        {new Date(tx.createdAt).toLocaleDateString('tr-TR')}
                      </Td>
                      <Td>
                        {tx.status === 'PENDING' && (
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleApproveDeposit(tx.id)}
                          >
                            Onayla
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          <TabPanel p={0}>
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
                    <Th>Miktar</Th>
                    <Th>Para Birimi</Th>
                    <Th>Adres</Th>
                    <Th>Durum</Th>
                    <Th>Tarih</Th>
                    <Th>İşlemler</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {withdrawals.map((tx) => (
                    <Tr key={tx.id}>
                      <Td>{tx.id.slice(0, 8)}...</Td>
                      <Td>{tx.user.email}</Td>
                      <Td>{tx.amount}</Td>
                      <Td>{tx.currency}</Td>
                      <Td>{tx.txHash ? tx.txHash.slice(0, 8) + '...' : '-'}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </Td>
                      <Td>
                        {new Date(tx.createdAt).toLocaleDateString('tr-TR')}
                      </Td>
                      <Td>
                        {tx.status === 'PENDING' && (
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleWithdrawalApproval(tx)}
                          >
                            Onayla
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Para Çekme Onayı</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTx && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Kullanıcı:</Text>
                  <Text>{selectedTx.user.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Miktar:</Text>
                  <Text>
                    {selectedTx.amount} {selectedTx.currency}
                  </Text>
                </Box>
                <FormControl>
                  <FormLabel>İşlem Hash</FormLabel>
                  <Input
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="İşlem hash'ini girin"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              İptal
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApproveWithdrawal}
              isDisabled={!txHash}
            >
              Onayla
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}