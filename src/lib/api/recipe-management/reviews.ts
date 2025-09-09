import {
  recipeManagementClient,
  handleRecipeManagementApiError,
} from './client';
import type {
  ReviewResponse,
  AddReviewRequest,
  EditReviewRequest,
  ReviewDto,
} from '@/types/recipe-management';

export const reviewsApi = {
  /**
   * Get recipe reviews
   * GET /recipes/{recipeId}/review
   */
  async getRecipeReviews(recipeId: number): Promise<ReviewResponse> {
    try {
      const response = await recipeManagementClient.get(
        `/recipes/${recipeId}/review`
      );
      return response.data as ReviewResponse;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Add recipe review
   * POST /recipes/{recipeId}/review
   */
  async addRecipeReview(
    recipeId: number,
    data: AddReviewRequest
  ): Promise<ReviewDto> {
    try {
      const response = await recipeManagementClient.post(
        `/recipes/${recipeId}/review`,
        data
      );
      return response.data as ReviewDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Edit recipe review
   * PUT /recipes/{recipeId}/review/{reviewId}
   */
  async editRecipeReview(
    recipeId: number,
    reviewId: number,
    data: EditReviewRequest
  ): Promise<ReviewDto> {
    try {
      const response = await recipeManagementClient.put(
        `/recipes/${recipeId}/review/${reviewId}`,
        data
      );
      return response.data as ReviewDto;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Delete recipe review
   * DELETE /recipes/{recipeId}/review/{reviewId}
   */
  async deleteRecipeReview(recipeId: number, reviewId: number): Promise<void> {
    try {
      await recipeManagementClient.delete(
        `/recipes/${recipeId}/review/${reviewId}`
      );
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
