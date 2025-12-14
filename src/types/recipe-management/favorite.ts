import { PaginationParams } from '@/lib/api/recipe-management/client';
import { RecipeDto } from './recipe';

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
 * Matches the actual backend API response format
 * Uses 'recipes' instead of 'content' per backend contract
 */
export interface FavoriteRecipesResponse {
  recipes: RecipeDto[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
