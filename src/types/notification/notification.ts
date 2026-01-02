/**
 * Notification Detail Types for Notification Service
 *
 * Types for querying and managing notification delivery status.
 * Based on notification-service-openapi.yaml specification.
 */

import type {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
} from './enums';
import type { NotificationData } from './notification-data';

/**
 * Delivery status for a specific notification channel
 * Tracks the delivery lifecycle for each channel (EMAIL, IN_APP, PUSH, SMS)
 */
export interface NotificationDeliveryStatus {
  /**
   * Notification delivery channel type
   */
  notificationType: NotificationType;

  /**
   * Current delivery status
   */
  status: NotificationStatus;

  /**
   * Number of retry attempts (null if no retries attempted)
   */
  retryCount?: number | null;

  /**
   * Error message if status is FAILED
   */
  errorMessage?: string | null;

  /**
   * Recipient email address (for EMAIL channel only)
   */
  recipientEmail?: string | null;

  /**
   * Timestamp when status record was created
   */
  createdAt: string;

  /**
   * Timestamp when status record was last updated
   */
  updatedAt: string;

  /**
   * Timestamp when notification was queued for delivery
   */
  queuedAt?: string | null;

  /**
   * Timestamp when notification was successfully sent
   */
  sentAt?: string | null;

  /**
   * Timestamp when notification permanently failed
   */
  failedAt?: string | null;
}

/**
 * Detailed notification information including delivery statuses
 * Returned from GET /notifications/{notificationId}
 *
 * The title and message fields are computed on-the-fly from
 * notificationCategory + notificationData. They are not stored in the database.
 */
export interface NotificationDetail {
  /**
   * Notification UUID
   */
  notificationId: string;

  /**
   * User UUID who owns this notification
   */
  userId: string;

  /**
   * Notification category for template identification
   */
  notificationCategory: NotificationCategory;

  /**
   * Whether the notification has been read (in-app state)
   */
  isRead: boolean;

  /**
   * Whether the notification has been soft deleted
   */
  isDeleted: boolean;

  /**
   * Timestamp when notification was created
   */
  createdAt: string;

  /**
   * Timestamp when notification was last updated
   */
  updatedAt: string;

  /**
   * Template parameters including templateVersion for historical rendering.
   * The schema varies based on notificationCategory.
   */
  notificationData: NotificationData;

  /**
   * Computed title from notificationCategory + notificationData (not stored in DB)
   */
  title: string;

  /**
   * Computed message from notificationCategory + notificationData (not stored in DB)
   */
  message: string;

  /**
   * Delivery status for each channel (EMAIL, IN_APP, PUSH, SMS)
   * A single notification can have multiple delivery statuses if sent via multiple channels
   */
  deliveryStatuses: NotificationDeliveryStatus[];
}

/**
 * Paginated list of notification details
 * Returned from admin endpoints that list notifications
 */
export interface NotificationListResponse {
  /**
   * List of notifications
   */
  results: NotificationDetail[];

  /**
   * Total number of notifications matching filters
   */
  count: number;

  /**
   * URL to next page (null if no next page)
   */
  next: string | null;

  /**
   * URL to previous page (null if no previous page)
   */
  previous: string | null;
}
