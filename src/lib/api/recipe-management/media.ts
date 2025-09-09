import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  createFormData,
  type PaginationParams,
} from './client';
import type {
  PageMediaDto,
  MediaUploadRequest,
  CreateMediaResponse,
  DeleteMediaResponse,
} from '@/types/recipe-management';

export const mediaApi = {
  /**
   * Get recipe media
   * GET /recipes/{recipeId}/media
   */
  async getRecipeMedia(
    recipeId: number,
    params?: Pick<PaginationParams, 'page' | 'size'>
  ): Promise<PageMediaDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/media${queryString ? '?' + queryString : ''}`
      );
      return response.data as PageMediaDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Upload recipe media
   * POST /recipes/{recipeId}/media
   */
  async uploadRecipeMedia(
    recipeId: number,
    data: MediaUploadRequest
  ): Promise<CreateMediaResponse> {
    try {
      const formData = createFormData(data);
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data as CreateMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete recipe media
   * DELETE /recipes/{recipeId}/media/{mediaId}
   */
  async deleteRecipeMedia(
    recipeId: number,
    mediaId: number
  ): Promise<DeleteMediaResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/recipes/${recipeId}/media/${mediaId}`
      );
      return response.data as DeleteMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get ingredient media
   * GET /recipes/{recipeId}/ingredients/{ingredientId}/media
   */
  async getIngredientMedia(
    recipeId: number,
    ingredientId: number,
    params?: Pick<PaginationParams, 'page' | 'size'>
  ): Promise<PageMediaDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/ingredients/${ingredientId}/media${
          queryString ? `?${queryString}` : ''
        }`
      );
      return response.data as PageMediaDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Upload ingredient media
   * POST /recipes/{recipeId}/ingredients/{ingredientId}/media
   */
  async uploadIngredientMedia(
    recipeId: number,
    ingredientId: number,
    data: MediaUploadRequest
  ): Promise<CreateMediaResponse> {
    try {
      const formData = createFormData(data);
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/ingredients/${ingredientId}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data as CreateMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete ingredient media
   * DELETE /recipes/{recipeId}/ingredients/{ingredientId}/media/{mediaId}
   */
  async deleteIngredientMedia(
    recipeId: number,
    ingredientId: number,
    mediaId: number
  ): Promise<DeleteMediaResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/recipes/${recipeId}/ingredients/${ingredientId}/media/${mediaId}`
      );
      return response.data as DeleteMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get step media
   * GET /recipes/{recipeId}/steps/{stepId}/media
   */
  async getStepMedia(
    recipeId: number,
    stepId: number,
    params?: Pick<PaginationParams, 'page' | 'size'>
  ): Promise<PageMediaDto> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/steps/${stepId}/media${
          queryString ? `?${queryString}` : ''
        }`
      );
      return response.data as PageMediaDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Upload step media
   * POST /recipes/{recipeId}/steps/{stepId}/media
   */
  async uploadStepMedia(
    recipeId: number,
    stepId: number,
    data: MediaUploadRequest
  ): Promise<CreateMediaResponse> {
    try {
      const formData = createFormData(data);
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/steps/${stepId}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data as CreateMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete step media
   * DELETE /recipes/{recipeId}/steps/{stepId}/media/{mediaId}
   */
  async deleteStepMedia(
    recipeId: number,
    stepId: number,
    mediaId: number
  ): Promise<DeleteMediaResponse> {
    try {
      const response = await recipeManagementClient.delete(
        `/recipes/${recipeId}/steps/${stepId}/media/${mediaId}`
      );
      return response.data as DeleteMediaResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
