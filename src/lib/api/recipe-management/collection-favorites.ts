import { recipeManagementClient, buildQueryParams } from './client';
import type {
  CollectionFavoriteDto,
  GetFavoriteCollectionsParams,
  PageCollectionDto,
} from '@/types/recipe-management';

/**
 * Collection Favorites API client
 * Handles all collection favorite-related API operations
 */
export class CollectionFavoritesApi {
  /**
   * Get all favorite collections for a user
   * @param params - Optional parameters including userId and pagination
   * @returns Promise resolving to paginated favorite collections
   * @throws 403 Forbidden if user's favorites are private and requester is not authorized
   */
  async getFavoriteCollections(
    params?: GetFavoriteCollectionsParams
  ): Promise<PageCollectionDto> {
    const queryString = params ? `?${buildQueryParams(params)}` : '';
    const response = await recipeManagementClient.get<PageCollectionDto>(
      `/favorites/collections${queryString}`
    );
    return response.data;
  }

  /**
   * Add a collection to the authenticated user's favorites
   * @param collectionId - Collection identifier
   * @returns Promise resolving to the created favorite
   * @throws 403 Forbidden if user does not have access to view this collection
   * @throws 404 Not Found if collection doesn't exist
   * @throws 409 Conflict if collection is already favorited by this user
   */
  async favoriteCollection(
    collectionId: number
  ): Promise<CollectionFavoriteDto> {
    const response = await recipeManagementClient.post<CollectionFavoriteDto>(
      `/favorites/collections/${collectionId}`
    );
    return response.data;
  }

  /**
   * Remove a collection from the authenticated user's favorites
   * @param collectionId - Collection identifier
   * @returns Promise resolving when the favorite is removed
   * @throws 404 Not Found if favorite doesn't exist
   */
  async unfavoriteCollection(collectionId: number): Promise<void> {
    await recipeManagementClient.delete(
      `/favorites/collections/${collectionId}`
    );
  }

  /**
   * Check if a collection is favorited by the authenticated user
   * @param collectionId - Collection identifier
   * @returns Promise resolving to true if favorited, false otherwise
   * @throws 401 Unauthorized if user is not authenticated
   */
  async isCollectionFavorited(collectionId: number): Promise<boolean> {
    const response = await recipeManagementClient.get<boolean>(
      `/favorites/collections/${collectionId}/is-favorited`
    );
    return response.data;
  }
}

// Export singleton instance
export const collectionFavoritesApi = new CollectionFavoritesApi();
