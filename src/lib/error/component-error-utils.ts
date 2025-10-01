/**
 * Component error utility functions
 *
 * This module provides utility functions for component-level error handling,
 * including error classification, fingerprinting, and recovery strategies.
 */

import {
  ComponentErrorType,
  ComponentErrorSeverity,
  RecoveryStrategy,
  FallbackMode,
  type ComponentErrorMetadata,
  type PropsValidationResult,
  ERROR_TYPE_TO_SEVERITY,
  ERROR_TYPE_TO_RECOVERY_STRATEGY,
} from '@/types/error/component-errors';

/**
 * Error type detection patterns
 */
const ERROR_TYPE_PATTERNS: Record<ComponentErrorType, RegExp[]> = {
  [ComponentErrorType.RENDER_ERROR]: [
    /render/i,
    /cannot read propert/i,
    /undefined is not/i,
    /null is not/i,
  ],
  [ComponentErrorType.PROPS_ERROR]: [
    /props/i,
    /proptype/i,
    /expected.*but got/i,
    /invalid prop/i,
  ],
  [ComponentErrorType.LIFECYCLE_ERROR]: [
    /componentdidmount/i,
    /componentdidupdate/i,
    /componentwillunmount/i,
    /useeffect/i,
  ],
  [ComponentErrorType.DATA_ERROR]: [
    /data/i,
    /fetch/i,
    /json/i,
    /parse/i,
    /network/i,
  ],
  [ComponentErrorType.STATE_ERROR]: [
    /state/i,
    /setstate/i,
    /usestate/i,
    /reducer/i,
  ],
  [ComponentErrorType.EVENT_HANDLER_ERROR]: [
    /onclick/i,
    /onchange/i,
    /onsubmit/i,
    /handler/i,
    /event/i,
  ],
  [ComponentErrorType.ASYNC_ERROR]: [
    /async/i,
    /promise/i,
    /await/i,
    /timeout/i,
  ],
  [ComponentErrorType.UNKNOWN]: [],
};

/**
 * Detect component error type from error object
 */
export const detectComponentErrorType = (error: Error): ComponentErrorType => {
  const errorMessage = error.message.toLowerCase();
  const errorStack = (error.stack ?? '').toLowerCase();
  const combined = `${errorMessage} ${errorStack}`;

  // Check each error type pattern
  for (const [errorType, patterns] of Object.entries(ERROR_TYPE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(combined)) {
        return errorType as ComponentErrorType;
      }
    }
  }

  return ComponentErrorType.UNKNOWN;
};

/**
 * Extract component name from component stack
 */
export const extractComponentName = (
  componentStack: string | undefined,
  fallback = 'Component'
): string => {
  if (!componentStack) {
    return fallback;
  }

  // Try to extract component name from stack
  // Format: "at ComponentName (file.tsx:line:column)"
  const match = componentStack.match(/at\s+(\w+)/);
  if (match?.[1]) {
    return match[1];
  }

  return fallback;
};

/**
 * Generate error fingerprint for deduplication
 */
export const generateErrorFingerprint = (
  error: Error,
  componentName: string
): string => {
  const message = error.message ?? 'unknown';
  const type = error.name ?? 'Error';
  const stackLine = error.stack?.split('\n')[1] ?? '';

  // Create a simple hash-like fingerprint
  const combined = `${type}:${componentName}:${message}:${stackLine}`;

  // Simple string hash (not cryptographic, just for deduplication)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `comp-${Math.abs(hash).toString(36)}`;
};

/**
 * Get error severity for component error type
 */
export const getComponentErrorSeverity = (
  errorType: ComponentErrorType
): ComponentErrorSeverity => {
  if (Object.hasOwn(ERROR_TYPE_TO_SEVERITY, errorType)) {
    return ERROR_TYPE_TO_SEVERITY[
      errorType as keyof typeof ERROR_TYPE_TO_SEVERITY
    ];
  }
  return ComponentErrorSeverity.ERROR;
};

/**
 * Determine recovery strategy for error type
 */
export const determineRecoveryStrategy = (
  errorType: ComponentErrorType
): RecoveryStrategy => {
  if (Object.hasOwn(ERROR_TYPE_TO_RECOVERY_STRATEGY, errorType)) {
    return ERROR_TYPE_TO_RECOVERY_STRATEGY[
      errorType as keyof typeof ERROR_TYPE_TO_RECOVERY_STRATEGY
    ];
  }
  return RecoveryStrategy.FALLBACK;
};

/**
 * Determine if error is retryable
 */
export const isErrorRetryable = (errorType: ComponentErrorType): boolean => {
  const retryableTypes = [
    ComponentErrorType.DATA_ERROR,
    ComponentErrorType.ASYNC_ERROR,
    ComponentErrorType.LIFECYCLE_ERROR,
  ];

  return retryableTypes.includes(errorType);
};

/**
 * Create component error metadata
 */
export const createComponentErrorMetadata = (
  error: Error,
  componentName: string,
  componentStack?: string,
  propsSnapshot?: Record<string, unknown>,
  retryCount = 0
): ComponentErrorMetadata => {
  const errorType = detectComponentErrorType(error);
  const severity = getComponentErrorSeverity(errorType);
  const fingerprint = generateErrorFingerprint(error, componentName);
  const retryable = isErrorRetryable(errorType);

  return {
    errorType,
    severity,
    componentName,
    message: error.message,
    stack: error.stack,
    componentStack,
    propsSnapshot,
    timestamp: Date.now(),
    fingerprint,
    retryable,
    retryCount,
  };
};

/**
 * Validate component props
 */
export const validateComponentProps = (
  props: unknown,
  validator?: (props: unknown) => boolean | string
): PropsValidationResult => {
  if (!validator) {
    return { valid: true };
  }

  try {
    const result = validator(props);

    if (typeof result === 'boolean') {
      return {
        valid: result,
        message: result ? undefined : 'Props validation failed',
      };
    }

    // Result is a string error message
    return {
      valid: false,
      message: result,
    };
  } catch (error) {
    return {
      valid: false,
      message:
        error instanceof Error
          ? error.message
          : 'Props validation threw an error',
    };
  }
};

/**
 * Sanitize props for logging (remove sensitive data)
 */
export const sanitizePropsForLogging = (
  props: Record<string, unknown>
): Record<string, unknown> => {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apikey',
    'api_key',
    'authorization',
    'auth',
    'credential',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    const keyLower = key.toLowerCase();

    // Check if key is sensitive
    const isSensitive = sensitiveKeys.some(sensitiveKey =>
      keyLower.includes(sensitiveKey)
    );

    if (isSensitive) {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'function') {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = '[Function]';
    } else if (value instanceof Error) {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = `[Error: ${value.message}]`;
    } else {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Format error for display
 */
export const formatComponentError = (
  error: Error,
  includeStack = false
): string => {
  const parts: string[] = [];

  parts.push(`${error.name}: ${error.message}`);

  if (includeStack && error.stack) {
    const stackLines = error.stack.split('\n').slice(1, 4); // First 3 stack frames
    parts.push('', ...stackLines);
  }

  return parts.join('\n');
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (
  errorType: ComponentErrorType,
  componentName: string
): string => {
  const messages: Record<ComponentErrorType, string> = {
    [ComponentErrorType.RENDER_ERROR]: `${componentName} encountered an error while rendering`,
    [ComponentErrorType.PROPS_ERROR]: `${componentName} received invalid props`,
    [ComponentErrorType.LIFECYCLE_ERROR]: `${componentName} encountered an error during initialization`,
    [ComponentErrorType.DATA_ERROR]: `${componentName} failed to load data`,
    [ComponentErrorType.STATE_ERROR]: `${componentName} encountered a state error`,
    [ComponentErrorType.EVENT_HANDLER_ERROR]: `${componentName} encountered an error handling an event`,
    [ComponentErrorType.ASYNC_ERROR]: `${componentName} encountered an asynchronous error`,
    [ComponentErrorType.UNKNOWN]: `${componentName} encountered an unexpected error`,
  };

  // eslint-disable-next-line security/detect-object-injection
  return messages[errorType];
};

/**
 * Determine appropriate fallback mode
 */
export const determineFallbackMode = (
  errorType: ComponentErrorType,
  severity: ComponentErrorSeverity
): FallbackMode => {
  // Critical errors should show detailed information
  if (severity === ComponentErrorSeverity.CRITICAL) {
    return FallbackMode.DETAILED;
  }

  // Warning level errors can be hidden
  if (severity === ComponentErrorSeverity.WARNING) {
    return FallbackMode.HIDDEN;
  }

  // Data errors show skeleton (looks like loading)
  if (
    errorType === ComponentErrorType.DATA_ERROR ||
    errorType === ComponentErrorType.ASYNC_ERROR
  ) {
    return FallbackMode.SKELETON;
  }

  // Default to placeholder
  return FallbackMode.PLACEHOLDER;
};

/**
 * Check if error should be logged
 */
export const shouldLogError = (
  errorType: ComponentErrorType,
  severity: ComponentErrorSeverity
): boolean => {
  // Don't log info level errors
  if (severity === ComponentErrorSeverity.INFO) {
    return false;
  }

  // Don't log event handler errors (too noisy)
  if (errorType === ComponentErrorType.EVENT_HANDLER_ERROR) {
    return false;
  }

  return true;
};

/**
 * Check if errors are duplicates based on fingerprint
 */
export const areDuplicateErrors = (
  fingerprint1: string,
  fingerprint2: string
): boolean => {
  return fingerprint1 === fingerprint2;
};

/**
 * Calculate retry delay with exponential backoff
 */
export const calculateRetryDelay = (
  baseDelay: number,
  retryCount: number,
  maxDelay = 10000
): number => {
  // Exponential backoff: baseDelay * (2 ^ retryCount)
  const delay = baseDelay * Math.pow(2, retryCount);

  // Cap at maxDelay
  return Math.min(delay, maxDelay);
};
