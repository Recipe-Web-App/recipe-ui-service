import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type { SearchRecipesResponse } from '@/types/recipe-management';

export const usersApi = {
  /**
   * Get all recipes owned by the authenticated user
   * GET /users/me/recipes
   */
  async getMyRecipes(
    params?: PaginationParams
  ): Promise<SearchRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/users/me/recipes${queryString ? `?${queryString}` : ''}`
      );
      return response.data as SearchRecipesResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
