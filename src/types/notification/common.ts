/**
 * Common Types for Notification Service
 *
 * Shared types used across notification service API endpoints.
 */

/**
 * Standard error response from notification service
 */
export interface ErrorResponse {
  /**
   * Error code
   */
  error: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Additional error details
   */
  detail?: string;

  /**
   * Field-specific validation errors
   */
  errors?: Record<string, unknown>;
}

/**
 * Batch notification response
 * Returned when notifications are successfully queued
 */
export interface BatchNotificationResponse {
  /**
   * List of created notifications mapped to recipients
   */
  notifications: Array<{
    /**
     * UUID of the created notification
     */
    notification_id: string;

    /**
     * UUID of the recipient user
     */
    recipient_id: string;
  }>;

  /**
   * Number of notifications successfully queued
   */
  queued_count: number;

  /**
   * Response message
   */
  message: string;
}
