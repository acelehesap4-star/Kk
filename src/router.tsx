import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/ui/loading-spinner';

const App = lazy(() => import('./App'));
const Auth = lazy(() => import('./pages/Auth'));
const Trading = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: 'auth',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Auth />
            </Suspense>
          ),
        },
        {
          path: 'trading',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Trading />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: '/Kk',
  }
);

export default router;