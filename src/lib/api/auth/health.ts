import { authClient, handleAuthApiError } from './client';
import type {
  HealthResponse,
  ReadinessResponse,
  LivenessResponse,
} from '@/types/auth';

export const healthApi = {
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await authClient.get('/health');
      return response.data as HealthResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async getReadiness(): Promise<ReadinessResponse> {
    try {
      const response = await authClient.get('/health/ready');
      return response.data as ReadinessResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async getLiveness(): Promise<LivenessResponse> {
    try {
      const response = await authClient.get('/health/live');
      return response.data as LivenessResponse;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },

  async getMetrics(): Promise<string> {
    try {
      const response = await authClient.get('/metrics', {
        headers: {
          Accept: 'text/plain',
        },
      });
      return response.data as string;
    } catch (error) {
      handleAuthApiError(error);
      throw error; // This line should never be reached since handleAuthApiError throws
    }
  },
};
