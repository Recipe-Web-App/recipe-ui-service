import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  CollectionTagResponse,
  AddTagRequest,
  RemoveTagRequest,
} from '@/types/recipe-management';

export const collectionTagsApi = {
  /**
   * Get collection tags
   * GET /collections/{collectionId}/tags
   */
  async getCollectionTags(
    collectionId: number
  ): Promise<CollectionTagResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/collections/${collectionId}/tags`
      );
      return response.data as CollectionTagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add tag to collection
   * POST /collections/{collectionId}/tags
   */
  async addTagToCollection(
    collectionId: number,
    data: AddTagRequest
  ): Promise<CollectionTagResponse> {
    try {
      const response = await recipeManagementClient.post(
        `/collections/${collectionId}/tags`,
        data
      );
      return response.data as CollectionTagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove tag from collection
   * DELETE /collections/{collectionId}/tags
   */
  async removeTagFromCollection(
    collectionId: number,
    data: RemoveTagRequest
  ): Promise<CollectionTagResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/collections/${collectionId}/tags`,
        { data }
      );
      return response.data as CollectionTagResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
