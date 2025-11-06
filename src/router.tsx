import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Fragment } from 'react';

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: <Fragment><App /></Fragment>,
    },
  ],
  {
    basename: '/B',
  }
);

export default router;