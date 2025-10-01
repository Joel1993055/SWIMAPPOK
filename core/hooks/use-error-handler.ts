import { useCallback } from 'react';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorLog {
  error: string;
  context?: ErrorContext;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export function useErrorHandler() {
  const captureError = useCallback(
    (error: Error | string, context?: ErrorContext) => {
      const errorLog: ErrorLog = {
        error: typeof error === 'string' ? error : error.message,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      // Development: Log to console with full details
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Error captured:', errorLog);
        if (typeof error === 'object' && error.stack) {
          console.error('Stack trace:', error.stack);
        }
      }

      // Production: Log structured error
      if (process.env.NODE_ENV === 'production') {
        console.error('Production error:', JSON.stringify(errorLog));
        
        // TODO: In the future, integrate with error tracking service like Sentry
        // Sentry.captureException(error, { extra: context });
      }
    },
    []
  );

  const captureMessage = useCallback(
    (
      message: string,
      level: 'info' | 'warning' | 'error' = 'info',
      context?: ErrorContext
    ) => {
      const logEntry = {
        message,
        level,
        context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      // Development: Log to console
      if (process.env.NODE_ENV === 'development') {
        const emoji = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${emoji} [${level.toUpperCase()}] ${message}`, context);
      }

      // Production: Log structured message
      if (process.env.NODE_ENV === 'production') {
        console.log(`[${level.toUpperCase()}] ${message}`, JSON.stringify(logEntry));
      }
    },
    []
  );

  const captureUserFeedback = useCallback(
    (feedback: { name: string; email: string; message: string }) => {
      const feedbackLog = {
        ...feedback,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      };

      // Development: Log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📝 User feedback:', feedbackLog);
      }

      // Production: Log structured feedback
      if (process.env.NODE_ENV === 'production') {
        console.log('User feedback:', JSON.stringify(feedbackLog));
        
        // TODO: In the future, send to feedback service or database
        // await sendFeedbackToService(feedbackLog);
      }
    },
    []
  );

  const captureApiError = useCallback(
    (error: Error, endpoint: string, method: string, context?: ErrorContext) => {
      const apiErrorLog = {
        error: error.message,
        endpoint,
        method,
        context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      // Development: Log to console
      if (process.env.NODE_ENV === 'development') {
        console.error('🌐 API Error:', apiErrorLog);
      }

      // Production: Log structured API error
      if (process.env.NODE_ENV === 'production') {
        console.error('API Error:', JSON.stringify(apiErrorLog));
      }
    },
    []
  );

  return {
    captureError,
    captureMessage,
    captureUserFeedback,
    captureApiError,
  };
}
