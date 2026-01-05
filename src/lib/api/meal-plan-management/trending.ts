import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type { PaginatedMealPlansResponse } from '@/types/meal-plan-management';

export const trendingApi = {
  /**
   * Get trending meal plans
   * GET /meal-plans/trending
   *
   * Meal plans are ordered by trending score in descending order,
   * so the first item is the "most trending" meal plan.
   */
  async getTrendingMealPlans(
    params?: PaginationParams
  ): Promise<PaginatedMealPlansResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await mealPlanManagementClient.get(
        `/meal-plans/trending${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PaginatedMealPlansResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
