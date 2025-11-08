import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Switch,
  useToast,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  role: string;
  kk99Balance: number;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`
      );
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı listesi alınamadı',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleVerificationChange = async (userId: string, isVerified: boolean) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
        { isVerified }
      );
      fetchUsers();
      toast({
        title: 'Başarılı',
        description: 'Kullanıcı durumu güncellendi',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı durumu güncellenemedi',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleUserDetails = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <>
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
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>KK99 Bakiye</Th>
              <Th>Kayıt Tarihi</Th>
              <Th>Doğrulama</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    colorScheme={user.role === 'ADMIN' ? 'red' : 'green'}
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>{user.kk99Balance} KK99</Td>
                <Td>
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </Td>
                <Td>
                  <Switch
                    isChecked={user.isVerified}
                    onChange={(e) =>
                      handleVerificationChange(user.id, e.target.checked)
                    }
                  />
                </Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => handleUserDetails(user)}
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
          <ModalHeader>Kullanıcı Detayları</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch" pb={6}>
                <Box>
                  <Text fontWeight="bold">Kullanıcı ID:</Text>
                  <Text>{selectedUser.id}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedUser.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Rol:</Text>
                  <Badge colorScheme={selectedUser.role === 'ADMIN' ? 'red' : 'green'}>
                    {selectedUser.role}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">KK99 Bakiye:</Text>
                  <Text>{selectedUser.kk99Balance} KK99</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Kayıt Tarihi:</Text>
                  <Text>
                    {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Doğrulama Durumu:</Text>
                  <Badge colorScheme={selectedUser.isVerified ? 'green' : 'red'}>
                    {selectedUser.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                  </Badge>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}