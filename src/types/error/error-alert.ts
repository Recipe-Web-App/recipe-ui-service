/**
 * Error alert types and configurations for inline error messages
 *
 * This module defines types for displaying contextual error messages
 * throughout the application, supporting various error sources including
 * form validation, API errors, service errors, and custom messages.
 */

import type { ZodError } from 'zod';
import type { ServiceErrorMetadata } from './service-errors';
import type { ComponentErrorMetadata } from './component-errors';
import type { PageErrorMetadata } from './page-errors';

/**
 * Error source types
 */
export enum ErrorSource {
  VALIDATION = 'validation', // Form/Zod validation errors
  API = 'api', // API response errors
  SERVICE = 'service', // Service-level errors
  COMPONENT = 'component', // Component-level errors
  PAGE = 'page', // Page-level errors
  NETWORK = 'network', // Network/connectivity errors
  CUSTOM = 'custom', // Custom error messages
}

/**
 * Error alert severity levels
 */
export enum ErrorAlertSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Validation error for a single field
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Recovery action for error alerts
 */
export interface ErrorAlertRecoveryAction {
  type: 'retry' | 'dismiss' | 'clear' | 'custom';
  label: string;
  handler: () => void;
  icon?: React.ComponentType;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

/**
 * Error alert configuration
 */
export interface ErrorAlertConfig {
  /** Visual variant */
  variant?: 'inline' | 'banner' | 'toast' | 'card';

  /** Severity level */
  severity?: ErrorAlertSeverity;

  /** Auto-dismiss timeout in ms (false to disable) */
  autoDismiss?: number | false;

  /** Show icon */
  showIcon?: boolean;

  /** Show close button */
  showClose?: boolean;

  /** Show recovery actions */
  showRecoveryActions?: boolean;

  /** Collapsible error list */
  collapsible?: boolean;

  /** Maximum errors to display before collapsing */
  maxErrors?: number;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Position (for toast variant) */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Normalized error structure
 */
export interface NormalizedError {
  source: ErrorSource;
  severity: ErrorAlertSeverity;
  title: string;
  message: string;
  errors?: ValidationError[];
  metadata?: Record<string, unknown>;
  fingerprint: string;
  timestamp: number;
  retryable: boolean;
}

/**
 * Error alert props
 */
export interface ErrorAlertProps {
  // Error sources (one of these should be provided)
  /** Generic error or error message */
  error?: Error | string | null;

  /** Zod validation error */
  zodError?: ZodError | null;

  /** Validation errors array */
  validationErrors?: ValidationError[] | null;

  /** Service error metadata */
  serviceError?: ServiceErrorMetadata | null;

  /** Component error metadata */
  componentError?: ComponentErrorMetadata | null;

  /** Page error metadata */
  pageError?: PageErrorMetadata | null;

  // Configuration
  /** Error alert configuration */
  config?: ErrorAlertConfig;

  /** Visual variant (overrides config) */
  variant?: 'inline' | 'banner' | 'toast' | 'card';

  /** Severity level (overrides auto-detection) */
  severity?: ErrorAlertSeverity;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  // Display customization
  /** Custom title */
  title?: string;

  /** Custom description */
  description?: string;

  /** Recovery actions */
  recoveryActions?: ErrorAlertRecoveryAction[];

  /** Additional hints for recovery */
  hint?: string;

  // Auto-dismiss
  /** Auto-dismiss timeout in ms (false to disable) */
  autoDismiss?: number | false;

  // Callbacks
  /** Called when alert is dismissed */
  onDismiss?: () => void;

  /** Called when retry action is clicked */
  onRetry?: () => void;

  /** Called when clear action is clicked */
  onClear?: () => void;

  /** Called when any recovery action is executed */
  onAction?: (action: ErrorAlertRecoveryAction) => void;

  /** Analytics callback */
  onAnalytics?: (event: ErrorAlertAnalyticsEvent) => void;

  // Styling
  /** Additional CSS classes */
  className?: string;

  /** Show icon */
  showIcon?: boolean;

  /** Show close button */
  showClose?: boolean;

  /** Collapsible error list */
  collapsible?: boolean;

  /** Maximum errors to display */
  maxErrors?: number;

  // Accessibility
  /** ARIA label */
  'aria-label'?: string;

  /** Test ID */
  'data-testid'?: string;
}

/**
 * Error alert analytics event
 */
export interface ErrorAlertAnalyticsEvent {
  type: 'displayed' | 'dismissed' | 'retry' | 'action';
  errorSource: ErrorSource;
  severity: ErrorAlertSeverity;
  errorFingerprint: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Error alert state
 */
export interface ErrorAlertState {
  isVisible: boolean;
  isExpanded: boolean;
  autoDismissTimer: NodeJS.Timeout | null;
}

/**
 * Error formatting options
 */
export interface ErrorFormatOptions {
  includeStack?: boolean;
  includeMetadata?: boolean;
  maxMessageLength?: number;
  maxErrors?: number;
}

/**
 * Zod error extraction result
 */
export interface ZodErrorExtraction {
  errors: ValidationError[];
  count: number;
  fields: string[];
}

/**
 * Network error details
 */
export interface NetworkError {
  type: 'offline' | 'timeout' | 'connection' | 'unknown';
  message: string;
  statusCode?: number;
}
