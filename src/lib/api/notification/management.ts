import {
  notificationClient,
  handleNotificationApiError,
  buildQueryParams,
} from './client';
import type {
  NotificationDetail,
  RetryNotificationResponse,
} from '@/types/notification';

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
      throw error;
    }
  },

  /**
   * Delete a specific notification
   *
   * Hard delete a notification and all associated delivery records.
   * Only available to users with notification:admin scope.
   *
   * Method: DELETE /notifications/{notificationId}
   * Requires: OAuth2 with notification:admin scope
   *
   * @param notificationId - Notification UUID to delete
   * @throws NotificationApiError
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await notificationClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Retry a failed notification
   *
   * Manually retry a specific notification that failed delivery.
   * Resets retry count and requeues the notification.
   *
   * Method: POST /notifications/{notificationId}/retry
   * Requires: OAuth2 with notification:admin scope
   *
   * @param notificationId - Notification UUID to retry
   * @returns Retry response with new delivery status
   * @throws NotificationApiError
   */
  async retryNotification(
    notificationId: string
  ): Promise<RetryNotificationResponse> {
    try {
      const response = await notificationClient.post(
        `/notifications/${notificationId}/retry`
      );
      return response.data as RetryNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
