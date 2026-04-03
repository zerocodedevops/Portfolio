import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RootErrorPage() {
  const error = useRouteError();
  console.error('Router caught an error:', error);

  let title = 'Algo salió mal';
  let message = 'Lo sentimos, ha ocurrido un error inesperado en la navegación.';
  let isChunkError = false;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Página no encontrada';
      message = 'La página que buscas no existe o ha sido movida.';
    } else if (error.status === 401) {
      title = 'No autorizado';
      message = 'No tienes permiso para ver esta sección.';
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
    // Check for chunk load error (common after deployment)
    if (
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('ChunkLoadError')
    ) {
      isChunkError = true;
      title = 'Aplicación desactualizada';
      message = 'Hay una nueva versión del sitio disponible. Por favor, actualiza para continuar.';
    }
  }

  const handleReload = () => {
    // Force a full reload from the server (clearing cache where possible)
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 font-outfit">
      <div className="max-w-md w-full bg-dark-900 rounded-3xl p-8 text-center border border-dark-800 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
        
        <div className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg",
          isChunkError ? "bg-primary-500/10 text-primary-500" : "bg-red-500/10 text-red-500"
        )}>
          {isChunkError ? (
            <RefreshCw className="w-10 h-10 animate-spin-slow" />
          ) : (
            <AlertTriangle className="w-10 h-10" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          {title}
        </h1>

        <p className="text-dark-300 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary-600/20 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            {isChunkError ? 'Actualizar Aplicación' : 'Reintentar Carga'}
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 bg-dark-800 hover:bg-dark-700 text-dark-100 px-8 py-4 rounded-xl font-bold transition-all duration-300 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>

        {/* Technical details (only for devs) */}
        {import.meta.env.DEV && (
          <div className="mt-8 pt-6 border-t border-dark-800 text-left">
            <p className="text-[10px] uppercase font-bold text-dark-400 mb-2">Technical Details</p>
            <pre className="text-[10px] text-red-400 bg-black/30 p-3 rounded-lg overflow-auto max-h-32">
              {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
