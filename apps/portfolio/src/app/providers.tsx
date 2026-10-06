import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '@/lib/queryClient';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              Loading...
            </div>
          }
        >
          {children}
        </Suspense>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
