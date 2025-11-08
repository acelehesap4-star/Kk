import { QueryClient, QueryClientProvider } from '@tanstack/react-query';import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { Outlet } from 'react-router-dom';import { Toaster } from "@/components/ui/toaster";

import { Toaster } from 'sonner';import { Toaster as Sonner } from "@/components/ui/sonner";

import { ThemeProvider } from '@/components/theme-provider';import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();import { TradingProvider } from './context/trading-context';

import { ThemeProvider } from '@/components/ui/ThemeProvider';

function App() {import { useAuth } from './hooks/use-auth';

  return (import { useEffect } from 'react';

    <ThemeProvider defaultTheme="dark" storageKey="kk-theme">import { UserNav } from './components/navigation/user-nav';

      <QueryClientProvider client={queryClient}>import { MainNav } from './components/navigation/main-nav';

        <main className="min-h-screen bg-background antialiased">

          <Outlet />const queryClient = new QueryClient();

        </main>

        <Toaster richColors position="top-right" />const AppContent = () => {

      </QueryClientProvider>  const { currentUser, loading } = useAuth();

    </ThemeProvider>  const navigate = useNavigate();

  );  const location = useLocation();

}

  useEffect(() => {

export default App;    if (!loading && !currentUser && !location.pathname.startsWith('/auth')) {
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
  const location = useLocation();
  const showNav = !location.pathname.includes('/auth');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="trading-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TradingProvider>
          <TooltipProvider>
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
              <main className="container mx-auto py-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <Outlet />
                </Suspense>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </TradingProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );

export default App;
