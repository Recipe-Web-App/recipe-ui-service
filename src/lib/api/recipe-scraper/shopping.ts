import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type {
  IngredientShoppingInfoResponse,
  RecipeShoppingInfoResponse,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

export const shoppingApi = {
  /**
   * Get shopping information for a specific ingredient
   * GET /api/recipe-scraper/ingredients/{ingredient_id}/shopping-info
   *
   * @param ingredientId - The ID of the ingredient
   * @param params.amount - The amount of the ingredient
   * @param params.measurement - The unit of measurement for the amount
   */
  async getIngredientShoppingInfo(
    ingredientId: number,
    params?: {
      amount?: number;
      measurement?: IngredientUnitEnum;
    }
  ): Promise<IngredientShoppingInfoResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/api/recipe-scraper/ingredients/${ingredientId}/shopping-info${
          queryString ? `?${queryString}` : ''
        }`
      );
      return response.data as IngredientShoppingInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get shopping information for all ingredients in a recipe
   * GET /api/recipe-scraper/recipes/{recipe_id}/shopping-info
   *
   * @param recipeId - The ID of the recipe
   */
  async getRecipeShoppingInfo(
    recipeId: number
  ): Promise<RecipeShoppingInfoResponse> {
    try {
      const response = await recipeScraperClient.get(
        `/api/recipe-scraper/recipes/${recipeId}/shopping-info`
      );
      return response.data as RecipeShoppingInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
