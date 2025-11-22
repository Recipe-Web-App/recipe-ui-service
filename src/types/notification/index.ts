/**
 * Notification Service Type Definitions
 *
 * Type definitions for the notification service API.
 * Follows the notification-service-openapi.yaml specification.
 */

// Common Types - Foundation
export type { ErrorResponse, BatchNotificationResponse } from './common';

// Share Recipe Types
export type { ShareRecipeRequest } from './share';

// Notification Detail Types
export type { NotificationDetail } from './notification';
export { NotificationStatus, NotificationType } from './notification';
