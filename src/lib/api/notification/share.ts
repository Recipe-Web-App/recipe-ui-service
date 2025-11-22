import { notificationClient, handleNotificationApiError } from './client';
import type {
  ShareRecipeRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * Share Recipe API
 *
 * Methods for sharing recipes and notifying users.
 */
export const shareApi = {
  /**
   * Share a recipe with users and notify the recipe author
   *
   * Sends dual notifications:
   * 1. To recipients: Share notification with recipe preview (title, description, image, link)
   * 2. To recipe author: Notification that their recipe was shared
   *
   * Method: POST /notifications/share-recipe
   * Requires: OAuth2 with notification:user or notification:admin scope
   * Returns: 202 Accepted - notifications queued for async processing
   * Rate Limit: 100 requests/minute per user
   *
   * @param data - Share recipe request data
   * @returns Batch notification response with notification IDs
   * @throws NotificationApiError
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
      throw error; // Never reached, but needed for TypeScript
    }
  },
};
