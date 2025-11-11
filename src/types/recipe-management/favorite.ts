import { PaginationParams } from '@/lib/api/recipe-management/client';
import { SearchRecipesResponse } from './search';

// Re-export RecipeFavoriteDto for convenience
export type { RecipeFavoriteDto } from './recipe';

/**
 * Parameters for fetching favorite recipes
 */
export interface GetFavoriteRecipesParams extends PaginationParams {
  /**
   * User ID to fetch favorites for (UUID format)
   * If not provided, returns favorites for the authenticated user
   */
  userId?: string;
}

/**
 * Response type for favorite recipes list
 * Reuses SearchRecipesResponse structure for consistency
 */
export type FavoriteRecipesResponse = SearchRecipesResponse;
