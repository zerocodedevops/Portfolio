import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('@/features/home/Home'));
const BlogPost = lazy(() => import('@/features/blog/BlogPost'));
const EcommerceApp = lazy(() => import('@/features/projects/ecommerce/routes'));
const NotFound = lazy(() => import('@/features/misc/NotFound'));

const router = createHashRouter([
  { 
    path: '/', 
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-400">Cargando…</div>}>
        <Home />
      </Suspense>
    ) 
  },
  {
    path: '/proyectos/ecommerce/*',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">Cargando Tienda...</div>}>
        <EcommerceApp />
      </Suspense>
    )
  },
  { 
    path: '/blog/:id', 
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-400">Cargando…</div>}>
        <BlogPost />
      </Suspense>
    ) 
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-400">Cargando…</div>}>
        <NotFound />
      </Suspense>
    )
  }
], {
  future: {
    v7_startTransition: true,
  }
});

export function Router() { 
  return <RouterProvider router={router} />; 
}
