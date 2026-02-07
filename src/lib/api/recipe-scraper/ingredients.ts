import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type {
  RecommendedSubstitutionsResponse,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

export const ingredientsApi = {
  /**
   * Get recommended substitutions for an ingredient
   * GET /ingredients/{ingredient_id}/substitutions
   *
   * @param ingredientId - The ID of the ingredient
   * @param params.limit - Maximum number of substitutions to return
   * @param params.offset - Number of substitutions to skip for pagination
   * @param params.countOnly - If true, return only the total count
   * @param params.amount - The amount of the ingredient
   * @param params.measurement - The unit of measurement for the amount
   */
  async getRecommendedSubstitutions(
    ingredientId: number,
    params?: {
      limit?: number;
      offset?: number;
      countOnly?: boolean;
      amount?: number;
      measurement?: IngredientUnitEnum;
    }
  ): Promise<RecommendedSubstitutionsResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/ingredients/${ingredientId}/substitutions${queryString ? `?${queryString}` : ''}`
      );
      return response.data as RecommendedSubstitutionsResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
