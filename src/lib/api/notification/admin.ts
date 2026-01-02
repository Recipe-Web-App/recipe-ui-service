import {
  notificationClient,
  handleNotificationApiError,
  buildQueryParams,
} from './client';
import type {
  NotificationStats,
  NotificationStatsParams,
  RetryFailedResponse,
  RetryStatusResponse,
  TemplateListResponse,
} from '@/types/notification';

/**
 * Notification Admin API
 *
 * Administrative methods for managing notifications, statistics, and templates.
 * All endpoints require OAuth2 with notification:admin scope.
 */
export const adminApi = {
  /**
   * Get notification statistics
   *
   * Retrieve aggregated statistics about notification delivery.
   *
   * Method: GET /stats
   * Requires: OAuth2 with notification:admin scope
   *
   * @param params - Optional date range filters
   * @returns Notification statistics with breakdowns
   */
  async getStats(params?: NotificationStatsParams): Promise<NotificationStats> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString ? `/stats?${queryString}` : '/stats';

      const response = await notificationClient.get(url);
      return response.data as NotificationStats;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Retry all failed notifications
   *
   * Bulk retry all notifications that failed but are eligible for retry.
   * Respects max retry limits and failure policies.
   *
   * Method: POST /notifications/retry-failed
   * Requires: OAuth2 with notification:admin scope
   *
   * @param maxFailures - Optional maximum failure count filter (retry only those below this count)
   * @returns Response with retry operation details
   */
  async retryFailedNotifications(
    maxFailures?: number
  ): Promise<RetryFailedResponse> {
    try {
      const data =
        maxFailures !== undefined ? { max_failures: maxFailures } : {};
      const response = await notificationClient.post(
        '/notifications/retry-failed',
        data
      );
      return response.data as RetryFailedResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Get retry status for failed notifications
   *
   * Check the current state of failed notifications and retry eligibility.
   *
   * Method: GET /notifications/retry-status
   * Requires: OAuth2 with notification:admin scope
   *
   * @returns Retry status with counts and eligibility info
   */
  async getRetryStatus(): Promise<RetryStatusResponse> {
    try {
      const response = await notificationClient.get(
        '/notifications/retry-status'
      );
      return response.data as RetryStatusResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Get available notification templates
   *
   * List all notification templates with their configuration.
   *
   * Method: GET /templates
   * Requires: OAuth2 with notification:admin scope
   *
   * @returns List of available templates
   */
  async getTemplates(): Promise<TemplateListResponse> {
    try {
      const response = await notificationClient.get('/templates');
      return response.data as TemplateListResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
