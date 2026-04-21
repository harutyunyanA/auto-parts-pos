import { createBrowserRouter, Navigate } from 'react-router-dom';
import UserSelection from '../pages/Auth/UserSelection';
import MainLayout from '../layouts/MainLayout';
import SourceGuard from '../components/SourceGuard';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Sales from '../pages/Sales';

export const router = createBrowserRouter([
  {
    path: '/selection',
    element: <UserSelection />,
  },
  {
    path: '/',
    element: <SourceGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'products',
            element: <Products />,
          },
          {
            path: 'sales',
            element: <Sales />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
