import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  RecipeManagementInfoResponse,
  RecipeManagementMetricsResponse,
  RecipeManagementMetricResponse,
  RecipeManagementEnvironmentResponse,
  RecipeManagementPropertyResponse,
  RecipeManagementConfigPropsResponse,
} from '@/types/recipe-management';

export const monitoringApi = {
  /**
   * Get application information
   * GET /actuator/info
   */
  async getInfo(): Promise<RecipeManagementInfoResponse> {
    try {
      const response = await recipeManagementClient.get('/actuator/info');
      return response.data as RecipeManagementInfoResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get available metrics
   * GET /actuator/metrics
   */
  async getMetrics(): Promise<RecipeManagementMetricsResponse> {
    try {
      const response = await recipeManagementClient.get('/actuator/metrics');
      return response.data as RecipeManagementMetricsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get specific metric value
   * GET /actuator/metrics/{metricName}
   */
  async getMetric(metricName: string): Promise<RecipeManagementMetricResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/actuator/metrics/${metricName}`
      );
      return response.data as RecipeManagementMetricResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get Prometheus metrics
   * GET /actuator/prometheus
   */
  async getPrometheusMetrics(): Promise<string> {
    try {
      const response = await recipeManagementClient.get('/actuator/prometheus');
      return response.data as string;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get environment properties
   * GET /actuator/env
   */
  async getEnvironment(): Promise<RecipeManagementEnvironmentResponse> {
    try {
      const response = await recipeManagementClient.get('/actuator/env');
      return response.data as RecipeManagementEnvironmentResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get specific environment property
   * GET /actuator/env/{propertyName}
   */
  async getEnvironmentProperty(
    propertyName: string
  ): Promise<RecipeManagementPropertyResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/actuator/env/${propertyName}`
      );
      return response.data as RecipeManagementPropertyResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get configuration properties
   * GET /actuator/configprops
   */
  async getConfigurationProperties(): Promise<RecipeManagementConfigPropsResponse> {
    try {
      const response = await recipeManagementClient.get(
        '/actuator/configprops'
      );
      return response.data as RecipeManagementConfigPropsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
