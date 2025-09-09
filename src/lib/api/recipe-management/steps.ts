import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  StepResponse,
  StepCommentResponse,
  AddStepCommentRequest,
  EditStepCommentRequest,
  DeleteStepCommentRequest,
  StepCommentDto,
} from '@/types/recipe-management';

export const stepsApi = {
  /**
   * Get recipe steps
   * GET /recipes/{recipeId}/steps
   */
  async getRecipeSteps(recipeId: number): Promise<StepResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/steps`
      );
      return response.data as StepResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get step comments
   * GET /recipes/{recipeId}/steps/{stepId}/comment
   */
  async getStepComments(
    recipeId: number,
    stepId: number
  ): Promise<StepCommentResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/steps/${stepId}/comment`
      );
      return response.data as StepCommentResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add step comment
   * POST /recipes/{recipeId}/steps/{stepId}/comment
   */
  async addStepComment(
    recipeId: number,
    stepId: number,
    data: AddStepCommentRequest
  ): Promise<StepCommentDto> {
    try {
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/steps/${stepId}/comment`,
        data
      );
      return response.data as StepCommentDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Edit step comment
   * PUT /recipes/{recipeId}/steps/{stepId}/comment
   */
  async editStepComment(
    recipeId: number,
    stepId: number,
    data: EditStepCommentRequest
  ): Promise<StepCommentDto> {
    try {
      const response = await recipeManagementClient.put(
        `/recipes/${recipeId}/steps/${stepId}/comment`,
        data
      );
      return response.data as StepCommentDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete step comment
   * DELETE /recipes/{recipeId}/steps/{stepId}/comment
   */
  async deleteStepComment(
    recipeId: number,
    stepId: number,
    data: DeleteStepCommentRequest
  ): Promise<void> {
    try {
      await recipeManagementClient.delete(
        `/recipes/${recipeId}/steps/${stepId}/comment`,
        { data }
      );
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
