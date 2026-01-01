import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('@/features/home/Home'));

const router = createHashRouter([
  { 
    path: '/', 
    element: (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-dark-950 text-dark-400">Cargando…</div>}>
        <Home />
      </Suspense>
    ) 
  },
]);

export function Router() { 
  return <RouterProvider router={router} />; 
}
