import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type {
  RecipeNutritionalInfoResponse,
  IngredientNutritionalInfoResponse,
  IngredientUnitEnum,
} from '@/types/recipe-scraper';

export const nutritionApi = {
  /**
   * Get nutritional information for a recipe
   * GET /api/recipe-scraper/recipes/{recipe_id}/nutritional-info
   *
   * @param recipeId - The ID of the recipe
   * @param params.include_total - Include total nutritional info for the recipe
   * @param params.include_ingredients - Include nutritional info for each ingredient
   */
  async getRecipeNutritionalInfo(
    recipeId: number,
    params?: {
      include_total?: boolean;
      include_ingredients?: boolean;
    }
  ): Promise<RecipeNutritionalInfoResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/api/recipe-scraper/recipes/${recipeId}/nutritional-info${
          queryString ? `?${queryString}` : ''
        }`
      );
      return response.data as RecipeNutritionalInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get nutritional information for a specific ingredient
   * GET /api/recipe-scraper/ingredients/{ingredient_id}/nutritional-info
   *
   * @param ingredientId - The ID of the ingredient
   * @param params.amount - The amount of the ingredient
   * @param params.measurement - The unit of measurement for the amount
   */
  async getIngredientNutritionalInfo(
    ingredientId: number,
    params?: {
      amount?: number;
      measurement?: IngredientUnitEnum;
    }
  ): Promise<IngredientNutritionalInfoResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/api/recipe-scraper/ingredients/${ingredientId}/nutritional-info${
          queryString ? `?${queryString}` : ''
        }`
      );
      return response.data as IngredientNutritionalInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
