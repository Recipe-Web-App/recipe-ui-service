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
   * GET /recipes/{recipe_id}/nutritional-info
   *
   * @param recipeId - The ID of the recipe
   * @param params.includeTotal - Include total nutritional info for the recipe
   * @param params.includeIngredients - Include nutritional info for each ingredient
   */
  async getRecipeNutritionalInfo(
    recipeId: number,
    params?: {
      includeTotal?: boolean;
      includeIngredients?: boolean;
    }
  ): Promise<RecipeNutritionalInfoResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/recipes/${recipeId}/nutritional-info${queryString ? `?${queryString}` : ''}`
      );
      return response.data as RecipeNutritionalInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get nutritional information for a specific ingredient
   * GET /ingredients/{ingredient_id}/nutritional-info
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
        `/ingredients/${ingredientId}/nutritional-info${queryString ? `?${queryString}` : ''}`
      );
      return response.data as IngredientNutritionalInfoResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
