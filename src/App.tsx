import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TradingProvider } from './context/trading-context';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trading-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TradingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Outlet />
          </TooltipProvider>
        </TradingProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
