import { recipeManagementClient } from './client';
import type {
  RecipeCommentDto,
  RecipeCommentsResponse,
  AddRecipeCommentRequest,
  EditRecipeCommentRequest,
} from '@/types/recipe-management/comment';

/**
 * Recipe Comments API client
 * Handles all recipe comment-related API operations
 */
export class RecipeCommentsApi {
  /**
   * Get all comments for a recipe
   * @param recipeId - Recipe identifier
   * @returns Promise resolving to comments response
   */
  async getRecipeComments(recipeId: number): Promise<RecipeCommentsResponse> {
    const response = await recipeManagementClient.get<RecipeCommentsResponse>(
      `/recipes/${recipeId}/comments`
    );
    return response.data;
  }

  /**
   * Add a new comment to a recipe
   * @param recipeId - Recipe identifier
   * @param data - Comment data
   * @returns Promise resolving to the created comment
   */
  async addRecipeComment(
    recipeId: number,
    data: AddRecipeCommentRequest
  ): Promise<RecipeCommentDto> {
    const response = await recipeManagementClient.post<RecipeCommentDto>(
      `/recipes/${recipeId}/comments`,
      data
    );
    return response.data;
  }

  /**
   * Edit an existing recipe comment
   * @param recipeId - Recipe identifier
   * @param commentId - Comment identifier
   * @param data - Updated comment data
   * @returns Promise resolving to the updated comment
   */
  async editRecipeComment(
    recipeId: number,
    commentId: number,
    data: EditRecipeCommentRequest
  ): Promise<RecipeCommentDto> {
    const response = await recipeManagementClient.put<RecipeCommentDto>(
      `/recipes/${recipeId}/comments/${commentId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a recipe comment
   * @param recipeId - Recipe identifier
   * @param commentId - Comment identifier
   * @returns Promise resolving when the comment is deleted
   */
  async deleteRecipeComment(
    recipeId: number,
    commentId: number
  ): Promise<void> {
    await recipeManagementClient.delete(
      `/recipes/${recipeId}/comments/${commentId}`
    );
  }
}

// Export singleton instance
export const recipeCommentsApi = new RecipeCommentsApi();
