import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  CollectionRecipeDto,
  UpdateRecipeOrderRequest,
  ReorderRecipesRequest,
} from '@/types/recipe-management';

export const collectionRecipesApi = {
  /**
   * Add recipe to collection
   * POST /collections/{collectionId}/recipes/{recipeId}
   */
  async addRecipeToCollection(
    collectionId: number,
    recipeId: number
  ): Promise<CollectionRecipeDto> {
    try {
      const response = await recipeManagementClient.post(
        `/collections/${collectionId}/recipes/${recipeId}`
      );
      return response.data as CollectionRecipeDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove recipe from collection
   * DELETE /collections/{collectionId}/recipes/{recipeId}
   */
  async removeRecipeFromCollection(
    collectionId: number,
    recipeId: number
  ): Promise<void> {
    try {
      await recipeManagementClient.delete(
        `/collections/${collectionId}/recipes/${recipeId}`
      );
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Update recipe display order in collection
   * PATCH /collections/{collectionId}/recipes/{recipeId}
   */
  async updateRecipeOrder(
    collectionId: number,
    recipeId: number,
    data: UpdateRecipeOrderRequest
  ): Promise<CollectionRecipeDto> {
    try {
      const response = await recipeManagementClient.patch(
        `/collections/${collectionId}/recipes/${recipeId}`,
        data
      );
      return response.data as CollectionRecipeDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Batch reorder recipes in collection
   * PUT /collections/{collectionId}/recipes/reorder
   */
  async reorderRecipes(
    collectionId: number,
    data: ReorderRecipesRequest
  ): Promise<CollectionRecipeDto[]> {
    try {
      const response = await recipeManagementClient.put(
        `/collections/${collectionId}/recipes/reorder`,
        data
      );
      return response.data as CollectionRecipeDto[];
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
