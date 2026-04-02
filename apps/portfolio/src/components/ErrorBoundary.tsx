import { AlertTriangle, RefreshCw } from 'lucide-react';
import type React from 'react';
import { Component, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service (Sentry, LogRocket, etc.)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    // Force a full reload to clear internal state and try to get fresh chunks
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('fetch') || 
                          this.state.error?.message?.includes('ChunkLoadError');

      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 font-outfit">
          <div className="max-w-md w-full bg-dark-900 rounded-3xl p-8 text-center border border-dark-800 shadow-2xl">
            <div className={cn(
              "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6",
              isChunkError ? "bg-primary-500/10 text-primary-500" : "bg-red-500/10 text-red-500"
            )}>
              {isChunkError ? (
                <RefreshCw className="w-10 h-10 animate-spin-slow" />
              ) : (
                <AlertTriangle className="w-10 h-10" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              {isChunkError ? 'Nueva versión disponible' : 'Algo salió mal'}
            </h1>

            <p className="text-dark-300 mb-8 leading-relaxed">
              {isChunkError 
                ? 'Hemos actualizado la aplicación para mejorar tu experiencia. Por favor, recarga la página para continuar.'
                : 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.'}
            </p>

            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary-600/20 active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
