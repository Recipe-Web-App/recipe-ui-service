import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  SearchRecipesResponse,
  RecipeDto,
} from '@/types/recipe-management';

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

      // Transform response: backend returns { recipes: [...] }, frontend expects SearchRecipesResponse
      const data = response.data as { recipes: RecipeDto[] };
      const recipes = data.recipes ?? [];

      return {
        content: recipes,
        totalElements: recipes.length,
        totalPages: 1,
        first: true,
        last: true,
        numberOfElements: recipes.length,
      };
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
