/**
 * Error alert utility functions
 *
 * This module provides utility functions for normalizing errors from various sources,
 * extracting validation errors, and determining error properties.
 */

import type { ZodError } from 'zod';
import type {
  ErrorAlertProps,
  ErrorSource,
  ErrorAlertSeverity,
  NormalizedError,
  ValidationError,
  ZodErrorExtraction,
  NetworkError,
  ErrorFormatOptions,
} from '@/types/error/error-alert';
import type { ServiceErrorMetadata } from '@/types/error/service-errors';
import type { ComponentErrorMetadata } from '@/types/error/component-errors';
import type {
  PageErrorMetadata,
  PageErrorSeverity,
} from '@/types/error/page-errors';

/**
 * Normalize error from various sources to unified format
 */
export function normalizeError(props: ErrorAlertProps): NormalizedError | null {
  // Priority order: zodError > validationErrors > serviceError > componentError > pageError > error

  if (props.zodError) {
    return normalizeZodError(props.zodError);
  }

  if (props.validationErrors && props.validationErrors.length > 0) {
    return normalizeValidationErrors(props.validationErrors);
  }

  if (props.serviceError) {
    return normalizeServiceError(props.serviceError);
  }

  if (props.componentError) {
    return normalizeComponentError(props.componentError);
  }

  if (props.pageError) {
    return normalizePageError(props.pageError);
  }

  if (props.error) {
    return normalizeGenericError(props.error);
  }

  return null;
}

/**
 * Normalize Zod validation error
 */
function normalizeZodError(zodError: ZodError): NormalizedError {
  const extraction = extractZodErrors(zodError);

  return {
    source: 'validation' as ErrorSource,
    severity: 'error' as ErrorAlertSeverity,
    title: 'Validation Error',
    message:
      extraction.count === 1
        ? extraction.errors[0].message
        : `${extraction.count} validation errors occurred`,
    errors: extraction.errors,
    metadata: {
      fields: extraction.fields,
      count: extraction.count,
    },
    fingerprint: generateErrorFingerprint({
      source: 'validation',
      fields: extraction.fields,
    }),
    timestamp: Date.now(),
    retryable: false,
  };
}

/**
 * Normalize validation errors array
 */
function normalizeValidationErrors(
  validationErrors: ValidationError[]
): NormalizedError {
  const fields = validationErrors.map(e => e.field);

  return {
    source: 'validation' as ErrorSource,
    severity: 'error' as ErrorAlertSeverity,
    title: 'Validation Error',
    message:
      validationErrors.length === 1
        ? validationErrors[0].message
        : `${validationErrors.length} validation errors occurred`,
    errors: validationErrors,
    metadata: {
      fields,
      count: validationErrors.length,
    },
    fingerprint: generateErrorFingerprint({
      source: 'validation',
      fields,
    }),
    timestamp: Date.now(),
    retryable: false,
  };
}

/**
 * Normalize service error
 */
function normalizeServiceError(
  serviceError: ServiceErrorMetadata
): NormalizedError {
  const severity = mapServiceSeverityToAlertSeverity(serviceError.severity);

  return {
    source: 'service' as ErrorSource,
    severity,
    title: `${serviceError.serviceName} Error`,
    message: `An error occurred in the ${serviceError.serviceName} service`,
    metadata: {
      serviceType: serviceError.serviceType,
      endpoint: serviceError.endpoint,
      statusCode: serviceError.statusCode,
      requestId: serviceError.requestId,
    },
    fingerprint: generateErrorFingerprint({
      source: 'service',
      serviceType: serviceError.serviceType,
      statusCode: serviceError.statusCode,
    }),
    timestamp: serviceError.timestamp,
    retryable: serviceError.retryable,
  };
}

/**
 * Normalize component error
 */
function normalizeComponentError(
  componentError: ComponentErrorMetadata
): NormalizedError {
  const severity = mapComponentSeverityToAlertSeverity(componentError.severity);

  return {
    source: 'component' as ErrorSource,
    severity,
    title: `Component Error: ${componentError.componentDisplayName ?? componentError.componentName}`,
    message: componentError.message,
    metadata: {
      componentName: componentError.componentName,
      errorType: componentError.errorType,
      retryCount: componentError.retryCount,
    },
    fingerprint: componentError.fingerprint,
    timestamp: componentError.timestamp,
    retryable: componentError.retryable,
  };
}

/**
 * Normalize page error
 */
function normalizePageError(pageError: PageErrorMetadata): NormalizedError {
  const severity = mapPageSeverityToAlertSeverity(pageError.severity);

  return {
    source: 'page' as ErrorSource,
    severity,
    title: pageError.title,
    message: pageError.description,
    metadata: {
      errorType: pageError.errorType,
      statusCode: pageError.statusCode,
      url: pageError.url,
    },
    fingerprint: generateErrorFingerprint({
      source: 'page',
      statusCode: pageError.statusCode,
      errorType: pageError.errorType,
    }),
    timestamp: pageError.timestamp,
    retryable: pageError.retryable,
  };
}

/**
 * Normalize generic error
 */
function normalizeGenericError(error: Error | string): NormalizedError {
  const message = typeof error === 'string' ? error : error.message;
  const isNetworkError = detectNetworkError(error);

  return {
    source: (isNetworkError ? 'network' : 'custom') as ErrorSource,
    severity: 'error' as ErrorAlertSeverity,
    title: isNetworkError ? 'Network Error' : 'Error',
    message,
    metadata:
      typeof error === 'object'
        ? {
            name: error.name,
            stack: error.stack,
          }
        : undefined,
    fingerprint: generateErrorFingerprint({
      source: isNetworkError ? 'network' : 'custom',
      message,
    }),
    timestamp: Date.now(),
    retryable: isNetworkError,
  };
}

/**
 * Extract validation errors from Zod error
 */
export function extractZodErrors(zodError: ZodError): ZodErrorExtraction {
  const errors: ValidationError[] = [];
  const fields: string[] = [];

  const issues = zodError.issues;
  for (const issue of issues) {
    const field = issue.path.join('.');
    fields.push(field);

    errors.push({
      field,
      message: issue.message,
      code: issue.code,
    });
  }

  return {
    errors,
    count: errors.length,
    fields,
  };
}

/**
 * Map service error severity to alert severity
 */
function mapServiceSeverityToAlertSeverity(
  severity: 'warning' | 'error' | 'critical'
): ErrorAlertSeverity {
  switch (severity) {
    case 'warning':
      return 'warning' as ErrorAlertSeverity;
    case 'critical':
    case 'error':
      return 'error' as ErrorAlertSeverity;
    default:
      return 'error' as ErrorAlertSeverity;
  }
}

/**
 * Map component error severity to alert severity
 */
function mapComponentSeverityToAlertSeverity(
  severity: 'critical' | 'error' | 'warning' | 'info'
): ErrorAlertSeverity {
  switch (severity) {
    case 'critical':
    case 'error':
      return 'error' as ErrorAlertSeverity;
    case 'warning':
      return 'warning' as ErrorAlertSeverity;
    case 'info':
      return 'info' as ErrorAlertSeverity;
    default:
      return 'error' as ErrorAlertSeverity;
  }
}

/**
 * Map page error severity to alert severity
 */
function mapPageSeverityToAlertSeverity(
  severity: PageErrorSeverity
): ErrorAlertSeverity {
  switch (severity) {
    case 'info':
      return 'info' as ErrorAlertSeverity;
    case 'warning':
      return 'warning' as ErrorAlertSeverity;
    case 'error':
    case 'critical':
      return 'error' as ErrorAlertSeverity;
    default:
      return 'error' as ErrorAlertSeverity;
  }
}

/**
 * Generate error fingerprint for deduplication
 */
export function generateErrorFingerprint(params: {
  source: string;
  [key: string]: unknown;
}): string {
  const keys = Object.keys(params).sort();
  const values = keys.map(key => {
    // eslint-disable-next-line security/detect-object-injection -- Safe: key comes from Object.keys() which only returns own enumerable properties
    const value = params[key];
    return `${key}:${String(value)}`;
  });
  return values.join('|');
}

/**
 * Detect if error is a network error
 */
function detectNetworkError(error: Error | string): boolean {
  if (typeof error === 'string') {
    return /network|offline|connection|timeout/i.test(error);
  }

  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  return (
    /network|offline|connection|timeout|fetch|xhr/i.test(message) ||
    /network|fetch|xhr/i.test(name)
  );
}

/**
 * Parse network error details
 */
export function parseNetworkError(error: Error | string): NetworkError {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();

  if (/offline/i.test(lowerMessage)) {
    return {
      type: 'offline',
      message:
        'You are currently offline. Please check your internet connection.',
    };
  }

  if (/timeout/i.test(lowerMessage)) {
    return {
      type: 'timeout',
      message: 'The request timed out. Please try again.',
    };
  }

  if (/connection|network/i.test(lowerMessage)) {
    return {
      type: 'connection',
      message: 'Unable to connect to the server. Please check your connection.',
    };
  }

  return {
    type: 'unknown',
    message: 'A network error occurred. Please try again.',
  };
}

/**
 * Format error for display
 */
export function formatError(
  error: NormalizedError,
  options: ErrorFormatOptions = {}
): {
  title: string;
  message: string;
  details?: string;
} {
  const { maxMessageLength = 500, includeMetadata = false } = options;

  let message = error.message;

  // Truncate long messages
  if (message.length > maxMessageLength) {
    message = `${message.substring(0, maxMessageLength)}...`;
  }

  const result: {
    title: string;
    message: string;
    details?: string;
  } = {
    title: error.title,
    message,
  };

  // Add details if requested
  if (includeMetadata) {
    const detailsParts: string[] = [];

    if (includeMetadata && error.metadata) {
      detailsParts.push(`Metadata: ${JSON.stringify(error.metadata, null, 2)}`);
    }

    if (detailsParts.length > 0) {
      result.details = detailsParts.join('\n\n');
    }
  }

  return result;
}

/**
 * Determine if error is retryable
 */
export function isErrorRetryable(error: NormalizedError): boolean {
  return error.retryable;
}

/**
 * Get recovery hint for error
 */
export function getRecoveryHint(error: NormalizedError): string | undefined {
  switch (error.source) {
    case 'validation':
      return 'Please correct the highlighted fields and try again.';
    case 'network':
      return 'Check your internet connection and try again.';
    case 'service':
      return error.retryable
        ? 'This is a temporary issue. Please try again in a moment.'
        : 'Please contact support if this issue persists.';
    case 'component':
      return 'Try refreshing the page or clearing your browser cache.';
    default:
      return undefined;
  }
}

/**
 * Deduplicate errors by fingerprint
 */
export function deduplicateErrors(
  errors: NormalizedError[]
): NormalizedError[] {
  const seen = new Set<string>();
  return errors.filter(error => {
    if (seen.has(error.fingerprint)) {
      return false;
    }
    seen.add(error.fingerprint);
    return true;
  });
}
