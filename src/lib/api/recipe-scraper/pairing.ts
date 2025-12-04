import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type { PairingSuggestionsResponse } from '@/types/recipe-scraper';

export const pairingApi = {
  /**
   * Get pairing suggestions for a recipe
   * GET /recipes/{recipe_id}/pairing-suggestions
   *
   * @param recipeId - The ID of the recipe
   * @param params.limit - Maximum number of suggestions to return
   * @param params.offset - Number of suggestions to skip for pagination
   * @param params.count_only - If true, return only the total count
   */
  async getPairingSuggestions(
    recipeId: number,
    params?: {
      limit?: number;
      offset?: number;
      count_only?: boolean;
    }
  ): Promise<PairingSuggestionsResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/recipes/${recipeId}/pairing-suggestions${queryString ? `?${queryString}` : ''}`
      );
      return response.data as PairingSuggestionsResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
