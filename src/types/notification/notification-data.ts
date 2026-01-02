/**
 * Notification Data Types
 *
 * Polymorphic types for notification data based on notification category.
 * The schema varies based on notificationCategory as defined in the OpenAPI spec.
 */

import type { AlertLevel } from './enums';

/**
 * Base notification data with template version
 * All notification data includes templateVersion for historical rendering accuracy
 */
export interface BaseNotificationData {
  /**
   * Template version for historical rendering accuracy
   */
  templateVersion: string;
}

/**
 * NotificationData for notifications where someone did something to a recipe.
 * Used by: RECIPE_LIKED, RECIPE_COMMENTED, RECIPE_SHARED, RECIPE_COLLECTED, RECIPE_RATED
 */
export interface RecipeActorNotificationData extends BaseNotificationData {
  /**
   * ID of the recipe
   */
  recipeId: number;

  /**
   * Title of the recipe
   */
  recipeTitle: string;

  /**
   * ID of user who performed the action
   */
  actorId?: string;

  /**
   * Display name of user who performed the action
   */
  actorName?: string;

  // RECIPE_COMMENTED specific
  /**
   * For RECIPE_COMMENTED - ID of the comment
   */
  commentId?: number;

  /**
   * For RECIPE_COMMENTED - Preview of the comment text
   */
  commentPreview?: string;

  // RECIPE_COLLECTED specific
  /**
   * For RECIPE_COLLECTED - ID of the collection
   */
  collectionId?: number;

  /**
   * For RECIPE_COLLECTED - Name of the collection
   */
  collectionName?: string;

  // RECIPE_RATED specific
  /**
   * For RECIPE_RATED - Rating value given
   */
  rating?: number;

  // RECIPE_SHARED specific
  /**
   * For RECIPE_SHARED - Optional message from the sharer
   */
  shareMessage?: string | null;
}

/**
 * NotificationData for system notifications about a recipe (no external actor).
 * Used by: RECIPE_PUBLISHED, RECIPE_FEATURED, RECIPE_TRENDING
 */
export interface RecipeSystemNotificationData extends BaseNotificationData {
  /**
   * ID of the recipe
   */
  recipeId: number;

  /**
   * Title of the recipe
   */
  recipeTitle: string;

  // RECIPE_PUBLISHED specific
  /**
   * For RECIPE_PUBLISHED - ID of the recipe author
   */
  authorId?: string;

  /**
   * For RECIPE_PUBLISHED - Name of the recipe author
   */
  authorName?: string;

  // RECIPE_FEATURED specific
  /**
   * For RECIPE_FEATURED - Reason the recipe was featured
   */
  featuredReason?: string | null;

  // RECIPE_TRENDING specific
  /**
   * For RECIPE_TRENDING - Trending metrics summary
   */
  trendingMetrics?: string | null;
}

/**
 * NotificationData for social interactions between users.
 * Used by: NEW_FOLLOWER, MENTION, COLLECTION_INVITE
 */
export interface SocialNotificationData extends BaseNotificationData {
  // NEW_FOLLOWER specific
  /**
   * For NEW_FOLLOWER - ID of the new follower
   */
  followerId?: string;

  /**
   * For NEW_FOLLOWER - Display name of the new follower
   */
  followerName?: string;

  /**
   * For NEW_FOLLOWER - Username of the new follower
   */
  followerUsername?: string;

  // MENTION specific
  /**
   * For MENTION - ID of the comment containing the mention
   */
  commentId?: number;

  /**
   * For MENTION - ID of the recipe the comment is on
   */
  recipeId?: number;

  /**
   * For MENTION - Title of the recipe
   */
  recipeTitle?: string;

  /**
   * For MENTION - ID of the user who mentioned
   */
  commenterId?: string;

  /**
   * For MENTION - Name of the user who mentioned
   */
  commenterName?: string;

  /**
   * For MENTION - Preview of the comment text
   */
  commentPreview?: string;

  // COLLECTION_INVITE specific
  /**
   * For COLLECTION_INVITE - ID of the collection
   */
  collectionId?: number;

  /**
   * For COLLECTION_INVITE - Name of the collection
   */
  collectionName?: string;

  /**
   * For COLLECTION_INVITE - ID of the user who sent the invite
   */
  inviterId?: string;

  /**
   * For COLLECTION_INVITE - Name of the user who sent the invite
   */
  inviterName?: string;
}

/**
 * NotificationData for system-generated notifications (auth, maintenance, alerts).
 * Used by: WELCOME, PASSWORD_RESET, PASSWORD_CHANGED, EMAIL_CHANGED, MAINTENANCE, SYSTEM_ALERT
 */
export interface SystemNotificationData extends BaseNotificationData {
  // WELCOME specific
  /**
   * For WELCOME - ID of the new user
   */
  userId?: string;

  /**
   * For WELCOME - Username of the new user
   */
  username?: string;

  /**
   * For WELCOME - Full name of the new user
   */
  fullName?: string | null;

  // PASSWORD_RESET specific
  /**
   * For PASSWORD_RESET - Password reset token
   */
  resetToken?: string;

  /**
   * For PASSWORD_RESET - Hours until token expires
   */
  expiryHours?: number;

  /**
   * For PASSWORD_RESET - Full URL for password reset
   */
  resetUrl?: string;

  // PASSWORD_CHANGED, EMAIL_CHANGED common
  /**
   * For PASSWORD_CHANGED, EMAIL_CHANGED - When the change occurred
   */
  timestamp?: string;

  // EMAIL_CHANGED specific
  /**
   * For EMAIL_CHANGED - Previous email address
   */
  oldEmail?: string;

  /**
   * For EMAIL_CHANGED - New email address
   */
  newEmail?: string;

  // MAINTENANCE specific
  /**
   * For MAINTENANCE - Scheduled start time
   */
  maintenanceStart?: string;

  /**
   * For MAINTENANCE - Scheduled end time
   */
  maintenanceEnd?: string;

  /**
   * For MAINTENANCE - Description of the maintenance
   */
  description?: string;

  // SYSTEM_ALERT specific
  /**
   * For SYSTEM_ALERT - Type of alert
   */
  alertType?: string;

  /**
   * For SYSTEM_ALERT - Severity level
   */
  alertLevel?: AlertLevel;

  /**
   * For SYSTEM_ALERT - Alert title
   */
  alertTitle?: string;

  /**
   * For SYSTEM_ALERT - Alert message
   */
  alertMessage?: string;
}

/**
 * Union type of all notification data types
 * The actual type is determined by the notificationCategory field
 */
export type NotificationData =
  | RecipeActorNotificationData
  | RecipeSystemNotificationData
  | SocialNotificationData
  | SystemNotificationData;
