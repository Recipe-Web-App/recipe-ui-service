/**
 * Notification Service Enums
 *
 * Enum definitions matching the notification-service-openapi.yaml specification.
 * All values are UPPERCASE per the OpenAPI spec.
 */

/**
 * Notification category for template identification
 * Determines the notification template and required data fields
 */
export enum NotificationCategory {
  // Recipe events
  RECIPE_PUBLISHED = 'RECIPE_PUBLISHED',
  RECIPE_LIKED = 'RECIPE_LIKED',
  RECIPE_COMMENTED = 'RECIPE_COMMENTED',
  RECIPE_SHARED = 'RECIPE_SHARED',
  RECIPE_COLLECTED = 'RECIPE_COLLECTED',
  RECIPE_RATED = 'RECIPE_RATED',
  RECIPE_FEATURED = 'RECIPE_FEATURED',
  RECIPE_TRENDING = 'RECIPE_TRENDING',

  // Social events
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  MENTION = 'MENTION',
  COLLECTION_INVITE = 'COLLECTION_INVITE',

  // System events
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET', // pragma: allowlist secret
  PASSWORD_CHANGED = 'PASSWORD_CHANGED', // pragma: allowlist secret
  EMAIL_CHANGED = 'EMAIL_CHANGED',
  MAINTENANCE = 'MAINTENANCE',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

/**
 * Notification delivery status
 * Tracks the lifecycle of a notification through the delivery pipeline
 */
export enum NotificationStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  ABORTED = 'ABORTED',
}

/**
 * Notification delivery channel type
 * Determines how the notification is delivered to the user
 */
export enum NotificationType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

/**
 * Health status for service health checks
 */
export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded';

/**
 * Health check status for individual services
 */
export type ServiceHealthStatus = 'ok' | 'failed' | 'degraded';

/**
 * Alert level for system alerts
 */
export type AlertLevel = 'info' | 'warning' | 'critical';
