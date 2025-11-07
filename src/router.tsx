import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/ui/loading-spinner';

const App = lazy(() => import('./App'));
const Trading = lazy(() => import('./pages/Index'));

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
          index: true,
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Trading />
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