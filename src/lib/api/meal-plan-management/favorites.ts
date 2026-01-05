import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  PaginatedMealPlanFavoritesResponse,
  MealPlanFavoriteApiResponse,
  MealPlanFavoriteCheckApiResponse,
} from '@/types/meal-plan-management';

export interface ListFavoriteMealPlansParams extends PaginationParams {
  includeMealPlan?: boolean;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const favoritesApi = {
  /**
   * List the authenticated user's favorite meal plans
   * GET /meal-plans/favorites
   */
  async listFavoriteMealPlans(
    params?: ListFavoriteMealPlansParams
  ): Promise<PaginatedMealPlanFavoritesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await mealPlanManagementClient.get(
        `/meal-plans/favorites${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PaginatedMealPlanFavoritesResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add a meal plan to the authenticated user's favorites
   * POST /meal-plans/favorites/{mealPlanId}
   */
  async addMealPlanToFavorites(
    mealPlanId: string
  ): Promise<MealPlanFavoriteApiResponse> {
    try {
      const response = await mealPlanManagementClient.post(
        `/meal-plans/favorites/${mealPlanId}`
      );
      return response.data as MealPlanFavoriteApiResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Check if a meal plan is in the authenticated user's favorites
   * GET /meal-plans/favorites/{mealPlanId}
   */
  async checkMealPlanFavorite(
    mealPlanId: string
  ): Promise<MealPlanFavoriteCheckApiResponse> {
    try {
      const response = await mealPlanManagementClient.get(
        `/meal-plans/favorites/${mealPlanId}`
      );
      return response.data as MealPlanFavoriteCheckApiResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove a meal plan from the authenticated user's favorites
   * DELETE /meal-plans/favorites/{mealPlanId}
   */
  async removeMealPlanFromFavorites(mealPlanId: string): Promise<void> {
    try {
      await mealPlanManagementClient.delete(
        `/meal-plans/favorites/${mealPlanId}`
      );
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
