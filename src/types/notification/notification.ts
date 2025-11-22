/**
 * Notification Detail Types for Notification Service
 *
 * Types for querying and managing notification status.
 */

/**
 * Notification status enum
 */
export enum NotificationStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed',
}

/**
 * Notification type enum
 */
export enum NotificationType {
  EMAIL = 'email',
}

/**
 * Detailed notification information
 */
export interface NotificationDetail {
  /**
   * Notification UUID
   */
  notification_id: string;

  /**
   * Recipient user ID (null for email-only notifications)
   */
  recipient_id: string | null;

  /**
   * Recipient email address
   */
  recipient_email: string;

  /**
   * Email subject line
   */
  subject: string;

  /**
   * Message body (excluded by default to reduce payload size)
   * Use include_message query parameter to retrieve
   */
  message?: string;

  /**
   * Notification delivery type
   */
  notification_type: NotificationType;

  /**
   * Current notification status
   */
  status: NotificationStatus;

  /**
   * Error message if status is failed (empty string when no error)
   */
  error_message: string;

  /**
   * Number of retry attempts
   */
  retry_count: number;

  /**
   * Maximum number of retries allowed
   */
  max_retries: number;

  /**
   * Timestamp when notification was created
   */
  created_at: string;

  /**
   * Timestamp when notification was queued (null if not yet queued)
   */
  queued_at: string | null;

  /**
   * Timestamp when notification was sent (null if not yet sent)
   */
  sent_at: string | null;

  /**
   * Timestamp when notification failed (null if not failed)
   */
  failed_at: string | null;

  /**
   * Template-specific metadata
   */
  metadata?: Record<string, unknown>;
}
