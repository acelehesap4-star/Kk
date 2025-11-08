import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  return (
    <Box minH="100vh">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        px={4}
        boxShadow="sm"
        position="fixed"
        width="100%"
        zIndex="sticky"
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems="center">
              <NextLink href="/" passHref>
                <Link
                  fontSize="2xl"
                  fontWeight="bold"
                  _hover={{ textDecoration: 'none' }}
                >
                  KK Trading
                </Link>
              </NextLink>
              <HStack
                as="nav"
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
              >
                <NextLink href="/markets" passHref>
                  <Link>Piyasalar</Link>
                </NextLink>
                <NextLink href="/trading" passHref>
                  <Link>Trading</Link>
                </NextLink>
                <NextLink href="/kk99" passHref>
                  <Link>KK99 Token</Link>
                </NextLink>
              </HStack>
            </HStack>

            <Flex alignItems="center">
              <Button onClick={toggleColorMode} mr={4}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Text>{user.email}</Text>
                  </MenuButton>
                  <MenuList>
                    <NextLink href="/dashboard" passHref>
                      <MenuItem as="a">Dashboard</MenuItem>
                    </NextLink>
                    <NextLink href="/profile" passHref>
                      <MenuItem as="a">Profil</MenuItem>
                    </NextLink>
                    <NextLink href="/wallet" passHref>
                      <MenuItem as="a">Cüzdan</MenuItem>
                    </NextLink>
                    {user.role === 'ADMIN' && (
                      <>
                        <MenuDivider />
                        <NextLink href="/admin" passHref>
                          <MenuItem as="a">Admin Panel</MenuItem>
                        </NextLink>
                      </>
                    )}
                    <MenuDivider />
                    <MenuItem onClick={logout}>Çıkış Yap</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Stack
                  flex={{ base: 1, md: 0 }}
                  justify="flex-end"
                  direction="row"
                  spacing={6}
                >
                  <NextLink href="/login" passHref>
                    <Button as="a" fontSize="sm" fontWeight={400}>
                      Giriş Yap
                    </Button>
                  </NextLink>
                  <NextLink href="/register" passHref>
                    <Button
                      as="a"
                      display={{ base: 'none', md: 'inline-flex' }}
                      fontSize="sm"
                      fontWeight={600}
                      color="white"
                      bg="blue.400"
                      _hover={{
                        bg: 'blue.300',
                      }}
                    >
                      Kayıt Ol
                    </Button>
                  </NextLink>
                </Stack>
              )}
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as="nav" spacing={4}>
                <NextLink href="/markets" passHref>
                  <Link>Piyasalar</Link>
                </NextLink>
                <NextLink href="/trading" passHref>
                  <Link>Trading</Link>
                </NextLink>
                <NextLink href="/kk99" passHref>
                  <Link>KK99 Token</Link>
                </NextLink>
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>

      <Box pt={16}>
        {children}
      </Box>

      <Box
        as="footer"
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        mt="auto"
      >
        <Container
          as={Stack}
          maxW="container.xl"
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>© 2025 KK Trading. Tüm hakları saklıdır.</Text>
        </Container>
      </Box>
    </Box>
  );
}