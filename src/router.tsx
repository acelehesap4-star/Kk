import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/ui/loading-spinner';

const App = lazy(() => import('./App'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TradingTerminal = lazy(() => import('./pages/TradingTerminal'));
const Wallet = lazy(() => import('./pages/Wallet'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const LegacyTrading = lazy(() => import('./pages/Index'));

const router = createBrowserRouter(
  [
    {
      path: '/profile',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <UserDashboard />
        </Suspense>
      ),
    },
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
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
          <App />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <LegacyTrading />
            </Suspense>
          ),
        }
      ],
    },
  ],
  {
    basename: '/Kk',
  }
);

export default router;