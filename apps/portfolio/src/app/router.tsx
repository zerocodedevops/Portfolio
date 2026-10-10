import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';
import { RootErrorPage } from '@/components/RootErrorPage';
import { Seo } from '@/components/common/SEO';

const Home = lazy(() => import('@/features/home/Home'));
const Pricing = lazy(() => import('@/features/pricing/Pricing'));
const SalonApp = lazy(() => import('@zerovanity/routes'));
const MediaApp = lazy(() => import('@zerodelay/App'));
const ReformsApp = lazy(() => import('@zero-chaos/routes'));
const CaseStudy = lazy(() => import('@/features/projects/CaseStudy'));
const LegalNoticePage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.LegalNoticePage })));
const PrivacyPolicyPage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.PrivacyPolicyPage })));
const CookiesPolicyPage = lazy(() => import('@/features/legal/LegalPages').then((module) => ({ default: module.CookiesPolicyPage })));

function VanityDemoApp() {
  return (
    <>
      <Seo
        title="Demo de web para peluquería y estética | ZeroVanity"
        description="Explora ZeroVanity, una demo interactiva de una web para peluquería y estética. Recorrido de reserva simulado, sin conexión a base de datos ni almacenamiento de información."
        url="https://zerocode-devops.com/proyectos/zerovanity"
      />
      <SalonApp />
      <details className="fixed bottom-4 right-4 z-[100] max-w-xs rounded-xl border border-amber-500/40 bg-dark-950/95 text-amber-100 shadow-xl">
        <summary className="cursor-pointer px-4 py-2 text-sm font-semibold">
          ZeroVanity · Demo
        </summary>
        <p className="px-4 pb-3 text-xs leading-relaxed">
          Recorrido de demostración con datos ficticios. No se conecta a una base de datos ni guarda información.
        </p>
      </details>
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
          element: (
            <Suspense fallback={<PageLoader text="Consultando Precios..." />}>
              <Pricing />
            </Suspense>
          ),
        },
        {
          path: 'proyectos/zerovanity/*',
          element: (
            <Suspense fallback={<PageLoader text="Abriendo demo ZeroVanity..." />}>
              <VanityDemoApp />
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
            <Suspense fallback={<PageLoader text="Abriendo Cero Caos..." />}>
              <ReformsApp />
            </Suspense>
          ),
        },
        {
          path: 'casos-de-exito/:slug',
          element: (
            <Suspense fallback={<PageLoader text="Cargando Caso de Estudio..." />}>
              <CaseStudy />
            </Suspense>
          ),
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
