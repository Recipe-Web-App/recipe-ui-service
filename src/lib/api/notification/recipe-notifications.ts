import { notificationClient, handleNotificationApiError } from './client';
import type {
  RecipePublishedRequest,
  RecipeLikedRequest,
  RecipeCommentedRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Recipe Notifications API
 *
 * Methods for sending recipe-related notifications.
 * All endpoints return 202 Accepted with notifications queued for async processing.
 */
export const recipeNotificationsApi = {
  /**
   * Notify followers when a recipe is published
   *
   * Sends notifications to all followers of the recipe author.
   * The service fetches recipe details from recipe-management-service.
   *
   * Method: POST /notifications/recipe-published
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Recipe published request with recipient IDs and recipe ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipePublished(
    data: RecipePublishedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-published',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify recipe author when someone likes their recipe
   *
   * Sends notification to the recipe author.
   * The service fetches recipe and liker details from downstream services.
   *
   * Method: POST /notifications/recipe-liked
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Recipe liked request with recipient, recipe, and liker IDs
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeLiked(
    data: RecipeLikedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-liked',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify recipe author when someone comments on their recipe
   *
   * Sends notification to the recipe author with comment preview.
   * The service fetches comment details from recipe-management-service.
   *
   * Method: POST /notifications/recipe-commented
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Recipe commented request with recipient IDs and comment ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeCommented(
    data: RecipeCommentedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-commented',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
