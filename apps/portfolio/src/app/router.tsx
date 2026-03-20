import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';

const Home = lazy(() => import('@/features/home/Home'));
const SalonApp = lazy(() => import('@zerovanity/routes'));
const CryptoApp = lazy(() => import('@crypto/routes'));
const EcommerceApp = lazy(() => import('@devops-shop/src/routes'));
const AnalyticsApp = lazy(() => import('@analytics/routes'));
const MediaApp = lazy(() => import('@zerodelay/App'));
const ReformsApp = lazy(() => import('@zero-chaos/routes'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Suspense fallback={<PageLoader text="Loading Home..." />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/zerovanity/*',
      element: (
        <Suspense fallback={<PageLoader text="Loading Salon App..." />}>
          <SalonApp />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/crypto/*',
      element: (
        <Suspense fallback={<PageLoader text="Opening Crypto Dashboard..." />}>
          <CryptoApp />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/ecommerce/*',
      element: (
        <Suspense fallback={<PageLoader text="Loading Shop..." />}>
          <EcommerceApp />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/analytics/*',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Analytics..." />}>
          <AnalyticsApp />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/zerodelay/*',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Zero Delay..." />}>
          <MediaApp />
        </Suspense>
      ),
    },
    {
      path: '/proyectos/zero-chaos/*',
      element: (
        <Suspense fallback={<PageLoader text="Abriendo Cero Caos..." />}>
          <ReformsApp />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  },
);

export function Router() {
  return <RouterProvider router={router} />;
}
