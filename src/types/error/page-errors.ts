/**
 * Page error types and configurations for PageErrorBoundary
 *
 * This module defines types for handling full-page errors with HTTP status awareness,
 * SEO optimization, and context-aware recovery strategies.
 */

/**
 * HTTP status codes for page errors
 */
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  GONE = 410,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Page error types
 */
export enum PageErrorType {
  NOT_FOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  SERVER_ERROR = 'server-error',
  SERVICE_UNAVAILABLE = 'service-unavailable',
  MAINTENANCE = 'maintenance',
  TIMEOUT = 'timeout',
  GONE = 'gone',
  BAD_REQUEST = 'bad-request',
  UNKNOWN = 'unknown',
}

/**
 * Error severity levels for page errors
 */
export enum PageErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Recovery action types
 */
export enum RecoveryActionType {
  GO_HOME = 'go-home',
  GO_BACK = 'go-back',
  RETRY = 'retry',
  REFRESH = 'refresh',
  LOGIN = 'login',
  CONTACT_SUPPORT = 'contact-support',
  VIEW_STATUS = 'view-status',
}

/**
 * Page error metadata
 */
export interface PageErrorMetadata {
  /** Type of page error */
  errorType: PageErrorType;

  /** HTTP status code */
  statusCode: HttpStatusCode;

  /** Error severity level */
  severity: PageErrorSeverity;

  /** User-friendly error title */
  title: string;

  /** User-friendly error description */
  description: string;

  /** Suggested recovery actions */
  recoveryActions: RecoveryActionType[];

  /** SEO title for error page */
  seoTitle: string;

  /** SEO meta description */
  seoDescription: string;

  /** Whether the error is retryable */
  retryable: boolean;

  /** Timestamp when error occurred */
  timestamp: number;

  /** Optional URL that caused the error */
  url?: string;

  /** Optional referrer URL */
  referrer?: string;

  /** Optional custom metadata */
  customMetadata?: Record<string, unknown>;
}

/**
 * Recovery action configuration
 */
export interface RecoveryAction {
  /** Action type */
  type: RecoveryActionType;

  /** Action label */
  label: string;

  /** Action icon name (lucide-react) */
  icon?: string;

  /** Action URL (for navigation actions) */
  url?: string;

  /** Action handler (for custom actions) */
  handler?: () => void;

  /** Whether action is primary */
  isPrimary?: boolean;

  /** Whether action is disabled */
  disabled?: boolean;
}

/**
 * Page error boundary configuration
 */
export interface PageErrorBoundaryConfig {
  /** Home page URL (default '/') */
  homeUrl?: string;

  /** Contact support URL */
  contactUrl?: string;

  /** Status page URL */
  statusPageUrl?: string;

  /** Login page URL */
  loginUrl?: string;

  /** Enable SEO optimization */
  enableSeo?: boolean;

  /** Enable analytics tracking */
  enableAnalytics?: boolean;

  /** Enable automatic retry for retryable errors */
  enableAutoRetry?: boolean;

  /** Maximum retry attempts */
  maxRetries?: number;

  /** Retry delay in milliseconds */
  retryDelay?: number;

  /** Custom recovery actions */
  customRecoveryActions?: RecoveryAction[];

  /** Custom error page templates */
  customTemplates?: Partial<
    Record<PageErrorType, React.ComponentType<PageErrorFallbackProps>>
  >;

  /** Analytics event callback */
  onAnalyticsEvent?: (event: PageErrorAnalyticsEvent) => void;

  /** Error callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Page error fallback component props
 */
export interface PageErrorFallbackProps {
  /** Error object */
  error: Error;

  /** Error metadata */
  metadata: PageErrorMetadata;

  /** Recovery actions */
  recoveryActions: RecoveryAction[];

  /** Reset error boundary */
  resetErrorBoundary: () => void;

  /** Additional className */
  className?: string;
}

/**
 * Page error boundary props
 */
export interface PageErrorBoundaryProps {
  /** Child components */
  children: React.ReactNode;

  /** Configuration */
  config?: PageErrorBoundaryConfig;

  /** Custom fallback component */
  fallback?: React.ComponentType<PageErrorFallbackProps>;

  /** Custom fallback render function */
  fallbackRender?: (props: PageErrorFallbackProps) => React.ReactElement;

  /** Additional className */
  className?: string;
}

/**
 * Page error analytics event
 */
export interface PageErrorAnalyticsEvent {
  /** Event type */
  type:
    | 'error-displayed'
    | 'recovery-action-clicked'
    | 'error-retry'
    | 'error-resolved';

  /** Error type */
  errorType: PageErrorType;

  /** HTTP status code */
  statusCode: HttpStatusCode;

  /** Recovery action taken (if applicable) */
  recoveryAction?: RecoveryActionType;

  /** Retry count (if applicable) */
  retryCount?: number;

  /** Timestamp */
  timestamp: number;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Default HTTP status code to error type mapping
 */
export const HTTP_STATUS_TO_ERROR_TYPE: Record<HttpStatusCode, PageErrorType> =
  {
    [HttpStatusCode.BAD_REQUEST]: PageErrorType.BAD_REQUEST,
    [HttpStatusCode.UNAUTHORIZED]: PageErrorType.UNAUTHORIZED,
    [HttpStatusCode.PAYMENT_REQUIRED]: PageErrorType.FORBIDDEN,
    [HttpStatusCode.FORBIDDEN]: PageErrorType.FORBIDDEN,
    [HttpStatusCode.NOT_FOUND]: PageErrorType.NOT_FOUND,
    [HttpStatusCode.METHOD_NOT_ALLOWED]: PageErrorType.BAD_REQUEST,
    [HttpStatusCode.REQUEST_TIMEOUT]: PageErrorType.TIMEOUT,
    [HttpStatusCode.GONE]: PageErrorType.GONE,
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: PageErrorType.SERVER_ERROR,
    [HttpStatusCode.NOT_IMPLEMENTED]: PageErrorType.SERVER_ERROR,
    [HttpStatusCode.BAD_GATEWAY]: PageErrorType.SERVER_ERROR,
    [HttpStatusCode.SERVICE_UNAVAILABLE]: PageErrorType.SERVICE_UNAVAILABLE,
    [HttpStatusCode.GATEWAY_TIMEOUT]: PageErrorType.TIMEOUT,
  };

/**
 * Default error type to severity mapping
 */
export const ERROR_TYPE_TO_SEVERITY: Record<PageErrorType, PageErrorSeverity> =
  {
    [PageErrorType.NOT_FOUND]: PageErrorSeverity.WARNING,
    [PageErrorType.UNAUTHORIZED]: PageErrorSeverity.WARNING,
    [PageErrorType.FORBIDDEN]: PageErrorSeverity.WARNING,
    [PageErrorType.SERVER_ERROR]: PageErrorSeverity.CRITICAL,
    [PageErrorType.SERVICE_UNAVAILABLE]: PageErrorSeverity.ERROR,
    [PageErrorType.MAINTENANCE]: PageErrorSeverity.INFO,
    [PageErrorType.TIMEOUT]: PageErrorSeverity.ERROR,
    [PageErrorType.GONE]: PageErrorSeverity.WARNING,
    [PageErrorType.BAD_REQUEST]: PageErrorSeverity.WARNING,
    [PageErrorType.UNKNOWN]: PageErrorSeverity.ERROR,
  };

/**
 * Default error type to recovery actions mapping
 */
export const ERROR_TYPE_TO_RECOVERY_ACTIONS: Record<
  PageErrorType,
  RecoveryActionType[]
> = {
  [PageErrorType.NOT_FOUND]: [
    RecoveryActionType.GO_HOME,
    RecoveryActionType.GO_BACK,
  ],
  [PageErrorType.UNAUTHORIZED]: [
    RecoveryActionType.LOGIN,
    RecoveryActionType.GO_HOME,
  ],
  [PageErrorType.FORBIDDEN]: [
    RecoveryActionType.GO_HOME,
    RecoveryActionType.CONTACT_SUPPORT,
  ],
  [PageErrorType.SERVER_ERROR]: [
    RecoveryActionType.RETRY,
    RecoveryActionType.GO_HOME,
    RecoveryActionType.CONTACT_SUPPORT,
  ],
  [PageErrorType.SERVICE_UNAVAILABLE]: [
    RecoveryActionType.RETRY,
    RecoveryActionType.VIEW_STATUS,
  ],
  [PageErrorType.MAINTENANCE]: [
    RecoveryActionType.VIEW_STATUS,
    RecoveryActionType.GO_HOME,
  ],
  [PageErrorType.TIMEOUT]: [
    RecoveryActionType.RETRY,
    RecoveryActionType.REFRESH,
  ],
  [PageErrorType.GONE]: [
    RecoveryActionType.GO_HOME,
    RecoveryActionType.GO_BACK,
  ],
  [PageErrorType.BAD_REQUEST]: [
    RecoveryActionType.GO_BACK,
    RecoveryActionType.GO_HOME,
  ],
  [PageErrorType.UNKNOWN]: [
    RecoveryActionType.RETRY,
    RecoveryActionType.GO_HOME,
  ],
};

/**
 * Default configuration values
 */
export const DEFAULT_PAGE_ERROR_CONFIG: Required<
  Omit<
    PageErrorBoundaryConfig,
    'customRecoveryActions' | 'customTemplates' | 'onAnalyticsEvent' | 'onError'
  >
> = {
  homeUrl: '/',
  contactUrl: '/contact',
  statusPageUrl: '/status',
  loginUrl: '/login',
  enableSeo: true,
  enableAnalytics: true,
  enableAutoRetry: false,
  maxRetries: 3,
  retryDelay: 2000,
};
