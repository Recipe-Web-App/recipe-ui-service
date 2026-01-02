import { notificationClient, handleNotificationApiError } from './client';
import type {
  NewFollowerRequest,
  MentionRequest,
  ShareRecipeRequest,
  RecipeCollectedRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Social Notifications API
 *
 * Methods for sending social interaction notifications.
 * All endpoints return 202 Accepted with notifications queued for async processing.
 */
export const socialNotificationsApi = {
  /**
   * Notify user when someone follows them
   *
   * Sends notification about new follower.
   * The service fetches follower details from user-management-service.
   *
   * Method: POST /notifications/new-follower
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - New follower request with recipient and follower IDs
   * @returns Batch notification response with queued notification IDs
   */
  async notifyNewFollower(
    data: NewFollowerRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/new-follower',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify user when mentioned in a comment
   *
   * Sends notification about being mentioned.
   * The service fetches comment details from recipe-management-service.
   *
   * Method: POST /notifications/mention
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Mention request with recipient IDs and comment ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyMention(
    data: MentionRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/mention',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Share a recipe with users and notify the recipe author
   *
   * Sends dual notifications:
   * 1. To recipients - Share notification with recipe preview
   * 2. To recipe author - Notification that their recipe was shared
   *
   * Method: POST /notifications/share-recipe
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Share recipe request with recipients, recipe, sharer, and message
   * @returns Batch notification response with queued notification IDs
   */
  async shareRecipe(
    data: ShareRecipeRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/share-recipe',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify recipe author when recipe is added to a collection
   *
   * Sends notification to the recipe author.
   * The service fetches recipe and collection details from downstream services.
   *
   * Method: POST /notifications/recipe-collected
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Recipe collected request with recipient, recipe, collector, and collection IDs
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeCollected(
    data: RecipeCollectedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-collected',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
