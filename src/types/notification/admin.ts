/**
 * Notification Admin Types
 *
 * Types for admin endpoints and health checks.
 * Based on notification-service-openapi.yaml specification.
 */

import type { HealthStatus, ServiceHealthStatus } from './enums';

// =============================================================================
// Statistics
// =============================================================================

/**
 * Status breakdown counts
 */
export interface StatusBreakdown {
  PENDING?: number;
  QUEUED?: number;
  SENT?: number;
  FAILED?: number;
  ABORTED?: number;
}

/**
 * Type (channel) breakdown counts
 */
export interface TypeBreakdown {
  EMAIL?: number;
  IN_APP?: number;
  PUSH?: number;
  SMS?: number;
}

/**
 * Failed notification details
 */
export interface FailedNotificationStats {
  /**
   * Total number of failed notifications
   */
  total: number;

  /**
   * Breakdown by error type
   */
  by_error_type: Record<string, number>;
}

/**
 * Retry statistics
 */
export interface RetryStatistics {
  /**
   * Total number of notifications that have been retried (retry_count > 0)
   */
  total_retried: number;

  /**
   * Number of FAILED notifications that can still be retried
   */
  currently_retrying: number;

  /**
   * Number of FAILED notifications that have exhausted retries
   */
  exhausted_retries: number;

  /**
   * Average retry_count for successfully sent notifications
   */
  average_retries_before_success: number;

  /**
   * Success rate for retried notifications (sent with retries / total retried)
   */
  retry_success_rate: number;
}

/**
 * Date range for statistics
 */
export interface DateRange {
  start: string;
  end: string;
}

/**
 * Complete notification statistics
 * Returned from GET /stats
 */
export interface NotificationStats {
  /**
   * Total number of notifications in the date range
   */
  total_notifications: number;

  /**
   * Count of notifications by delivery status
   */
  status_breakdown: StatusBreakdown;

  /**
   * Count of notifications by delivery channel
   */
  type_breakdown: TypeBreakdown;

  /**
   * Success rate (sent / total)
   */
  success_rate: number;

  /**
   * Average time from queued to sent in seconds
   */
  average_send_time_seconds: number;

  /**
   * Failed notification breakdown
   */
  failed_notifications: FailedNotificationStats;

  /**
   * Retry statistics
   */
  retry_statistics: RetryStatistics;

  /**
   * Date range for the statistics
   */
  date_range: DateRange;
}

/**
 * Parameters for querying statistics
 */
export interface NotificationStatsParams {
  /**
   * Start date for statistics range (ISO 8601)
   */
  start_date?: string;

  /**
   * End date for statistics range (ISO 8601)
   */
  end_date?: string;
}

// =============================================================================
// Retry Operations
// =============================================================================

/**
 * Response from retry failed notifications operation
 * Returned from POST /notifications/retry-failed
 */
export interface RetryFailedResponse {
  /**
   * Number of notifications queued for retry
   */
  queued_count: number;

  /**
   * Number of eligible failed notifications not retried in this batch
   */
  remaining_failed: number;

  /**
   * Total number of eligible failed notifications
   */
  total_eligible: number;

  /**
   * Response message
   */
  message: string;
}

/**
 * Response from retry status check
 * Returned from GET /notifications/retry-status
 */
export interface RetryStatusResponse {
  /**
   * Number of FAILED notifications that can still be retried (retry_count < max_retries)
   */
  failed_retryable: number;

  /**
   * Number of FAILED notifications that have exhausted retries (retry_count >= max_retries)
   */
  failed_exhausted: number;

  /**
   * Number of notifications currently being processed (status = QUEUED)
   */
  currently_queued: number;

  /**
   * Boolean indicating if it's safe to queue more retries (true when currently_queued = 0)
   */
  safe_to_retry: boolean;
}

/**
 * Response from single notification retry
 * Returned from POST /notifications/{id}/retry
 */
export interface RetryNotificationResponse {
  /**
   * ID of the notification queued for retry
   */
  notification_id: string;

  /**
   * New status (should be 'queued')
   */
  status: 'queued';

  /**
   * Response message
   */
  message: string;
}

// =============================================================================
// Templates
// =============================================================================

/**
 * Template information
 * Returned from GET /templates
 */
export interface TemplateInfo {
  /**
   * Template type identifier (e.g., 'recipe_published')
   */
  template_type: string;

  /**
   * Human-readable display name
   */
  display_name: string;

  /**
   * Description of when this template is used
   */
  description: string;

  /**
   * List of required fields for this template
   */
  required_fields: string[];

  /**
   * API endpoint for this template
   */
  endpoint: string;
}

/**
 * Response from list templates
 * Returned from GET /templates
 */
export interface TemplateListResponse {
  templates: TemplateInfo[];
}

// =============================================================================
// Health
// =============================================================================

/**
 * Health check response for individual services
 */
export interface ServiceHealthCheck {
  database: ServiceHealthStatus;
  redis: ServiceHealthStatus;
  smtp: ServiceHealthStatus;
}

/**
 * Health check response
 * Returned from GET /health/ready
 */
export interface HealthResponse {
  /**
   * Overall health status
   */
  status: HealthStatus;

  /**
   * Individual service health checks
   */
  checks: ServiceHealthCheck;
}

/**
 * Liveness check response
 * Returned from GET /health/live
 */
export interface LivenessResponse {
  /**
   * Service liveness status
   */
  status: 'alive';
}
