/**
 * Share Recipe Types for Notification Service
 *
 * Types for sharing recipes and notifying users.
 */

/**
 * Request to share a recipe with users
 *
 * Sends dual notifications:
 * 1. To recipients - Share notification with recipe preview
 * 2. To recipe author - Notification that their recipe was shared
 */
export interface ShareRecipeRequest {
  /**
   * List of user IDs to share the recipe with
   * Max 100 recipients per request
   */
  recipient_ids: string[];

  /**
   * ID of the recipe to share
   */
  recipe_id: number;

  /**
   * Optional UUID of the user sharing the recipe
   * Always revealed to recipients
   * Only revealed to recipe author if sharer follows author or requester has admin scope
   */
  sharer_id?: string;

  /**
   * Optional message from the sharer
   * Included in both recipient and author notifications
   * Max 500 characters
   */
  share_message?: string;
}
