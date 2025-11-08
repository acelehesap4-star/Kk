import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TradingProvider } from './context/trading-context';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { useAuth } from './hooks/use-auth';
import { useEffect } from 'react';
import { UserNav } from './components/navigation/user-nav';
import { MainNav } from './components/navigation/main-nav';

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser && !location.pathname.startsWith('/auth')) {
      navigate('/auth');
    }
  }, [currentUser, loading, navigate, location]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  const showNav = currentUser && !location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-background">
      {showNav && (
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trading-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TradingProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </TradingProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
