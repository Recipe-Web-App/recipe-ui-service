import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
} from './client';
import type {
  ServiceInfo,
  SafeConfiguration,
} from '@/types/meal-plan-management';

export const systemApi = {
  /**
   * Interactive API documentation (Swagger UI)
   * GET /docs
   */
  async getSwaggerUI(): Promise<string> {
    try {
      const response = await mealPlanManagementClient.get('/docs', {
        headers: {
          Accept: 'text/html',
        },
      });
      return response.data as string;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * OpenAPI JSON schema
   * GET /docs-json
   */
  async getOpenAPIJson(): Promise<object> {
    try {
      const response = await mealPlanManagementClient.get('/docs-json');
      return response.data as object;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Service information
   * GET /info
   */
  async getServiceInfo(): Promise<ServiceInfo> {
    try {
      const response = await mealPlanManagementClient.get('/info');
      return response.data as ServiceInfo;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Safe configuration values
   * GET /config
   */
  async getConfiguration(): Promise<SafeConfiguration> {
    try {
      const response = await mealPlanManagementClient.get('/config');
      return response.data as SafeConfiguration;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
