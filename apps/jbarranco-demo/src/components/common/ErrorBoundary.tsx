import { Component, ErrorInfo, ReactNode } from "react";
import { resetDemoEnvironment } from "../../demo/demoStore";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error in Demo:", error, errorInfo);
  }

  handleReset = (): void => {
    resetDemoEnvironment();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Algo salió mal en la vista actual
            </h1>
            <p className="text-gray-600 mb-6">
              Puedes restaurar el entorno de demostración a su estado inicial con un clic.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Reiniciar Entorno Demo
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
