/**
 * Notification Service API
 *
 * API client for the notification service.
 * Provides methods for sharing recipes and managing notification status.
 */

// Base client and utilities
export {
  notificationClient,
  NotificationApiError,
  handleNotificationApiError,
  buildQueryParams,
} from './client';

// Share Recipe API
export { shareApi } from './share';

// Notification Management API
export { managementApi } from './management';

// Re-export types for convenience
export type {
  ShareRecipeRequest,
  BatchNotificationResponse,
  NotificationDetail,
  ErrorResponse,
} from '@/types/notification';

export { NotificationStatus, NotificationType } from '@/types/notification';
