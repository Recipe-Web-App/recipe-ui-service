import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
} from './client';
import type {
  HealthCheckResult,
  VersionInfo,
} from '@/types/meal-plan-management';

export const healthApi = {
  /**
   * Comprehensive health check
   * GET /health
   */
  async getHealth(): Promise<HealthCheckResult> {
    try {
      const response = await mealPlanManagementClient.get('/health');
      return response.data as HealthCheckResult;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Readiness probe for Kubernetes
   * GET /health/ready
   */
  async getReadiness(): Promise<HealthCheckResult> {
    try {
      const response = await mealPlanManagementClient.get('/health/ready');
      return response.data as HealthCheckResult;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Liveness probe for Kubernetes
   * GET /health/live
   */
  async getLiveness(): Promise<HealthCheckResult> {
    try {
      const response = await mealPlanManagementClient.get('/health/live');
      return response.data as HealthCheckResult;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get service version and environment information
   * GET /health/version
   */
  async getVersion(): Promise<VersionInfo> {
    try {
      const response = await mealPlanManagementClient.get('/health/version');
      return response.data as VersionInfo;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
