import { notificationClient, handleNotificationApiError } from './client';
import type { HealthResponse, LivenessResponse } from '@/types/notification';

/**
 * Notification Health API
 *
 * Health check endpoints for the notification service.
 * Used for monitoring, load balancing, and orchestration.
 */
export const healthApi = {
  /**
   * Check service readiness
   *
   * Indicates whether the service is ready to accept traffic.
   * Checks all dependencies (database, queue, external services).
   *
   * Method: GET /health/ready
   * No authentication required
   *
   * @returns Health status with dependency checks
   */
  async checkReadiness(): Promise<HealthResponse> {
    try {
      const response = await notificationClient.get('/health/ready');
      return response.data as HealthResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Check service liveness
   *
   * Indicates whether the service is alive and running.
   * Basic health check that doesn't verify dependencies.
   *
   * Method: GET /health/live
   * No authentication required
   *
   * @returns Simple liveness status
   */
  async checkLiveness(): Promise<LivenessResponse> {
    try {
      const response = await notificationClient.get('/health/live');
      return response.data as LivenessResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
