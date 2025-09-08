'use client';

import { Button } from '@/components/ui/button';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
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

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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
              Intentar de nuevo
            </Button>

            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
              className='w-full'
            >
              Ir al inicio
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className='text-left'>
              <summary className='cursor-pointer text-sm text-muted-foreground'>
                Detalles del error (desarrollo)
              </summary>
              <pre className='mt-2 p-4 bg-muted rounded text-xs overflow-auto'>
                {error.message}
                {error.stack}
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
