import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  CollaboratorDto,
  AddCollaboratorRequest,
} from '@/types/recipe-management';

export const collectionCollaboratorsApi = {
  /**
   * Get collection collaborators
   * GET /collections/{collectionId}/collaborators
   */
  async getCollaborators(collectionId: number): Promise<CollaboratorDto[]> {
    try {
      const response = await recipeManagementClient.get(
        `/collections/${collectionId}/collaborators`
      );
      return response.data as CollaboratorDto[];
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add collaborator to collection
   * POST /collections/{collectionId}/collaborators
   */
  async addCollaborator(
    collectionId: number,
    data: AddCollaboratorRequest
  ): Promise<CollaboratorDto> {
    try {
      const response = await recipeManagementClient.post(
        `/collections/${collectionId}/collaborators`,
        data
      );
      return response.data as CollaboratorDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Remove collaborator from collection
   * DELETE /collections/{collectionId}/collaborators/{userId}
   */
  async removeCollaborator(
    collectionId: number,
    userId: string
  ): Promise<void> {
    try {
      await recipeManagementClient.delete(
        `/collections/${collectionId}/collaborators/${userId}`
      );
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
