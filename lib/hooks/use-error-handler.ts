import { useCallback } from 'react';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export function useErrorHandler() {
  const captureError = useCallback(
    (error: Error | string, context?: ErrorContext) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error captured:', error, context);
      }

      // In production, you might want to send errors to a logging service
      // For now, we'll just log to console
      console.error('Error:', error, 'Context:', context);
    },
    []
  );

  const captureMessage = useCallback(
    (
      message: string,
      level: 'info' | 'warning' | 'error' = 'info',
      context?: ErrorContext
    ) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${level.toUpperCase()}] ${message}`, context);
      }

      // In production, you might want to send messages to a logging service
      console.log(`[${level.toUpperCase()}] ${message}`, context);
    },
    []
  );

  const captureUserFeedback = useCallback(
    (feedback: { name: string; email: string; message: string }) => {
      // Log user feedback to console
      console.log('User feedback:', feedback);
      
      // In production, you might want to send this to a feedback service
      // or store it in your database
    },
    []
  );

  return {
    captureError,
    captureMessage,
    captureUserFeedback,
  };
}
