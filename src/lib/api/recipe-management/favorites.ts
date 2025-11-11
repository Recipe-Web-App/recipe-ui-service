import { recipeManagementClient, buildQueryParams } from './client';
import type {
  RecipeFavoriteDto,
  GetFavoriteRecipesParams,
  FavoriteRecipesResponse,
} from '@/types/recipe-management/favorite';

/**
 * Recipe Favorites API client
 * Handles all recipe favorite-related API operations
 */
export class FavoritesApi {
  /**
   * Get all favorite recipes for a user
   * @param params - Optional parameters including userId and pagination
   * @returns Promise resolving to paginated favorite recipes
   * @throws 403 Forbidden if user's favorites are private and requester is not authorized
   */
  async getFavoriteRecipes(
    params?: GetFavoriteRecipesParams
  ): Promise<FavoriteRecipesResponse> {
    const queryString = params ? `?${buildQueryParams(params)}` : '';
    const response = await recipeManagementClient.get<FavoriteRecipesResponse>(
      `/favorites/recipes${queryString}`
    );
    return response.data;
  }

  /**
   * Add a recipe to the authenticated user's favorites
   * @param recipeId - Recipe identifier
   * @returns Promise resolving to the created favorite
   * @throws 404 Not Found if recipe doesn't exist
   * @throws 409 Conflict if recipe is already favorited by this user
   */
  async favoriteRecipe(recipeId: number): Promise<RecipeFavoriteDto> {
    const response = await recipeManagementClient.post<RecipeFavoriteDto>(
      `/favorites/recipes/${recipeId}`
    );
    return response.data;
  }

  /**
   * Remove a recipe from the authenticated user's favorites
   * @param recipeId - Recipe identifier
   * @returns Promise resolving when the favorite is removed
   * @throws 404 Not Found if favorite doesn't exist
   */
  async unfavoriteRecipe(recipeId: number): Promise<void> {
    await recipeManagementClient.delete(`/favorites/recipes/${recipeId}`);
  }

  /**
   * Check if a recipe is favorited by the authenticated user
   * @param recipeId - Recipe identifier
   * @returns Promise resolving to true if favorited, false otherwise
   * @throws 401 Unauthorized if user is not authenticated
   */
  async isRecipeFavorited(recipeId: number): Promise<boolean> {
    const response = await recipeManagementClient.get<boolean>(
      `/favorites/recipes/${recipeId}/is-favorited`
    );
    return response.data;
  }
}

// Export singleton instance
export const favoritesApi = new FavoritesApi();
