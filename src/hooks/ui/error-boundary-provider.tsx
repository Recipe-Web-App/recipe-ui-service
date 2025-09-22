import * as React from 'react';
import type { ErrorInfo } from 'react';
import type {
  ErrorBoundaryError,
  ErrorBoundaryProviderProps,
} from '@/types/ui/error-boundary';
import { ErrorBoundaryContext } from './use-error-boundary';

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  onError,
  enableLogging = true,
  logLevel = 'error',
  reportToService,
  maxGlobalErrors = 10,
  resetTimeoutMs = 30000,
}) => {
  const [errors, setErrors] = React.useState<ErrorBoundaryError[]>([]);
  const [retryCount, setRetryCount] = React.useState(0);

  const reportError = React.useCallback(
    async (error: Error, errorInfo: ErrorInfo) => {
      const errorBoundaryError: ErrorBoundaryError = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        componentStack: errorInfo.componentStack ?? undefined,
        timestamp: Date.now(),
        retryCount,
        id: `global-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      if (enableLogging) {
        switch (logLevel) {
          case 'error':
            console.error('Global Error Boundary:', errorBoundaryError);
            break;
          case 'warn':
            console.warn('Global Error Boundary:', errorBoundaryError);
            break;
          case 'info':
            console.info('Global Error Boundary:', errorBoundaryError);
            break;
          default:
            console.error('Global Error Boundary:', errorBoundaryError);
        }
      }

      setErrors(prev => {
        const updated = [errorBoundaryError, ...prev].slice(0, maxGlobalErrors);
        return updated;
      });

      onError?.(error, errorInfo);

      if (reportToService) {
        try {
          await reportToService(errorBoundaryError);
        } catch (reportingError) {
          console.error('Failed to report error to service:', reportingError);
        }
      }
    },
    [
      enableLogging,
      logLevel,
      maxGlobalErrors,
      onError,
      reportToService,
      retryCount,
    ]
  );

  const clearError = React.useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors([]);
    setRetryCount(0);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      errors,
      reportError,
      clearError,
      clearAllErrors,
      retryCount,
      lastError: errors[0],
    }),
    [errors, reportError, clearError, clearAllErrors, retryCount]
  );

  React.useEffect(() => {
    if (resetTimeoutMs > 0 && errors.length > 0) {
      const timer = setTimeout(() => {
        clearAllErrors();
      }, resetTimeoutMs);

      return () => clearTimeout(timer);
    }
  }, [errors.length, resetTimeoutMs, clearAllErrors]);

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};
