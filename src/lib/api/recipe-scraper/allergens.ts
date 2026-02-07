import {
  recipeScraperClient,
  handleRecipeScraperApiError,
  buildQueryParams,
} from './client';
import type {
  IngredientAllergenResponse,
  RecipeAllergenResponse,
} from '@/types/recipe-scraper';

export const allergensApi = {
  /**
   * Get allergen information for a specific ingredient
   * GET /ingredients/{ingredient_id}/allergens
   *
   * @param ingredientId - The ID of the ingredient
   */
  async getIngredientAllergens(
    ingredientId: number
  ): Promise<IngredientAllergenResponse> {
    try {
      const response = await recipeScraperClient.get(
        `/ingredients/${ingredientId}/allergens`
      );
      return response.data as IngredientAllergenResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Get allergen information for a recipe
   * GET /recipes/{recipe_id}/allergens
   *
   * @param recipeId - The ID of the recipe
   * @param params.includeIngredientDetails - Include per-ingredient allergen details
   */
  async getRecipeAllergens(
    recipeId: number,
    params?: {
      includeIngredientDetails?: boolean;
    }
  ): Promise<RecipeAllergenResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeScraperClient.get(
        `/recipes/${recipeId}/allergens${queryString ? `?${queryString}` : ''}`
      );
      return response.data as RecipeAllergenResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
