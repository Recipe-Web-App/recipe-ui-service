import {
  mealPlanManagementClient,
  handleMealPlanManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  AddMealPlanTagsDto,
  MealPlanTagsApiResponse,
  PaginatedTagsResponse,
} from '@/types/meal-plan-management';

export interface ListTagsParams extends PaginationParams {
  nameSearch?: string;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const tagsApi = {
  /**
   * List all available meal plan tags
   * GET /meal-plans/tags
   */
  async listMealPlanTags(
    params?: ListTagsParams
  ): Promise<PaginatedTagsResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await mealPlanManagementClient.get(
        `/meal-plans/tags${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PaginatedTagsResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get tags for a specific meal plan
   * GET /meal-plans/{id}/tags
   */
  async getMealPlanTags(mealPlanId: string): Promise<MealPlanTagsApiResponse> {
    try {
      const response = await mealPlanManagementClient.get(
        `/meal-plans/${mealPlanId}/tags`
      );
      return response.data as MealPlanTagsApiResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add tags to a meal plan (additive - existing tags are kept)
   * POST /meal-plans/{id}/tags
   */
  async addMealPlanTags(
    mealPlanId: string,
    data: AddMealPlanTagsDto
  ): Promise<MealPlanTagsApiResponse> {
    try {
      const response = await mealPlanManagementClient.post(
        `/meal-plans/${mealPlanId}/tags`,
        data
      );
      return response.data as MealPlanTagsApiResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Replace all tags on a meal plan
   * PUT /meal-plans/{id}/tags
   */
  async replaceMealPlanTags(
    mealPlanId: string,
    data: AddMealPlanTagsDto
  ): Promise<MealPlanTagsApiResponse> {
    try {
      const response = await mealPlanManagementClient.put(
        `/meal-plans/${mealPlanId}/tags`,
        data
      );
      return response.data as MealPlanTagsApiResponse;
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove a specific tag from a meal plan
   * DELETE /meal-plans/{id}/tags/{tagId}
   */
  async removeMealPlanTag(mealPlanId: string, tagId: string): Promise<void> {
    try {
      await mealPlanManagementClient.delete(
        `/meal-plans/${mealPlanId}/tags/${tagId}`
      );
    } catch (error) {
      handleMealPlanManagementApiError(error);
      throw error;
    }
  },
};
