import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type { RecipeManagementHealthResponse } from '@/types/recipe-management';

export const healthApi = {
  /**
   * Get application health status
   * GET /actuator/health
   */
  async getHealth(): Promise<RecipeManagementHealthResponse> {
    try {
      const response = await recipeManagementClient.get('/actuator/health');
      return response.data as RecipeManagementHealthResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get application readiness status
   * GET /actuator/health/readiness
   */
  async getReadiness(): Promise<RecipeManagementHealthResponse> {
    try {
      const response = await recipeManagementClient.get(
        '/actuator/health/readiness'
      );
      return response.data as RecipeManagementHealthResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get application liveness status
   * GET /actuator/health/liveness
   */
  async getLiveness(): Promise<RecipeManagementHealthResponse> {
    try {
      const response = await recipeManagementClient.get(
        '/actuator/health/liveness'
      );
      return response.data as RecipeManagementHealthResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
