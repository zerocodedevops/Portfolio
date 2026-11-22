import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';
import { RootErrorPage } from '@/components/RootErrorPage';
import { Seo } from '@/components/common/SEO';

const Home = lazy(() => import('@/features/home/Home'));
const SalonApp = lazy(() => import('@zerovanity/routes'));
const MediaApp = lazy(() => import('@zerodelay/App'));
const ReformsApp = lazy(() => import('@zero-chaos/routes'));
const ZeroShopApp = lazy(() => import('@zeroshop/App'));
const ZeroBreakdownDemo = lazy(() => import('@/features/zero-breakdown/ZeroBreakdownDemo'));
const LegalNoticePage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.LegalNoticePage })));
const PrivacyPolicyPage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.PrivacyPolicyPage })));
const CookiesPolicyPage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.CookiesPolicyPage })));

function VanityDemoApp() {
  return (
    <>
      <Seo
        title="Demo de web para peluquería y estética | Zero Vanity"
        description="Explora Zero Vanity, una demo interactiva de una web para peluquería y estética. Recorrido de reserva simulado, sin conexión a base de datos ni almacenamiento de información."
        url="https://zerocode-devops.com/proyectos/zerovanity"
      />
      <SalonApp />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <RootErrorPage />,
      children: [
        { path: 'aviso-legal', element: <Suspense fallback={<PageLoader text="Cargando aviso legal..." />}><LegalNoticePage /></Suspense> },
        { path: 'politica-de-privacidad', element: <Suspense fallback={<PageLoader text="Cargando privacidad..." />}><PrivacyPolicyPage /></Suspense> },
        { path: 'politica-de-cookies', element: <Suspense fallback={<PageLoader text="Cargando cookies..." />}><CookiesPolicyPage /></Suspense> },
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader text="Cargando..." />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: 'portfolio',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'desarrollo-web-pymes-madrid',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'disenador-web-freelance-madrid',
          element: <Navigate to="/#sobre-mi" replace />,
        },
        {
          path: 'precios-paginas-web',
          element: <Navigate to="/#tarifas" replace />,
        },
        {
          path: 'proyectos/zerovanity/*',
          element: (
            <Suspense fallback={<PageLoader text="Abriendo demo Zero Vanity..." />}>
              <VanityDemoApp />
            </Suspense>
          ),
        },
        {
          path: 'proyectos/zeroshop/*',
          element: (
            <Suspense fallback={<PageLoader text="Abriendo demo Zero Shop..." />}>
              <>
                <Seo
                  title="Demo de catálogo interactivo | Zero Shop"
                  description="Explora Zero Shop, una demo interactiva con catálogo filtrable, búsqueda por voz y flujo simulado."
                  url="https://zerocode-devops.com/proyectos/zeroshop"
                />
                <ZeroShopApp />
              </>
            </Suspense>
          ),
        },
        {
          path: 'proyectos/zero-breakdown/*',
          element: (
            <Suspense fallback={<PageLoader text="Abriendo demo Zero Breakdown..." />}>
              <ZeroBreakdownDemo />
            </Suspense>
          ),
        },
        {
          path: 'proyectos/crypto/*',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'proyectos/analytics/*',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'proyectos/zerodelay/*',
          element: (
            <Suspense fallback={<PageLoader text="Cargando Zero Delay..." />}>
              <MediaApp />
            </Suspense>
          ),
        },
        {
          path: 'proyectos/zero-chaos/*',
          element: (
            <Suspense fallback={<PageLoader text="Abriendo Zero Chaos..." />}>
              <ReformsApp />
            </Suspense>
          ),
        },
        {
          path: 'casos-de-exito/reformas-zerochaos',
          element: <Navigate to="/proyectos/zero-chaos" replace />,
        },
        {
          path: 'casos-de-exito/mudanzas-zerodelay',
          element: <Navigate to="/proyectos/zerodelay" replace />,
        },
        {
          path: 'tech',
          element: <Navigate to="/" replace />,
        },
        {
          path: 'blog/:id',
          element: <Navigate to="/" replace />,
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
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
