import type { ErrorInfo } from 'react';
import type { BaseErrorBoundaryProps } from '@/types/ui/error-boundary';

/**
 * Enum for all microservices in the application
 */
export enum ServiceType {
  AUTH = 'auth',
  RECIPE_MANAGEMENT = 'recipe-management',
  RECIPE_SCRAPER = 'recipe-scraper',
  MEDIA_MANAGEMENT = 'media-management',
  USER_MANAGEMENT = 'user-management',
  MEAL_PLAN_MANAGEMENT = 'meal-plan-management',
}

/**
 * Service health status
 */
export enum ServiceHealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error recovery strategies
 */
export enum RecoveryStrategy {
  RETRY = 'retry',
  REDIRECT = 'redirect',
  FALLBACK = 'fallback',
  REFRESH = 'refresh',
  IGNORE = 'ignore',
}

/**
 * Service error metadata
 */
export interface ServiceErrorMetadata {
  serviceType: ServiceType;
  serviceName: string;
  endpoint?: string;
  statusCode?: number;
  timestamp: number;
  requestId?: string;
  retryable: boolean;
  severity: ErrorSeverity;
}

/**
 * Service error context
 */
export interface ServiceErrorContext {
  error: Error;
  errorInfo: ErrorInfo;
  metadata: ServiceErrorMetadata;
  healthStatus: ServiceHealthStatus;
  isOnline: boolean;
}

/**
 * Service error fallback props
 */
export interface ServiceErrorFallbackProps {
  error: Error;
  metadata: ServiceErrorMetadata;
  healthStatus: ServiceHealthStatus;
  isOnline: boolean;
  resetErrorBoundary: () => void;
  onRetry?: () => void;
  onRedirect?: (url: string) => void;
}

/**
 * Service error boundary configuration
 */
export interface ServiceErrorBoundaryConfig {
  serviceType: ServiceType;
  serviceName: string;
  maxRetries?: number;
  retryDelay?: number;
  retryableStatusCodes?: number[];
  nonRetryableStatusCodes?: number[];
  recoveryStrategy?: RecoveryStrategy;
  redirectUrl?: string;
  fallbackComponent?: React.ComponentType<ServiceErrorFallbackProps>;
  onServiceError?: (context: ServiceErrorContext) => void;
  enableHealthCheck?: boolean;
  healthCheckInterval?: number;
  enableOfflineDetection?: boolean;
}

/**
 * Service error boundary props
 */
export interface ServiceErrorBoundaryProps
  extends Omit<BaseErrorBoundaryProps, 'variant'> {
  config: ServiceErrorBoundaryConfig;
  variant?: 'inline' | 'card' | 'page';
  showServiceStatus?: boolean;
  showRetryInfo?: boolean;
  customFallback?: React.ComponentType<ServiceErrorFallbackProps>;
}

/**
 * Service-specific error classes mapping
 */
export interface ServiceErrorClass {
  new (
    message: string,
    status?: number,
    details?: Record<string, unknown>
  ): Error;
}

/**
 * Service error detection result
 */
export interface ServiceErrorDetectionResult {
  isServiceError: boolean;
  serviceType?: ServiceType;
  statusCode?: number;
  retryable: boolean;
  severity: ErrorSeverity;
}

/**
 * Network status
 */
export interface NetworkStatus {
  isOnline: boolean;
  lastChecked: number;
  downtime?: number;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  currentRetry: number;
  retryDelay: number;
  backoffMultiplier: number;
  retryable: boolean;
}

/**
 * Service error boundary state
 */
export interface ServiceErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorMetadata: ServiceErrorMetadata | null;
  healthStatus: ServiceHealthStatus;
  networkStatus: NetworkStatus;
  retryConfig: RetryConfig;
  lastErrorTime: number | null;
}

/**
 * Default retryable status codes (5xx errors)
 */
export const DEFAULT_RETRYABLE_STATUS_CODES = [
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
];

/**
 * Default non-retryable status codes (4xx errors)
 */
export const DEFAULT_NON_RETRYABLE_STATUS_CODES = [
  400, // Bad Request
  401, // Unauthorized
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  409, // Conflict
  422, // Unprocessable Entity
];

/**
 * Service error class names for detection
 */
export const SERVICE_ERROR_CLASS_NAMES: Record<ServiceType, string> = {
  [ServiceType.AUTH]: 'AuthApiError',
  [ServiceType.RECIPE_MANAGEMENT]: 'RecipeManagementApiError',
  [ServiceType.RECIPE_SCRAPER]: 'RecipeScraperApiError',
  [ServiceType.MEDIA_MANAGEMENT]: 'MediaManagementApiError',
  [ServiceType.USER_MANAGEMENT]: 'UserManagementApiError',
  [ServiceType.MEAL_PLAN_MANAGEMENT]: 'MealPlanManagementApiError',
};

/**
 * Service display names
 */
export const SERVICE_DISPLAY_NAMES: Record<ServiceType, string> = {
  [ServiceType.AUTH]: 'Authentication Service',
  [ServiceType.RECIPE_MANAGEMENT]: 'Recipe Management Service',
  [ServiceType.RECIPE_SCRAPER]: 'Recipe Scraper Service',
  [ServiceType.MEDIA_MANAGEMENT]: 'Media Management Service',
  [ServiceType.USER_MANAGEMENT]: 'User Management Service',
  [ServiceType.MEAL_PLAN_MANAGEMENT]: 'Meal Plan Management Service',
};
