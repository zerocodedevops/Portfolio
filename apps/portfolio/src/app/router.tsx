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
const ZeroBreakdownDemo = lazy(() => import('@/features/zero-breakdown/ZeroBreakdownDemo'));
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
      <aside className="mx-auto my-3 max-w-7xl rounded-xl border border-amber-500/40 bg-dark-950/95 px-4 py-3 text-sm leading-relaxed text-amber-100 shadow-xl" aria-label="Aviso de demostración">
        ZeroVanity es una demostración: todos los datos son simulados, incluidos servicios, precios, cifras, disponibilidad, garantías y credenciales. Las reservas y el panel de administración no son reales; no introduzcas información personal.
      </aside>
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
            <Suspense fallback={<PageLoader text="Abriendo Cero Caos..." />}>
              <>
                <aside className="mx-auto my-3 max-w-7xl border border-amber-500/50 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-slate-800" aria-label="Aviso de demostración">
                  ZeroChaos es una demostración: todos los datos son simulados, incluidos precios, proyectos de ejemplo, cifras, garantías, certificaciones y disponibilidad. El formulario no envía ni almacena datos. Los enlaces de correo abren tu aplicación; el mensaje solo se envía si lo confirmas allí.
                </aside>
                <ReformsApp />
              </>
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
