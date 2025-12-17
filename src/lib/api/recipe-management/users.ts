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

      // Return response as SearchRecipesResponse - backend returns matching structure
      const responseData = response.data as SearchRecipesResponse;
      return responseData;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
