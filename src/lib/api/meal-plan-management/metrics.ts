import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
} from './client';

export const metricsApi = {
  /**
   * Get Prometheus metrics
   * GET /metrics
   */
  async getMetrics(): Promise<string> {
    try {
      const response = await mealPlanManagementClient.get('/metrics', {
        headers: {
          Accept: 'text/plain',
        },
      });
      return response.data as string;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
