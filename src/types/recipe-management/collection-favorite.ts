import type { PaginationParams } from '@/lib/api/recipe-management/client';

/**
 * DTO for a collection favorite record
 * Represents a user's favorite relationship with a collection
 */
export interface CollectionFavoriteDto {
  /** Collection identifier */
  collectionId: number;
  /** UUID of user who favorited the collection */
  userId: string;
  /** Timestamp when collection was favorited (ISO 8601 format) */
  favoritedAt: string;
}

/**
 * Parameters for fetching favorite collections
 */
export interface GetFavoriteCollectionsParams extends PaginationParams {
  /**
   * User ID to fetch favorites for (UUID format)
   * If not provided, returns favorites for the authenticated user
   */
  userId?: string;
}
