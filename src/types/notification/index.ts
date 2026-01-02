/**
 * Notification Service Type Definitions
 *
 * Type definitions for the notification service API.
 * Follows the notification-service-openapi.yaml specification.
 */

// =============================================================================
// Enums
// =============================================================================
export {
  NotificationCategory,
  NotificationStatus,
  NotificationType,
} from './enums';
export type { HealthStatus, ServiceHealthStatus, AlertLevel } from './enums';

// =============================================================================
// Notification Data Types (polymorphic based on category)
// =============================================================================
export type {
  BaseNotificationData,
  RecipeActorNotificationData,
  RecipeSystemNotificationData,
  SocialNotificationData,
  SystemNotificationData,
  NotificationData,
} from './notification-data';

// =============================================================================
// User Notification Types (for /users/me/notifications endpoints)
// =============================================================================
export type {
  UserNotification,
  UserNotificationListResponse,
  UserNotificationCountResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  UserNotificationParams,
  HasNewNotificationsResponse,
} from './user-notification';

// =============================================================================
// Notification Detail Types (for /notifications/{id} endpoints)
// =============================================================================
export type {
  NotificationDeliveryStatus,
  NotificationDetail,
  NotificationListResponse,
} from './notification';

// =============================================================================
// Request Types (for notification sending endpoints)
// =============================================================================
export type {
  BaseNotificationRequest,
  // Recipe notifications
  RecipePublishedRequest,
  RecipeLikedRequest,
  RecipeCommentedRequest,
  // Social notifications
  NewFollowerRequest,
  MentionRequest,
  ShareRecipeRequest,
  RecipeCollectedRequest,
  // Activity notifications
  RecipeRatedRequest,
  RecipeFeaturedRequest,
  RecipeTrendingRequest,
  // System notifications
  PasswordResetRequest,
  WelcomeRequest,
  EmailChangedRequest,
  PasswordChangedRequest,
  MaintenanceRequest,
} from './requests';

// =============================================================================
// Admin Types (for admin and health endpoints)
// =============================================================================
export type {
  // Statistics
  StatusBreakdown,
  TypeBreakdown,
  FailedNotificationStats,
  RetryStatistics,
  DateRange,
  NotificationStats,
  NotificationStatsParams,
  // Retry operations
  RetryFailedResponse,
  RetryStatusResponse,
  RetryNotificationResponse,
  // Templates
  TemplateInfo,
  TemplateListResponse,
  // Health
  ServiceHealthCheck,
  HealthResponse,
  LivenessResponse,
} from './admin';

// =============================================================================
// Common Types
// =============================================================================
export type { ErrorResponse, BatchNotificationResponse } from './common';
