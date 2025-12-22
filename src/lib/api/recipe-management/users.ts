import {
  recipeManagementClient,
  handleRecipeManagementApiError,
  buildQueryParams,
  type PaginationParams,
} from './client';
import type {
  SearchRecipesResponse,
  PageCollectionDto,
} from '@/types/recipe-management';

/**
 * Parameters for fetching user's collections
 */
export interface MyCollectionsParams extends PaginationParams {
  /**
   * When true, includes collections where the user is a collaborator
   * in addition to collections owned by the user. When false or omitted,
   * only returns collections owned by the user.
   */
  includeCollaborations?: boolean;
}

export const usersApi = {
  /**
   * Get all recipes owned by the authenticated user
   * GET /users/me/recipes
   */
  async getMyRecipes(
    params?: PaginationParams
  ): Promise<SearchRecipesResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const response = await recipeManagementClient.get(
        `/users/me/recipes${queryString ? `?${queryString}` : ''}`
      );

      // Return response as SearchRecipesResponse - backend returns matching structure
      const responseData = response.data as SearchRecipesResponse;
      return responseData;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },

  /**
   * Get all collections owned by the authenticated user
   * GET /users/me/collections
   *
   * @param params - Pagination parameters and optional includeCollaborations flag
   * @returns Paginated collection response
   */
  async getMyCollections(
    params?: MyCollectionsParams
  ): Promise<PageCollectionDto> {
    try {
      // Build query params, handling includeCollaborations separately
      const { includeCollaborations, ...paginationParams } = params ?? {};
      let queryString = paginationParams
        ? buildQueryParams(paginationParams)
        : '';

      // Add includeCollaborations if specified
      if (includeCollaborations !== undefined) {
        const separator = queryString ? '&' : '';
        queryString += `${separator}includeCollaborations=${String(includeCollaborations)}`;
      }

      const response = await recipeManagementClient.get(
        `/users/me/collections${queryString ? `?${queryString}` : ''}`
      );

      const responseData = response.data as PageCollectionDto;
      return responseData;
    } catch (error) {
      handleRecipeManagementApiError(error);
      throw error;
    }
  },
};
