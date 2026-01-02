/**
 * User Notification Types
 *
 * Types for user-facing notification management endpoints.
 * These are the notifications displayed in the UI (notification bell, notification page).
 */

import type { NotificationCategory } from './enums';
import type { NotificationData } from './notification-data';

/**
 * User-facing notification with computed title/message fields
 * Returned from GET /users/me/notifications and related endpoints
 */
export interface UserNotification {
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
   * Whether the notification has been read
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
}

/**
 * Paginated list of user notifications
 * Returned from GET /users/me/notifications when countOnly=false
 */
export interface UserNotificationListResponse {
  /**
   * List of notifications
   */
  notifications: UserNotification[];

  /**
   * Total number of notifications matching query
   */
  totalCount: number;

  /**
   * Maximum number of notifications returned
   */
  limit: number;

  /**
   * Number of notifications skipped
   */
  offset: number;
}

/**
 * Count-only response for notifications
 * Returned from GET /users/me/notifications when countOnly=true
 */
export interface UserNotificationCountResponse {
  /**
   * Total number of notifications matching query
   */
  totalCount: number;
}

/**
 * Request to bulk delete notifications
 * Used by DELETE /users/me/notifications
 */
export interface NotificationDeleteRequest {
  /**
   * List of notification IDs to delete (soft delete)
   * Maximum 100 IDs per request
   */
  notificationIds: string[];
}

/**
 * Response from bulk delete operation
 * Returned from DELETE /users/me/notifications
 */
export interface NotificationDeleteResponse {
  /**
   * Success message
   */
  message: string;

  /**
   * List of notification IDs that were successfully deleted
   */
  deletedNotificationIds: string[];
}

/**
 * Response from marking a notification as read
 * Returned from PUT /users/me/notifications/{id}/read
 */
export interface NotificationReadResponse {
  /**
   * Success message
   */
  message: string;
}

/**
 * Response from marking all notifications as read
 * Returned from PUT /users/me/notifications/read-all
 */
export interface NotificationReadAllResponse {
  /**
   * Success message
   */
  message: string;

  /**
   * List of notification IDs that were marked as read
   */
  readNotificationIds: string[];
}

/**
 * Parameters for querying user notifications
 */
export interface UserNotificationParams {
  /**
   * Maximum number of notifications to return (1-100)
   */
  limit?: number;

  /**
   * Number of notifications to skip
   */
  offset?: number;

  /**
   * If true, return only the total count without notification data
   */
  countOnly?: boolean;
}

/**
 * Helper type for hasNewNotifications response
 */
export interface HasNewNotificationsResponse {
  /**
   * Whether there are new notifications since last check
   */
  hasNew: boolean;

  /**
   * Count of new notifications
   */
  count: number;
}
