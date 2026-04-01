import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PageLoader } from '@/components/ui/PageLoader';

const Home = lazy(() => import('@/features/home/Home'));
const PymesService = lazy(() => import('@/features/services/PymesService'));
const Pricing = lazy(() => import('@/features/pricing/Pricing'));
const SalonApp = lazy(() => import('@zerovanity/routes'));
const CryptoApp = lazy(() => import('@crypto/routes'));
const EcommerceApp = lazy(() => import('@devops-shop/src/routes'));
const AnalyticsApp = lazy(() => import('@analytics/routes'));
const MediaApp = lazy(() => import('@zerodelay/App'));
const ReformsApp = lazy(() => import('@zero-chaos/routes'));
const CaseStudy = lazy(() => import('@/features/projects/CaseStudy'));
const TechBlog = lazy(() => import('@/features/blog/TechBlog'));
<<<<<<< HEAD
const BlogPost = lazy(() => import('@/features/blog/BlogPost'));
=======
>>>>>>> 605311ad28871f19e42fddd05b1259e9ad95b7c3

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Suspense fallback={<PageLoader text="Cargando..." />}>
          <PymesService />
        </Suspense>
      ),
    },
    {
      path: '/portfolio',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Portfolio..." />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: '/desarrollo-web-pymes-madrid',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Servicios..." />}>
          <PymesService />
        </Suspense>
      ),
    },
    {
      path: '/disenador-web-freelance-madrid',
      element: (
        <Suspense fallback={<PageLoader text="Sobre Mí..." />}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: '/precios-paginas-web',
      element: (
        <Suspense fallback={<PageLoader text="Consultando Precios..." />}>
          <Pricing />
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
    {
      path: '/casos-de-exito/:slug',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Caso de Estudio..." />}>
          <CaseStudy />
        </Suspense>
      ),
    },
    {
      path: '/tech',
      element: (
        <Suspense fallback={<PageLoader text="Cargando Laboratorio Técnico..." />}>
          <TechBlog />
        </Suspense>
      ),
    },
<<<<<<< HEAD
    {
      path: '/blog/:id',
      element: (
        <Suspense fallback={<PageLoader text="Abriendo artículo..." />}>
          <BlogPost />
        </Suspense>
      ),
    },
=======
>>>>>>> 605311ad28871f19e42fddd05b1259e9ad95b7c3
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
