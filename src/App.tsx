import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { TradingProvider } from './context/trading-context';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import AdvancedErrorBoundary from '@/components/ui/AdvancedErrorBoundary';
import { config } from './lib/web3-config';

const queryClient = new QueryClient();

const App = () => {
  return (
    <AdvancedErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="trading-ui-theme">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <TradingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Outlet />
              </TooltipProvider>
            </TradingProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </AdvancedErrorBoundary>
  );
};

export default App;
