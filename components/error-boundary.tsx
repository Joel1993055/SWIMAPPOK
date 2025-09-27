'use client';

import { Button } from '@/components/ui/button';
import { useErrorHandler } from '@/core/hooks/use-error-handler';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | any;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error | any;
  resetError: () => void;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={() =>
            this.setState({
              hasError: false,
              error: undefined,
              errorInfo: undefined,
            })
          }
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { captureError } = useErrorHandler();

  React.useEffect(() => {
    // Capture error when component mounts
    captureError(error, {
      component: 'ErrorBoundary',
      action: 'render',
    });
  }, [error, captureError]);

  // Helper function to safely get error message
  const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      return error.message || error.title || error.type || JSON.stringify(error);
    }
    return 'Unknown error';
  };

  // Helper function to safely get error stack
  const getErrorStack = (error: any): string => {
    if (error instanceof Error && error.stack) {
      return error.stack;
    }
    if (error && typeof error === 'object' && error.stack) {
      return error.stack;
    }
    return 'No hay información de stack disponible';
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='max-w-md w-full mx-auto p-6'>
        <div className='text-center space-y-6'>
          <div className='flex justify-center'>
            <AlertTriangle className='h-16 w-16 text-destructive' />
          </div>

          <div className='space-y-2'>
            <h1 className='text-2xl font-bold text-foreground'>
              Algo salió mal
            </h1>
            <p className='text-muted-foreground'>
              Ha ocurrido un error inesperado. Nuestro equipo ha sido
              notificado.
            </p>
          </div>

          <div className='space-y-4'>
            <Button onClick={resetError} className='w-full'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Try again
            </Button>

            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
              className='w-full'
            >
              Go to home
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className='text-left'>
              <summary className='cursor-pointer text-sm text-muted-foreground'>
                Error details (development)
              </summary>
              <pre className='mt-2 p-4 bg-muted rounded text-xs overflow-auto'>
                {getErrorMessage(error)}
                {'\n\n'}
                {getErrorStack(error)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export { ErrorBoundary };
export type { ErrorBoundaryProps, ErrorFallbackProps };

