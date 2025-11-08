import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from './App';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { AuthPage } from './pages/AuthPage';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TradingTerminal = lazy(() => import('./pages/TradingTerminal'));
const Wallet = lazy(() => import('./pages/Wallet'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const LegacyTrading = lazy(() => import('./pages/Index'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: '/auth',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthPage />
          </Suspense>
        ),
      },
      {
        path: '/profile',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserDashboard />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: '/trading/:exchange',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TradingTerminal />
          </Suspense>
        ),
      },
      {
        path: '/wallet',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Wallet />
          </Suspense>
        ),
      },
      {
        path: '/admin',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPanel user={{ id: '1', email: 'admin@example.com', role: 'admin' }} />
          </Suspense>
        ),
      },
      {
        path: '/legacy',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LegacyTrading />
          </Suspense>
        ),
      }
    ]
  }
], {
  basename: '/Kk'
});

export default router;
