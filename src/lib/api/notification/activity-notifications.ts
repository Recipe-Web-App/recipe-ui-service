import { notificationClient, handleNotificationApiError } from './client';
import type {
  RecipeRatedRequest,
  RecipeFeaturedRequest,
  RecipeTrendingRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Activity Notifications API
 *
 * Methods for sending recipe activity and engagement notifications.
 * All endpoints return 202 Accepted with notifications queued for async processing.
 */
export const activityNotificationsApi = {
  /**
   * Notify recipe author when someone rates their recipe
   *
   * Sends notification to the recipe author with rating info.
   * The service fetches recipe and rating details from recipe-management-service.
   *
   * Method: POST /notifications/recipe-rated
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param data - Recipe rated request with recipient, recipe, and rater IDs
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeRated(
    data: RecipeRatedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-rated',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify recipe author when their recipe is featured
   *
   * Sends notification about recipe being featured by the platform.
   * The service fetches recipe details from recipe-management-service.
   *
   * Method: POST /notifications/recipe-featured
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Recipe featured request with recipient, recipe ID, and optional reason
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeFeatured(
    data: RecipeFeaturedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-featured',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify recipe author when their recipe is trending
   *
   * Sends notification about recipe trending on the platform.
   * The service fetches recipe details from recipe-management-service.
   *
   * Method: POST /notifications/recipe-trending
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Recipe trending request with recipient, recipe ID, and optional metrics
   * @returns Batch notification response with queued notification IDs
   */
  async notifyRecipeTrending(
    data: RecipeTrendingRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/recipe-trending',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
