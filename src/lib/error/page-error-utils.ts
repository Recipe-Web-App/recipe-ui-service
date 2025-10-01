/**
 * Page error utility functions
 *
 * This module provides utility functions for detecting page error types,
 * generating error metadata, and determining recovery strategies.
 */

import {
  HttpStatusCode,
  PageErrorType,
  PageErrorSeverity,
  RecoveryActionType,
  type PageErrorMetadata,
  type RecoveryAction,
  HTTP_STATUS_TO_ERROR_TYPE,
  ERROR_TYPE_TO_SEVERITY,
  ERROR_TYPE_TO_RECOVERY_ACTIONS,
} from '@/types/error/page-errors';

/**
 * Error type display names
 */
const ERROR_TYPE_DISPLAY_NAMES: Record<PageErrorType, string> = {
  [PageErrorType.NOT_FOUND]: 'Page Not Found',
  [PageErrorType.UNAUTHORIZED]: 'Unauthorized Access',
  [PageErrorType.FORBIDDEN]: 'Access Forbidden',
  [PageErrorType.SERVER_ERROR]: 'Server Error',
  [PageErrorType.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [PageErrorType.MAINTENANCE]: 'Maintenance Mode',
  [PageErrorType.TIMEOUT]: 'Request Timeout',
  [PageErrorType.GONE]: 'Page Gone',
  [PageErrorType.BAD_REQUEST]: 'Bad Request',
  [PageErrorType.UNKNOWN]: 'Unknown Error',
};

/**
 * Error type descriptions
 */
const ERROR_TYPE_DESCRIPTIONS: Record<PageErrorType, string> = {
  [PageErrorType.NOT_FOUND]:
    'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
  [PageErrorType.UNAUTHORIZED]:
    'You need to sign in to access this page. Please log in with your credentials.',
  [PageErrorType.FORBIDDEN]:
    "You don't have permission to access this page. If you believe this is a mistake, please contact support.",
  [PageErrorType.SERVER_ERROR]:
    'Our server encountered an unexpected error. Our team has been notified and is working on a fix.',
  [PageErrorType.SERVICE_UNAVAILABLE]:
    'The service is temporarily unavailable due to maintenance or high load. Please try again in a few moments.',
  [PageErrorType.MAINTENANCE]:
    'We are currently performing scheduled maintenance. We will be back shortly.',
  [PageErrorType.TIMEOUT]:
    'The request took too long to complete. Please check your connection and try again.',
  [PageErrorType.GONE]:
    'This page has been permanently removed and is no longer available.',
  [PageErrorType.BAD_REQUEST]:
    'The request could not be understood by the server. Please check your input and try again.',
  [PageErrorType.UNKNOWN]:
    'An unexpected error occurred. Please try again or contact support if the problem persists.',
};

/**
 * SEO titles for error types
 */
const ERROR_TYPE_SEO_TITLES: Record<PageErrorType, string> = {
  [PageErrorType.NOT_FOUND]: '404 - Page Not Found',
  [PageErrorType.UNAUTHORIZED]: '401 - Unauthorized',
  [PageErrorType.FORBIDDEN]: '403 - Forbidden',
  [PageErrorType.SERVER_ERROR]: '500 - Server Error',
  [PageErrorType.SERVICE_UNAVAILABLE]: '503 - Service Unavailable',
  [PageErrorType.MAINTENANCE]: 'Maintenance Mode',
  [PageErrorType.TIMEOUT]: '408 - Request Timeout',
  [PageErrorType.GONE]: '410 - Page Gone',
  [PageErrorType.BAD_REQUEST]: '400 - Bad Request',
  [PageErrorType.UNKNOWN]: 'Error',
};

/**
 * SEO descriptions for error types
 */
const ERROR_TYPE_SEO_DESCRIPTIONS: Record<PageErrorType, string> = {
  [PageErrorType.NOT_FOUND]:
    'The requested page could not be found on this server.',
  [PageErrorType.UNAUTHORIZED]:
    'You need to be authenticated to access this resource.',
  [PageErrorType.FORBIDDEN]:
    'You do not have permission to access this resource.',
  [PageErrorType.SERVER_ERROR]:
    'The server encountered an error and could not complete your request.',
  [PageErrorType.SERVICE_UNAVAILABLE]:
    'The service is temporarily unavailable. Please try again later.',
  [PageErrorType.MAINTENANCE]:
    'The site is currently undergoing scheduled maintenance.',
  [PageErrorType.TIMEOUT]: 'The request timed out. Please try again.',
  [PageErrorType.GONE]: 'This resource has been permanently removed.',
  [PageErrorType.BAD_REQUEST]: 'The server could not understand the request.',
  [PageErrorType.UNKNOWN]:
    'An unexpected error occurred while processing your request.',
};

/**
 * Recovery action labels
 */
const RECOVERY_ACTION_LABELS: Record<RecoveryActionType, string> = {
  [RecoveryActionType.GO_HOME]: 'Go Home',
  [RecoveryActionType.GO_BACK]: 'Go Back',
  [RecoveryActionType.RETRY]: 'Try Again',
  [RecoveryActionType.REFRESH]: 'Refresh Page',
  [RecoveryActionType.LOGIN]: 'Sign In',
  [RecoveryActionType.CONTACT_SUPPORT]: 'Contact Support',
  [RecoveryActionType.VIEW_STATUS]: 'View Status',
};

/**
 * Recovery action icons (lucide-react icon names)
 */
const RECOVERY_ACTION_ICONS: Record<RecoveryActionType, string> = {
  [RecoveryActionType.GO_HOME]: 'Home',
  [RecoveryActionType.GO_BACK]: 'ArrowLeft',
  [RecoveryActionType.RETRY]: 'RefreshCw',
  [RecoveryActionType.REFRESH]: 'RotateCw',
  [RecoveryActionType.LOGIN]: 'LogIn',
  [RecoveryActionType.CONTACT_SUPPORT]: 'Mail',
  [RecoveryActionType.VIEW_STATUS]: 'Activity',
};

/**
 * Extract HTTP status code from error
 */
export const extractStatusCode = (error: Error): HttpStatusCode | null => {
  // Check if error has a status property
  if ('status' in error && typeof error.status === 'number') {
    return error.status as HttpStatusCode;
  }

  // Check if error has a statusCode property
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode as HttpStatusCode;
  }

  // Try to extract from error message (e.g., "Error 404: Not Found")
  const statusMatch = error.message.match(/\b(\d{3})\b/);
  if (statusMatch) {
    const code = parseInt(statusMatch[1], 10);
    if (Object.values(HttpStatusCode).includes(code)) {
      return code as HttpStatusCode;
    }
  }

  return null;
};

/**
 * Map HTTP status code to error type
 */
export const mapHttpStatusToErrorType = (
  statusCode: HttpStatusCode
): PageErrorType => {
  return (
    // eslint-disable-next-line security/detect-object-injection
    HTTP_STATUS_TO_ERROR_TYPE[statusCode] ?? PageErrorType.UNKNOWN
  );
};

/**
 * Detect page error type from error object
 */
export const detectPageErrorType = (error: Error): PageErrorType => {
  const statusCode = extractStatusCode(error);

  if (statusCode) {
    return mapHttpStatusToErrorType(statusCode);
  }

  // Check error message for keywords
  const message = error.message.toLowerCase();

  if (message.includes('not found') || message.includes('404')) {
    return PageErrorType.NOT_FOUND;
  }

  if (message.includes('unauthorized') || message.includes('401')) {
    return PageErrorType.UNAUTHORIZED;
  }

  if (message.includes('forbidden') || message.includes('403')) {
    return PageErrorType.FORBIDDEN;
  }

  if (message.includes('timeout') || message.includes('408')) {
    return PageErrorType.TIMEOUT;
  }

  if (message.includes('maintenance')) {
    return PageErrorType.MAINTENANCE;
  }

  if (message.includes('unavailable') || message.includes('503')) {
    return PageErrorType.SERVICE_UNAVAILABLE;
  }

  if (
    message.includes('server error') ||
    message.includes('500') ||
    message.includes('502') ||
    message.includes('504')
  ) {
    return PageErrorType.SERVER_ERROR;
  }

  return PageErrorType.UNKNOWN;
};

/**
 * Get error severity for error type
 */
export const getErrorSeverity = (
  errorType: PageErrorType
): PageErrorSeverity => {
  // eslint-disable-next-line security/detect-object-injection
  return ERROR_TYPE_TO_SEVERITY[errorType] ?? PageErrorSeverity.ERROR;
};

/**
 * Determine if error is retryable
 */
export const isErrorRetryable = (
  errorType: PageErrorType,
  statusCode?: HttpStatusCode
): boolean => {
  // Server errors (5xx) are generally retryable
  if (statusCode && statusCode >= 500) {
    return true;
  }

  // Specific error types that are retryable
  const retryableTypes = [
    PageErrorType.SERVER_ERROR,
    PageErrorType.SERVICE_UNAVAILABLE,
    PageErrorType.TIMEOUT,
  ];

  return retryableTypes.includes(errorType);
};

/**
 * Get recovery actions for error type
 */
export const getRecoveryActions = (
  errorType: PageErrorType,
  config?: {
    homeUrl?: string;
    loginUrl?: string;
    contactUrl?: string;
    statusPageUrl?: string;
  }
): RecoveryAction[] => {
  // eslint-disable-next-line security/detect-object-injection
  const actionTypes = ERROR_TYPE_TO_RECOVERY_ACTIONS[errorType] ?? [
    RecoveryActionType.GO_HOME,
  ];

  return actionTypes.map((type, index) => {
    const action: RecoveryAction = {
      type,
      // eslint-disable-next-line security/detect-object-injection
      label: RECOVERY_ACTION_LABELS[type],
      // eslint-disable-next-line security/detect-object-injection
      icon: RECOVERY_ACTION_ICONS[type],
      isPrimary: index === 0,
    };

    // Add URLs for navigation actions
    switch (type) {
      case RecoveryActionType.GO_HOME:
        action.url = config?.homeUrl ?? '/';
        break;
      case RecoveryActionType.LOGIN:
        action.url = config?.loginUrl ?? '/login';
        break;
      case RecoveryActionType.CONTACT_SUPPORT:
        action.url = config?.contactUrl ?? '/contact';
        break;
      case RecoveryActionType.VIEW_STATUS:
        action.url = config?.statusPageUrl ?? '/status';
        break;
    }

    return action;
  });
};

/**
 * Generate page error metadata
 */
export const generatePageErrorMetadata = (
  error: Error,
  options?: {
    url?: string;
    referrer?: string;
    customMetadata?: Record<string, unknown>;
  }
): PageErrorMetadata => {
  const statusCode =
    extractStatusCode(error) ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
  const errorType = detectPageErrorType(error);
  const severity = getErrorSeverity(errorType);
  const retryable = isErrorRetryable(errorType, statusCode);
  // eslint-disable-next-line security/detect-object-injection
  const title = ERROR_TYPE_DISPLAY_NAMES[errorType];
  // eslint-disable-next-line security/detect-object-injection
  const description = ERROR_TYPE_DESCRIPTIONS[errorType];
  // eslint-disable-next-line security/detect-object-injection
  const seoTitle = ERROR_TYPE_SEO_TITLES[errorType];
  // eslint-disable-next-line security/detect-object-injection
  const seoDescription = ERROR_TYPE_SEO_DESCRIPTIONS[errorType];
  // eslint-disable-next-line security/detect-object-injection
  const recoveryActions = ERROR_TYPE_TO_RECOVERY_ACTIONS[errorType] ?? [
    RecoveryActionType.GO_HOME,
  ];

  return {
    errorType,
    statusCode,
    severity,
    title,
    description,
    recoveryActions,
    seoTitle,
    seoDescription,
    retryable,
    timestamp: Date.now(),
    url: options?.url,
    referrer: options?.referrer,
    customMetadata: options?.customMetadata,
  };
};

/**
 * Format error details for display
 */
export const formatErrorDetails = (error: Error): string => {
  const parts: string[] = [];

  parts.push(`Error: ${error.message}`);

  if ('status' in error || 'statusCode' in error) {
    const status =
      ('status' in error ? error.status : null) ??
      ('statusCode' in error ? error.statusCode : null);
    if (status) {
      parts.push(`Status Code: ${status}`);
    }
  }

  if (error.stack) {
    parts.push(`\nStack Trace:\n${error.stack}`);
  }

  return parts.join('\n');
};

/**
 * Get error page title for document.title
 */
export const getErrorPageTitle = (errorType: PageErrorType): string => {
  // eslint-disable-next-line security/detect-object-injection
  return ERROR_TYPE_SEO_TITLES[errorType];
};

/**
 * Check if error should trigger analytics
 */
export const shouldTrackError = (errorType: PageErrorType): boolean => {
  // Don't track common client errors to avoid noise
  const noTrackTypes = [PageErrorType.NOT_FOUND];

  return !noTrackTypes.includes(errorType);
};
