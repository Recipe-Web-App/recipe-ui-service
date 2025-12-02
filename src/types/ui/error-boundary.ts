import { type VariantProps } from 'class-variance-authority';
import type { ErrorInfo } from 'react';
import {
  errorBoundaryVariants,
  errorBoundaryIconVariants,
  errorBoundaryButtonVariants,
  errorBoundaryActionVariants,
  errorBoundaryContentVariants,
} from '@/lib/ui/error-boundary-variants';

/**
 * Error information with additional context
 */
export interface ErrorBoundaryError {
  message: string;
  stack?: string;
  name?: string;
  componentStack?: string;
  timestamp: number;
  retryCount: number;
  id: string;
}

/**
 * Error fallback component props
 */
export interface ErrorFallbackProps {
  error: ErrorBoundaryError;
  resetErrorBoundary: () => void;
  variant?: VariantProps<typeof errorBoundaryVariants>['variant'];
  size?: VariantProps<typeof errorBoundaryVariants>['size'];
  showDetails?: boolean;
  showRetry?: boolean;
  retryText?: string;
  className?: string;
}

/**
 * Base error boundary props
 */
export interface BaseErrorBoundaryProps {
  children: React.ReactNode;
  variant?: VariantProps<typeof errorBoundaryVariants>['variant'];
  size?: VariantProps<typeof errorBoundaryVariants>['size'];
  fallback?: React.ComponentType<ErrorFallbackProps>;
  fallbackRender?: (props: ErrorFallbackProps) => React.ReactElement;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: (error: ErrorBoundaryError) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean>;
  isolate?: boolean;
  className?: string;
}

/**
 * Inline error boundary props for small error displays
 */
export interface InlineErrorBoundaryProps extends Omit<
  BaseErrorBoundaryProps,
  'variant'
> {
  variant?: Extract<
    VariantProps<typeof errorBoundaryVariants>['variant'],
    'inline' | 'minimal'
  >;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showDetails?: boolean;
}

/**
 * Card error boundary props for standard error displays
 */
export interface CardErrorBoundaryProps extends Omit<
  BaseErrorBoundaryProps,
  'variant'
> {
  variant?: Extract<
    VariantProps<typeof errorBoundaryVariants>['variant'],
    'card'
  >;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showDetails?: boolean;
  actions?: React.ReactNode;
}

/**
 * Page error boundary props for full-page error displays
 */
export interface PageErrorBoundaryProps extends Omit<
  BaseErrorBoundaryProps,
  'variant'
> {
  variant?: Extract<
    VariantProps<typeof errorBoundaryVariants>['variant'],
    'page'
  >;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showDetails?: boolean;
  actions?: React.ReactNode;
  homeUrl?: string;
  contactUrl?: string;
}

/**
 * Toast error boundary props for notification-style errors
 */
export interface ToastErrorBoundaryProps extends Omit<
  BaseErrorBoundaryProps,
  'variant'
> {
  variant?: Extract<
    VariantProps<typeof errorBoundaryVariants>['variant'],
    'toast'
  >;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
  autoClose?: boolean;
  onClose?: () => void;
}

/**
 * Error boundary provider props for global error handling
 */
export interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableLogging?: boolean;
  logLevel?: 'error' | 'warn' | 'info';
  reportToService?: (error: ErrorBoundaryError) => Promise<void>;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  maxGlobalErrors?: number;
  resetTimeoutMs?: number;
}

/**
 * Error boundary context type
 */
export interface ErrorBoundaryContextType {
  errors: ErrorBoundaryError[];
  reportError: (error: Error, errorInfo: ErrorInfo) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  retryCount: number;
  lastError?: ErrorBoundaryError;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorBoundaryError | null;
  retryCount: number;
  isRetrying: boolean;
  lastResetTime: number;
  errorId: string | null;
}

/**
 * Error boundary action button props
 */
export interface ErrorBoundaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: VariantProps<typeof errorBoundaryButtonVariants>['intent'];
  size?: VariantProps<typeof errorBoundaryButtonVariants>['size'];
  variant?: VariantProps<typeof errorBoundaryButtonVariants>['variant'];
  loading?: boolean;
  loadingText?: string;
}

/**
 * Error boundary icon props
 */
export interface ErrorBoundaryIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof errorBoundaryIconVariants>['variant'];
  size?: VariantProps<typeof errorBoundaryIconVariants>['size'];
  children: React.ReactNode;
}

/**
 * Error boundary content props
 */
export interface ErrorBoundaryContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof errorBoundaryContentVariants>['variant'];
  withIcon?: VariantProps<typeof errorBoundaryContentVariants>['withIcon'];
  children: React.ReactNode;
}

/**
 * Error boundary actions container props
 */
export interface ErrorBoundaryActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: VariantProps<typeof errorBoundaryActionVariants>['layout'];
  variant?: VariantProps<typeof errorBoundaryActionVariants>['variant'];
  children: React.ReactNode;
}

/**
 * Error logging configuration
 */
export interface ErrorLoggingConfig {
  enabled: boolean;
  logLevel: 'error' | 'warn' | 'info';
  includeComponentStack: boolean;
  includeUserAgent: boolean;
  includeTimestamp: boolean;
  includeUrl: boolean;
  customMetadata?: Record<string, unknown>;
}

/**
 * Error reporting service interface
 */
export interface ErrorReportingService {
  report: (error: ErrorBoundaryError) => Promise<void>;
  configure: (config: Partial<ErrorLoggingConfig>) => void;
  isEnabled: () => boolean;
}

/**
 * Error boundary metrics
 */
export interface ErrorBoundaryMetrics {
  totalErrors: number;
  uniqueErrors: number;
  retrySuccessRate: number;
  mostCommonErrors: Array<{
    message: string;
    count: number;
    lastOccurrence: number;
  }>;
  errorsByComponent: Record<string, number>;
}

/**
 * Error boundary recovery strategies
 */
export type ErrorRecoveryStrategy =
  | 'retry'
  | 'refresh'
  | 'redirect'
  | 'fallback'
  | 'ignore';

/**
 * Error boundary configuration
 */
export interface ErrorBoundaryConfig {
  strategy: ErrorRecoveryStrategy;
  maxRetries: number;
  retryDelay: number;
  enableFallback: boolean;
  enableLogging: boolean;
  enableReporting: boolean;
  isolateErrors: boolean;
  showUserFriendlyMessage: boolean;
}
