import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  TagResponse,
  AddTagRequest,
  RemoveTagRequest,
} from '@/types/recipe-management';

export const tagsApi = {
  /**
   * Get recipe tags
   * GET /recipes/{recipeId}/tags
   */
  async getRecipeTags(recipeId: number): Promise<TagResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/tags`
      );
      return response.data as TagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add tag to recipe
   * POST /recipes/{recipeId}/tags
   */
  async addTagToRecipe(
    recipeId: number,
    data: AddTagRequest
  ): Promise<TagResponse> {
    try {
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/tags`,
        data
      );
      return response.data as TagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove tag from recipe
   * DELETE /recipes/{recipeId}/tags
   */
  async removeTagFromRecipe(
    recipeId: number,
    data: RemoveTagRequest
  ): Promise<TagResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/recipes/${recipeId}/tags`,
        { data }
      );
      return response.data as TagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
