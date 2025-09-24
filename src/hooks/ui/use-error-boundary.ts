import * as React from 'react';
import type { ErrorBoundaryContextType } from '@/types/ui/error-boundary';

export const ErrorBoundaryContext = React.createContext<
  ErrorBoundaryContextType | undefined
>(undefined);

export const useErrorBoundary = (): ErrorBoundaryContextType => {
  const context = React.useContext(ErrorBoundaryContext);
  if (context === undefined) {
    throw new Error(
      'useErrorBoundary must be used within an ErrorBoundaryProvider'
    );
  }
  return context;
};
