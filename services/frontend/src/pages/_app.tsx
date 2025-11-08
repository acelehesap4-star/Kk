import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import theme from '@/theme';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;