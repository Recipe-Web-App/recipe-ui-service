import {
  type ServiceErrorDetectionResult,
  ServiceType,
  ServiceHealthStatus,
  ErrorSeverity,
  SERVICE_ERROR_CLASS_NAMES,
  DEFAULT_RETRYABLE_STATUS_CODES,
  DEFAULT_NON_RETRYABLE_STATUS_CODES,
} from '@/types/error/service-errors';

/**
 * Detects if an error is a service-specific error and extracts metadata
 */
export const detectServiceError = (
  error: Error,
  serviceType: ServiceType
): ServiceErrorDetectionResult => {
  // eslint-disable-next-line security/detect-object-injection
  const expectedClassName = SERVICE_ERROR_CLASS_NAMES[serviceType];
  const isServiceError = error.name === expectedClassName;

  // Extract status code if available
  const statusCode = (error as { status?: number }).status;

  // Determine if error is retryable based on status code
  const isRetryableStatusCode =
    statusCode !== undefined &&
    DEFAULT_RETRYABLE_STATUS_CODES.includes(statusCode);

  const isNonRetryableStatusCode =
    statusCode !== undefined &&
    DEFAULT_NON_RETRYABLE_STATUS_CODES.includes(statusCode);

  // Default to retryable if no status code or if it's a 5xx error
  const retryable = isServiceError
    ? !isNonRetryableStatusCode || isRetryableStatusCode
    : false;

  // Determine severity
  let severity = ErrorSeverity.ERROR;
  if (statusCode && statusCode >= 500) {
    severity = ErrorSeverity.CRITICAL;
  } else if (statusCode && statusCode >= 400 && statusCode < 500) {
    severity = ErrorSeverity.ERROR;
  }

  return {
    isServiceError,
    serviceType: isServiceError ? serviceType : undefined,
    statusCode,
    retryable,
    severity,
  };
};

/**
 * Determines health status based on error and network state
 */
export const determineHealthStatus = (
  hasError: boolean,
  isOnline: boolean,
  statusCode?: number
): ServiceHealthStatus => {
  if (!isOnline) {
    return ServiceHealthStatus.OFFLINE;
  }

  if (!hasError) {
    return ServiceHealthStatus.HEALTHY;
  }

  if (statusCode === 503) {
    return ServiceHealthStatus.MAINTENANCE;
  }

  if (statusCode && statusCode >= 500) {
    return ServiceHealthStatus.UNHEALTHY;
  }

  return ServiceHealthStatus.DEGRADED;
};
