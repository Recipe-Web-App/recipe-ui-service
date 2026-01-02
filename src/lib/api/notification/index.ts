/**
 * Notification Service API
 *
 * Comprehensive API client for the notification service.
 * Provides methods for user notification management, sending notifications,
 * and administrative operations.
 */

// Base client and utilities
export {
  notificationClient,
  NotificationApiError,
  handleNotificationApiError,
  buildQueryParams,
} from './client';

// User Notifications API (inbox, read/unread, delete)
export { userNotificationsApi } from './user-notifications';

// Notification Sending APIs
export { recipeNotificationsApi } from './recipe-notifications';
export { socialNotificationsApi } from './social-notifications';
export { activityNotificationsApi } from './activity-notifications';
export { systemNotificationsApi } from './system-notifications';

// Notification Management API (get by ID, delete, retry)
export { managementApi } from './management';

// Admin API (stats, retry-failed, templates)
export { adminApi } from './admin';

// Health API (readiness, liveness)
export { healthApi } from './health';

// Re-export types for convenience
export type {
  // Enums
  NotificationCategory,
  NotificationStatus,
  NotificationType,
  // User notification types
  UserNotification,
  UserNotificationListResponse,
  UserNotificationCountResponse,
  UserNotificationParams,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  HasNewNotificationsResponse,
  // Notification detail types
  NotificationDetail,
  NotificationDeliveryStatus,
  NotificationListResponse,
  // Request types
  ShareRecipeRequest,
  RecipePublishedRequest,
  RecipeLikedRequest,
  RecipeCommentedRequest,
  NewFollowerRequest,
  MentionRequest,
  RecipeCollectedRequest,
  RecipeRatedRequest,
  RecipeFeaturedRequest,
  RecipeTrendingRequest,
  PasswordResetRequest,
  WelcomeRequest,
  EmailChangedRequest,
  PasswordChangedRequest,
  MaintenanceRequest,
  // Response types
  BatchNotificationResponse,
  ErrorResponse,
  // Admin types
  NotificationStats,
  NotificationStatsParams,
  RetryFailedResponse,
  RetryStatusResponse,
  RetryNotificationResponse,
  TemplateInfo,
  TemplateListResponse,
  // Health types
  HealthResponse,
  LivenessResponse,
} from '@/types/notification';
