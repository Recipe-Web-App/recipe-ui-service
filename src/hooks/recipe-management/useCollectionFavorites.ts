import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionFavoritesApi } from '@/lib/api/recipe-management/collection-favorites';
import { QUERY_KEYS } from '@/constants';
import type {
  PageCollectionDto,
  GetFavoriteCollectionsParams,
} from '@/types/recipe-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const COLLECTION_FAVORITES = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTION_FAVORITES as readonly string[];
const USER_COLLECTION_FAVORITES = QUERY_KEYS.RECIPE_MANAGEMENT
  .USER_COLLECTION_FAVORITES as readonly string[];
const COLLECTION_FAVORITE_STATUS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTION_FAVORITE_STATUS as readonly string[];
const COLLECTION = QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION as readonly string[];
const COLLECTIONS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTIONS as readonly string[];

/**
 * Hook to fetch favorite collections for a user
 * @param params - Optional parameters including userId and pagination
 * @returns Query result with paginated favorite collections
 */
export const useFavoriteCollections = (
  params?: GetFavoriteCollectionsParams
) => {
  return useQuery({
    queryKey: params?.userId
      ? [...USER_COLLECTION_FAVORITES, params.userId, params]
      : [...COLLECTION_FAVORITES, params],
    queryFn: (): Promise<PageCollectionDto> => {
      return collectionFavoritesApi.getFavoriteCollections(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (user-specific data that may change)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to check if a collection is favorited by the authenticated user
 * @param collectionId - Collection identifier
 * @returns Query result with boolean favorite status
 */
export const useIsCollectionFavorited = (collectionId: number) => {
  return useQuery({
    queryKey: [...COLLECTION_FAVORITE_STATUS, collectionId],
    queryFn: (): Promise<boolean> => {
      return collectionFavoritesApi.isCollectionFavorited(collectionId);
    },
    enabled: !!collectionId,
    staleTime: 1 * 60 * 1000, // 1 minute (frequently checked)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a collection to the authenticated user's favorites
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useFavoriteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: number) =>
      collectionFavoritesApi.favoriteCollection(collectionId),
    onSuccess: (newFavorite, collectionId) => {
      // Set favorite status cache to true for instant UI feedback
      queryClient.setQueryData(
        [...COLLECTION_FAVORITE_STATUS, collectionId],
        true
      );

      // Invalidate all collection favorites queries to show the new favorite
      queryClient.invalidateQueries({
        queryKey: COLLECTION_FAVORITES,
      });

      // Invalidate user-specific collection favorites
      queryClient.invalidateQueries({
        queryKey: USER_COLLECTION_FAVORITES,
      });

      // Invalidate the specific collection query
      queryClient.invalidateQueries({
        queryKey: [...COLLECTION, collectionId],
      });

      // Invalidate collections list (may show favorite indicators)
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};

/**
 * Hook to remove a collection from the authenticated user's favorites
 * Performs optimistic updates and invalidates related queries
 * @returns Mutation function and state
 */
export const useUnfavoriteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: number) =>
      collectionFavoritesApi.unfavoriteCollection(collectionId),
    onSuccess: (_, collectionId) => {
      // Set favorite status cache to false for instant UI feedback
      queryClient.setQueryData(
        [...COLLECTION_FAVORITE_STATUS, collectionId],
        false
      );

      // Invalidate all collection favorites queries to remove the unfavorited collection
      queryClient.invalidateQueries({
        queryKey: COLLECTION_FAVORITES,
      });

      // Invalidate user-specific collection favorites
      queryClient.invalidateQueries({
        queryKey: USER_COLLECTION_FAVORITES,
      });

      // Invalidate the specific collection query
      queryClient.invalidateQueries({
        queryKey: [...COLLECTION, collectionId],
      });

      // Invalidate collections list (may show favorite indicators)
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};
