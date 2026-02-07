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
   * POST /recipes
   */
  async createRecipe(data: CreateRecipeRequest): Promise<CreateRecipeResponse> {
    try {
      const response = await recipeScraperClient.post('/recipes', data);
      return response.data as CreateRecipeResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get popular recipes from the internet
   * GET /recipes/popular
   *
   * @param params.limit - Maximum number of recipes to return (default: 10, max: 100)
   * @param params.offset - Number of recipes to skip for pagination (default: 0)
   * @param params.countOnly - If true, return only the total count of recipes
   */
  async getPopularRecipes(params?: {
    limit?: number;
    offset?: number;
    countOnly?: boolean;
  }): Promise<PopularRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/recipes/popular${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PopularRecipesResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
