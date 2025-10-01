/**
 * Component error types and configurations for ComponentErrorBoundary
 *
 * This module defines types for component-level error handling with granular
 * isolation, props validation, and graceful degradation strategies.
 */

/**
 * Component error types
 */
export enum ComponentErrorType {
  RENDER_ERROR = 'render-error',
  PROPS_ERROR = 'props-error',
  LIFECYCLE_ERROR = 'lifecycle-error',
  DATA_ERROR = 'data-error',
  STATE_ERROR = 'state-error',
  EVENT_HANDLER_ERROR = 'event-handler-error',
  ASYNC_ERROR = 'async-error',
  UNKNOWN = 'unknown',
}

/**
 * Component error severity levels
 */
export enum ComponentErrorSeverity {
  CRITICAL = 'critical', // Component completely broken
  ERROR = 'error', // Component has errors but might partially work
  WARNING = 'warning', // Component has issues but still functional
  INFO = 'info', // Informational, component works fine
}

/**
 * Fallback display modes
 */
export enum FallbackMode {
  SKELETON = 'skeleton', // Show skeleton/loading state
  PLACEHOLDER = 'placeholder', // Show custom placeholder
  HIDDEN = 'hidden', // Hide component entirely
  MINIMAL = 'minimal', // Show minimal error message
  DETAILED = 'detailed', // Show detailed error information
}

/**
 * Recovery strategies
 */
export enum RecoveryStrategy {
  RETRY = 'retry', // Retry rendering the component
  RESET_PROPS = 'reset-props', // Reset props to default/previous values
  RELOAD = 'reload', // Reload/remount the component
  FALLBACK = 'fallback', // Show fallback permanently
  IGNORE = 'ignore', // Ignore error and hide component
}

/**
 * Component error metadata
 */
export interface ComponentErrorMetadata {
  /** Type of component error */
  errorType: ComponentErrorType;

  /** Error severity level */
  severity: ComponentErrorSeverity;

  /** Component name or identifier */
  componentName: string;

  /** Component display name (for UI) */
  componentDisplayName?: string;

  /** Error message */
  message: string;

  /** Error stack trace */
  stack?: string;

  /** Component stack trace from React */
  componentStack?: string;

  /** Props snapshot at time of error */
  propsSnapshot?: Record<string, unknown>;

  /** State snapshot at time of error (if available) */
  stateSnapshot?: Record<string, unknown>;

  /** Timestamp when error occurred */
  timestamp: number;

  /** Error fingerprint for deduplication */
  fingerprint: string;

  /** Whether the error is retryable */
  retryable: boolean;

  /** Retry count */
  retryCount: number;

  /** Custom metadata */
  customMetadata?: Record<string, unknown>;
}

/**
 * Component error boundary configuration
 */
export interface ComponentErrorBoundaryConfig {
  /** Component name for identification */
  componentName: string;

  /** Component display name (for UI) */
  componentDisplayName?: string;

  /** Fallback display mode */
  fallbackMode?: FallbackMode;

  /** Recovery strategy */
  recoveryStrategy?: RecoveryStrategy;

  /** Maximum retry attempts */
  maxRetries?: number;

  /** Retry delay in milliseconds */
  retryDelay?: number;

  /** Whether to isolate component errors (prevent bubbling) */
  isolate?: boolean;

  /** Whether to enable automatic retry */
  enableAutoRetry?: boolean;

  /** Whether to log errors to console */
  enableLogging?: boolean;

  /** Whether to track errors in analytics */
  enableAnalytics?: boolean;

  /** Props validator function */
  validateProps?: (props: unknown) => boolean | string;

  /** Custom error handler */
  onError?: (error: Error, metadata: ComponentErrorMetadata) => void;

  /** Analytics callback */
  onAnalyticsEvent?: (event: ComponentErrorAnalyticsEvent) => void;

  /** Reset callback */
  onReset?: () => void;

  /** Custom fallback component */
  fallbackComponent?: React.ComponentType<ComponentErrorFallbackProps>;

  /** Fallback render function */
  fallbackRender?: (props: ComponentErrorFallbackProps) => React.ReactElement;

  /** Skeleton configuration */
  skeletonConfig?: {
    height?: string;
    width?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    animation?: 'pulse' | 'wave' | 'none';
  };

  /** Placeholder configuration */
  placeholderConfig?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    showRetry?: boolean;
  };
}

/**
 * Component error fallback props
 */
export interface ComponentErrorFallbackProps {
  /** Error object */
  error: Error;

  /** Error metadata */
  metadata: ComponentErrorMetadata;

  /** Fallback mode */
  fallbackMode: FallbackMode;

  /** Reset error boundary */
  resetErrorBoundary: () => void;

  /** Retry rendering */
  retry: () => void;

  /** Configuration */
  config: Required<
    Omit<
      ComponentErrorBoundaryConfig,
      | 'validateProps'
      | 'onError'
      | 'onAnalyticsEvent'
      | 'onReset'
      | 'fallbackComponent'
      | 'fallbackRender'
    >
  >;

  /** Whether currently retrying */
  isRetrying: boolean;

  /** Additional className */
  className?: string;
}

/**
 * Component error boundary props
 */
export interface ComponentErrorBoundaryProps {
  /** Child components */
  children: React.ReactNode;

  /** Configuration (can be partial, will merge with defaults) */
  config?: Partial<ComponentErrorBoundaryConfig>;

  /** Component name (shorthand for config.componentName) */
  componentName?: string;

  /** Fallback mode (shorthand for config.fallbackMode) */
  fallbackMode?: FallbackMode;

  /** Isolate errors (shorthand for config.isolate) */
  isolate?: boolean;

  /** Custom fallback component */
  fallback?: React.ComponentType<ComponentErrorFallbackProps>;

  /** Custom fallback render function */
  fallbackRender?: (props: ComponentErrorFallbackProps) => React.ReactElement;

  /** Error handler callback */
  onError?: (error: Error, metadata: ComponentErrorMetadata) => void;

  /** Additional className */
  className?: string;
}

/**
 * Component error boundary state
 */
export interface ComponentErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;

  /** Error object */
  error: Error | null;

  /** Error metadata */
  errorMetadata: ComponentErrorMetadata | null;

  /** Retry count */
  retryCount: number;

  /** Whether currently retrying */
  isRetrying: boolean;

  /** Retry countdown (seconds) */
  retryCountdown: number;

  /** Last error fingerprint (for deduplication) */
  lastErrorFingerprint: string | null;
}

/**
 * Component error analytics event
 */
export interface ComponentErrorAnalyticsEvent {
  /** Event type */
  type:
    | 'component-error-displayed'
    | 'component-error-retry'
    | 'component-error-recovered'
    | 'component-error-reset'
    | 'component-error-dismissed';

  /** Component name */
  componentName: string;

  /** Error type */
  errorType: ComponentErrorType;

  /** Error severity */
  severity: ComponentErrorSeverity;

  /** Fallback mode */
  fallbackMode: FallbackMode;

  /** Recovery strategy */
  recoveryStrategy?: RecoveryStrategy;

  /** Retry count */
  retryCount?: number;

  /** Timestamp */
  timestamp: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Props validation result
 */
export interface PropsValidationResult {
  /** Whether props are valid */
  valid: boolean;

  /** Validation error message (if invalid) */
  message?: string;

  /** Invalid prop names */
  invalidProps?: string[];
}

/**
 * Default configuration values
 */
export const DEFAULT_COMPONENT_ERROR_CONFIG: Required<
  Omit<
    ComponentErrorBoundaryConfig,
    | 'componentDisplayName'
    | 'validateProps'
    | 'onError'
    | 'onAnalyticsEvent'
    | 'onReset'
    | 'fallbackComponent'
    | 'fallbackRender'
    | 'skeletonConfig'
    | 'placeholderConfig'
  >
> = {
  componentName: 'Component',
  fallbackMode: FallbackMode.SKELETON,
  recoveryStrategy: RecoveryStrategy.RETRY,
  maxRetries: 3,
  retryDelay: 1000,
  isolate: true,
  enableAutoRetry: false,
  enableLogging: true,
  enableAnalytics: true,
};

/**
 * Error type to severity mapping
 */
export const ERROR_TYPE_TO_SEVERITY: Record<
  ComponentErrorType,
  ComponentErrorSeverity
> = {
  [ComponentErrorType.RENDER_ERROR]: ComponentErrorSeverity.CRITICAL,
  [ComponentErrorType.PROPS_ERROR]: ComponentErrorSeverity.ERROR,
  [ComponentErrorType.LIFECYCLE_ERROR]: ComponentErrorSeverity.ERROR,
  [ComponentErrorType.DATA_ERROR]: ComponentErrorSeverity.WARNING,
  [ComponentErrorType.STATE_ERROR]: ComponentErrorSeverity.ERROR,
  [ComponentErrorType.EVENT_HANDLER_ERROR]: ComponentErrorSeverity.WARNING,
  [ComponentErrorType.ASYNC_ERROR]: ComponentErrorSeverity.WARNING,
  [ComponentErrorType.UNKNOWN]: ComponentErrorSeverity.ERROR,
};

/**
 * Error type to recovery strategy mapping
 */
export const ERROR_TYPE_TO_RECOVERY_STRATEGY: Record<
  ComponentErrorType,
  RecoveryStrategy
> = {
  [ComponentErrorType.RENDER_ERROR]: RecoveryStrategy.RELOAD,
  [ComponentErrorType.PROPS_ERROR]: RecoveryStrategy.RESET_PROPS,
  [ComponentErrorType.LIFECYCLE_ERROR]: RecoveryStrategy.RELOAD,
  [ComponentErrorType.DATA_ERROR]: RecoveryStrategy.RETRY,
  [ComponentErrorType.STATE_ERROR]: RecoveryStrategy.RESET_PROPS,
  [ComponentErrorType.EVENT_HANDLER_ERROR]: RecoveryStrategy.IGNORE,
  [ComponentErrorType.ASYNC_ERROR]: RecoveryStrategy.RETRY,
  [ComponentErrorType.UNKNOWN]: RecoveryStrategy.FALLBACK,
};

/**
 * Fallback mode display names
 */
export const FALLBACK_MODE_DISPLAY_NAMES: Record<FallbackMode, string> = {
  [FallbackMode.SKELETON]: 'Loading',
  [FallbackMode.PLACEHOLDER]: 'Unavailable',
  [FallbackMode.HIDDEN]: 'Hidden',
  [FallbackMode.MINIMAL]: 'Error',
  [FallbackMode.DETAILED]: 'Error Details',
};
