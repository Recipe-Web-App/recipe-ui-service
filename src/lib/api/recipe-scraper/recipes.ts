import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type {
  CreateRecipeRequest,
  CreateRecipeResponse,
  PopularRecipesResponse,
} from '@/types/recipe-scraper';

export const recipesApi = {
  /**
   * Create a new recipe from a URL
   * POST /create-recipe
   */
  async createRecipe(data: CreateRecipeRequest): Promise<CreateRecipeResponse> {
    try {
      const response = await recipeScraperClient.post('/create-recipe', data);
      return response.data as CreateRecipeResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get popular recipes from the internet
   * GET /popular-recipes
   *
   * @param params.limit - Maximum number of recipes to return (default: 10, max: 100)
   * @param params.offset - Number of recipes to skip for pagination (default: 0)
   * @param params.count_only - If true, return only the total count of recipes
   */
  async getPopularRecipes(params?: {
    limit?: number;
    offset?: number;
    count_only?: boolean;
  }): Promise<PopularRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/popular-recipes${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PopularRecipesResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
