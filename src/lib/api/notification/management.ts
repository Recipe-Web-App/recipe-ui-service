import {
  notificationClient,
  handleNotificationApiError,
  buildQueryParams,
} from './client';
import type { NotificationDetail } from '@/types/notification';

/**
 * Notification Management API
 *
 * Methods for querying and managing notification status.
 */
export const managementApi = {
  /**
   * Get notification details and delivery status
   *
   * Retrieve notification details including delivery status.
   * Users can only access their own notifications unless they have notification:admin scope.
   *
   * Method: GET /notifications/{notificationId}
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param notificationId - Notification UUID
   * @param includeMessage - Include the full message body in response (default: false)
   * @returns Notification detail with current status
   * @throws NotificationApiError
   */
  async getNotificationById(
    notificationId: string,
    includeMessage = false
  ): Promise<NotificationDetail> {
    try {
      const params = { include_message: includeMessage };
      const queryString = buildQueryParams(params);
      const url = queryString
        ? `/notifications/${notificationId}?${queryString}`
        : `/notifications/${notificationId}`;

      const response = await notificationClient.get(url);
      return response.data as NotificationDetail;
    } catch (error) {
      handleNotificationApiError(error);
      throw error; // Never reached, but needed for TypeScript
    }
  },
};
