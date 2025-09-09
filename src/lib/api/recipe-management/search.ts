import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  SearchRecipesRequest,
  SearchRecipesResponse,
} from '@/types/recipe-management';

export const searchApi = {
  /**
   * Search recipes with advanced criteria
   * POST /recipes/search
   */
  async searchRecipes(
    searchData: SearchRecipesRequest,
    params?: PaginationParams
  ): Promise<SearchRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.post(
        `/recipes/search${queryString ? `?${queryString}` : ''}`,
        searchData
      );
      return response.data as SearchRecipesResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
