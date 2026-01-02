/**
 * Notification Request Types
 *
 * Request schemas for all notification sending endpoints.
 * Based on notification-service-openapi.yaml specification.
 */

/**
 * Base request with recipient IDs
 * All notification requests require at least one recipient
 */
export interface BaseNotificationRequest {
  /**
   * List of recipient user IDs (max 100)
   */
  recipient_ids: string[];
}

// =============================================================================
// Recipe Notifications
// =============================================================================

/**
 * Request to notify followers when a recipe is published
 * POST /notifications/recipe-published
 */
export interface RecipePublishedRequest extends BaseNotificationRequest {
  /**
   * ID of the published recipe
   * Service will fetch recipe details and author info from recipe-management-service
   */
  recipe_id: number;
}

/**
 * Request to notify recipe author when someone likes their recipe
 * POST /notifications/recipe-liked
 */
export interface RecipeLikedRequest extends BaseNotificationRequest {
  /**
   * ID of the liked recipe
   * Service will fetch recipe details from recipe-management-service
   */
  recipe_id: number;

  /**
   * UUID of the user who liked the recipe
   * Service will fetch user details from user-management-service
   */
  liker_id: string;
}

/**
 * Request to notify recipe author when someone comments on their recipe
 * POST /notifications/recipe-commented
 */
export interface RecipeCommentedRequest extends BaseNotificationRequest {
  /**
   * ID of the comment
   * Service will fetch comment details (including recipe_id and commenter info)
   * from recipe-management-service
   */
  comment_id: number;
}

// =============================================================================
// Social Notifications
// =============================================================================

/**
 * Request to notify user when someone follows them
 * POST /notifications/new-follower
 */
export interface NewFollowerRequest extends BaseNotificationRequest {
  /**
   * UUID of the new follower
   * Service will fetch follower details from user-management-service
   */
  follower_id: string;
}

/**
 * Request to notify user when mentioned in a comment
 * POST /notifications/mention
 */
export interface MentionRequest extends BaseNotificationRequest {
  /**
   * ID of the comment containing the mention
   * Service will fetch comment details (including commenter/mentioner info,
   * context, recipe_id) from recipe-management-service
   */
  comment_id: number;
}

/**
 * Request to share a recipe with users and notify the recipe author
 * POST /notifications/share-recipe
 *
 * Sends dual notifications:
 * 1. To recipients - Share notification with recipe preview
 * 2. To recipe author - Notification that their recipe was shared
 */
export interface ShareRecipeRequest extends BaseNotificationRequest {
  /**
   * ID of the recipe to share
   * Service will fetch recipe details and images from recipe-management-service
   * and media-management-service
   */
  recipe_id: number;

  /**
   * Optional UUID of the user sharing the recipe
   * Always revealed to recipients
   * Only revealed to recipe author if sharer follows author or requester has admin scope
   */
  sharer_id?: string | null;

  /**
   * Optional message from the sharer
   * Included in both recipient and author notifications
   * Max 500 characters
   */
  share_message?: string | null;
}

/**
 * Request to notify recipe author when recipe is added to a collection
 * POST /notifications/recipe-collected
 */
export interface RecipeCollectedRequest extends BaseNotificationRequest {
  /**
   * ID of the recipe added to collection
   * Service will fetch recipe details from recipe-management-service
   */
  recipe_id: number;

  /**
   * UUID of the user who added the recipe to their collection
   * Service will fetch collector details from user-management-service
   */
  collector_id: string;

  /**
   * ID of the collection
   * Service will fetch collection details from recipe-management-service
   * Notification includes links to collection and collector profile
   */
  collection_id: number;
}

// =============================================================================
// Activity Notifications
// =============================================================================

/**
 * Request to notify recipe author when someone rates their recipe
 * POST /notifications/recipe-rated
 */
export interface RecipeRatedRequest extends BaseNotificationRequest {
  /**
   * ID of the rated recipe
   * Service will fetch recipe details and rating info from recipe-management-service
   */
  recipe_id: number;

  /**
   * UUID of the user who rated the recipe
   * Service will fetch rater details from user-management-service
   */
  rater_id: string;
}

/**
 * Request to notify recipe author when their recipe is featured
 * POST /notifications/recipe-featured
 */
export interface RecipeFeaturedRequest extends BaseNotificationRequest {
  /**
   * ID of the featured recipe
   * Service will fetch recipe details from recipe-management-service
   */
  recipe_id: number;

  /**
   * Optional reason or category for featuring
   * e.g., "Editor's Choice", "Top Rated", "Seasonal Favorite"
   * Max 500 characters
   */
  featured_reason?: string | null;
}

/**
 * Request to notify recipe author when their recipe is trending
 * POST /notifications/recipe-trending
 */
export interface RecipeTrendingRequest extends BaseNotificationRequest {
  /**
   * ID of the trending recipe
   * Service will fetch recipe details from recipe-management-service
   */
  recipe_id: number;

  /**
   * Optional trending metrics summary
   * e.g., "1,234 views and 89 likes in the past 24 hours"
   * Max 500 characters
   */
  trending_metrics?: string | null;
}

// =============================================================================
// System Notifications
// =============================================================================

/**
 * Request to send password reset email
 * POST /notifications/password-reset
 */
export interface PasswordResetRequest extends BaseNotificationRequest {
  /**
   * Secure reset token
   * Service will construct reset URL using FRONTEND_BASE_URL configuration
   * Min 20 characters
   */
  reset_token: string;

  /**
   * Number of hours until token expires (1-72)
   */
  expiry_hours: number;
}

/**
 * Request to send welcome email to new users
 * POST /notifications/welcome
 *
 * Requires service-to-service authentication (client_credentials grant)
 */
export interface WelcomeRequest extends BaseNotificationRequest {
  // Only recipient_ids required
  // Service will fetch user details (email, username, full_name)
  // from user-management-service
}

/**
 * Request to send security notification for email change
 * POST /notifications/email-changed
 *
 * Requires service-to-service authentication (client_credentials grant)
 * Notifications sent to both old and new email addresses
 */
export interface EmailChangedRequest extends BaseNotificationRequest {
  /**
   * Previous email address (notification sent here as security measure)
   */
  old_email: string;

  /**
   * New email address (notification sent here for confirmation)
   */
  new_email: string;
}

/**
 * Request to send security notification for password change
 * POST /notifications/password-changed
 *
 * Requires service-to-service authentication (client_credentials grant)
 */
export interface PasswordChangedRequest extends BaseNotificationRequest {
  // Only recipient_ids required
  // Service will fetch user email from user-management-service
}

/**
 * Request to send system maintenance notification
 * POST /notifications/maintenance
 */
export interface MaintenanceRequest {
  /**
   * If true, send notification only to admins
   * If false (default), broadcast to all users and admins
   */
  adminOnly?: boolean;

  /**
   * Scheduled start time of maintenance window (ISO 8601 format)
   */
  maintenance_start: string;

  /**
   * Scheduled end time of maintenance window (ISO 8601 format)
   */
  maintenance_end: string;

  /**
   * Description of the maintenance work and expected impact
   * Max 1000 characters
   */
  description: string;
}
