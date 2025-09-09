import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  RecipeRevisionsResponse,
  StepRevisionsResponse,
  IngredientRevisionsResponse,
} from '@/types/recipe-management';

export const revisionsApi = {
  /**
   * Get recipe revisions
   * GET /recipes/{recipeId}/revisions
   */
  async getRecipeRevisions(recipeId: number): Promise<RecipeRevisionsResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/revisions`
      );
      return response.data as RecipeRevisionsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get step revisions
   * GET /recipes/{recipeId}/steps/{stepId}/revisions
   */
  async getStepRevisions(
    recipeId: number,
    stepId: number
  ): Promise<StepRevisionsResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/steps/${stepId}/revisions`
      );
      return response.data as StepRevisionsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get ingredient revisions
   * GET /recipes/{recipeId}/ingredients/{ingredientId}/revisions
   */
  async getIngredientRevisions(
    recipeId: number,
    ingredientId: number
  ): Promise<IngredientRevisionsResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/ingredients/${ingredientId}/revisions`
      );
      return response.data as IngredientRevisionsResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
