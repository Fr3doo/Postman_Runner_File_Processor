import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  ErrorHandler,
  errorHandler as defaultErrorHandler,
} from '../services/ErrorHandler';
import {
  type ILoggingService,
  loggingService as defaultLoggingService,
} from '../services/LoggingService';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback element to display when an error is caught.
   */
  fallback?: ReactNode;
  /**
   * Optional error handler instance to sanitise error messages.
   */
  errorHandler?: ErrorHandler;
  /**
   * Optional logging service used to store errors.
   */
  loggingService?: ILoggingService;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };
  private errorHandler: ErrorHandler;
  private loggingService: ILoggingService;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.errorHandler = props.errorHandler ?? defaultErrorHandler;
    this.loggingService = props.loggingService ?? defaultLoggingService;
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const message = this.errorHandler.handle(error);
    this.setState({ message });
    this.loggingService.logError(message);
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
            {this.state.message && (
              <p className="text-gray-600">{this.state.message}</p>
            )}
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
