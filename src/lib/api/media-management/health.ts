import { mediaManagementClient, handleMediaManagementApiError } from './client';
import { HealthResponse, ReadinessResponse } from '@/types/media-management';

export const healthApi = {
  async getHealth(): Promise<HealthResponse> {
    try {
      // Health check endpoint doesn't require auth
      const response = await mediaManagementClient.get('/health', {
        headers: { Authorization: undefined }, // Override auth for health check
      });
      return response.data as HealthResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  async getReadiness(): Promise<ReadinessResponse> {
    try {
      // Readiness check endpoint doesn't require auth
      const response = await mediaManagementClient.get('/ready', {
        headers: { Authorization: undefined }, // Override auth for readiness check
      });
      return response.data as ReadinessResponse;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },

  async getMetrics(): Promise<string> {
    try {
      // Metrics endpoint doesn't require auth and returns plain text
      const response = await mediaManagementClient.get('/metrics', {
        headers: {
          Authorization: undefined, // Override auth for metrics
          Accept: 'text/plain; version=0.0.4; charset=utf-8',
        },
      });
      return response.data as string;
    } catch (error) {
      return handleMediaManagementApiError(error);
    }
  },
};
