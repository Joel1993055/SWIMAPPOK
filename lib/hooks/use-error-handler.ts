import * as Sentry from '@sentry/nextjs';
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

      // Send to Sentry
      Sentry.withScope(scope => {
        if (context?.userId) {
          scope.setUser({ id: context.userId });
        }

        if (context?.sessionId) {
          scope.setTag('sessionId', context.sessionId);
        }

        if (context?.component) {
          scope.setTag('component', context.component);
        }

        if (context?.action) {
          scope.setTag('action', context.action);
        }

        if (context?.metadata) {
          scope.setContext('metadata', context.metadata);
        }

        if (typeof error === 'string') {
          Sentry.captureMessage(error, 'error');
        } else {
          Sentry.captureException(error);
        }
      });
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

      Sentry.withScope(scope => {
        if (context?.userId) {
          scope.setUser({ id: context.userId });
        }

        if (context?.component) {
          scope.setTag('component', context.component);
        }

        Sentry.captureMessage(message, level);
      });
    },
    []
  );

  const captureUserFeedback = useCallback(
    (feedback: { name: string; email: string; message: string }) => {
      Sentry.captureUserFeedback({
        name: feedback.name,
        email: feedback.email,
        comments: feedback.message,
      });
    },
    []
  );

  return {
    captureError,
    captureMessage,
    captureUserFeedback,
  };
}
