import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
} from './client';
import type {
  RecipeIngredientsResponse,
  ShoppingListResponse,
  AddIngredientCommentRequest,
  EditIngredientCommentRequest,
  DeleteIngredientCommentRequest,
  IngredientCommentResponse,
} from '@/types/recipe-management';

interface ScaleIngredientsParams {
  quantity: number;
}

export const ingredientsApi = {
  /**
   * Get recipe ingredients
   * GET /recipes/{recipeId}/ingredients
   */
  async getRecipeIngredients(
    recipeId: number
  ): Promise<RecipeIngredientsResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/ingredients`
      );
      return response.data as RecipeIngredientsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Scale recipe ingredients
   * GET /recipes/{recipeId}/ingredients/scale
   */
  async scaleIngredients(
    recipeId: number,
    params: ScaleIngredientsParams
  ): Promise<RecipeIngredientsResponse> {
    try {
      const queryString = buildQueryParams(params);
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/ingredients/scale?${queryString}`
      );
      return response.data as RecipeIngredientsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Generate shopping list
   * GET /recipes/{recipeId}/ingredients/shopping-list
   */
  async generateShoppingList(recipeId: number): Promise<ShoppingListResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/ingredients/shopping-list`
      );
      return response.data as ShoppingListResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add ingredient comment
   * POST /recipes/{recipeId}/ingredients/{ingredientId}/comment
   */
  async addIngredientComment(
    recipeId: number,
    ingredientId: number,
    data: AddIngredientCommentRequest
  ): Promise<IngredientCommentResponse> {
    try {
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/ingredients/${ingredientId}/comment`,
        data
      );
      return response.data as IngredientCommentResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Edit ingredient comment
   * PUT /recipes/{recipeId}/ingredients/{ingredientId}/comment
   */
  async editIngredientComment(
    recipeId: number,
    ingredientId: number,
    data: EditIngredientCommentRequest
  ): Promise<IngredientCommentResponse> {
    try {
      const response = await recipeManagementClient.put(
        `/recipes/${recipeId}/ingredients/${ingredientId}/comment`,
        data
      );
      return response.data as IngredientCommentResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete ingredient comment
   * DELETE /recipes/{recipeId}/ingredients/{ingredientId}/comment
   */
  async deleteIngredientComment(
    recipeId: number,
    ingredientId: number,
    data: DeleteIngredientCommentRequest
  ): Promise<IngredientCommentResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/recipes/${recipeId}/ingredients/${ingredientId}/comment`,
        { data }
      );
      return response.data as IngredientCommentResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
