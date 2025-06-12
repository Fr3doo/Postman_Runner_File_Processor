import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback element to display when an error is caught.
   */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Unhandled error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="space-y-4 text-center">
            <AlertTriangle className="mx-auto text-red-500" size={48} />
            <h1 className="text-2xl font-semibold text-gray-800">
              Une erreur est survenue.
            </h1>
            <p className="text-gray-600">
              Essayez de recharger la page ou contactez le support si le
              problème persiste.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
