import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  CollectionDetailsDto,
  PageCollectionDto,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  SearchCollectionsRequest,
} from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

// Safe query keys to prevent TypeScript unsafe member access warnings
const COLLECTIONS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTIONS as readonly string[];
const COLLECTION = QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION as readonly string[];
const COLLECTION_RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTION_RECIPES as readonly string[];
const COLLECTION_COLLABORATORS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTION_COLLABORATORS as readonly string[];

/**
 * Hook to fetch all accessible collections with optional pagination
 */
export const useCollections = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...COLLECTIONS, params],
    queryFn: (): Promise<PageCollectionDto> => {
      return collectionsApi.getCollections(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a specific collection by ID with all recipes
 */
export const useCollection = (collectionId: number) => {
  return useQuery({
    queryKey: [...COLLECTION, collectionId],
    queryFn: async (): Promise<CollectionDetailsDto> => {
      return await collectionsApi.getCollectionById(collectionId);
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to search collections with filters and pagination
 */
export const useSearchCollections = (
  searchRequest: SearchCollectionsRequest,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: [...COLLECTIONS, 'search', searchRequest, params],
    queryFn: (): Promise<PageCollectionDto> => {
      return collectionsApi.searchCollections(searchRequest, params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create a new collection
 *
 * Supports batch operations:
 * - recipeIds: Add recipes during creation
 * - collaboratorIds: Add collaborators during creation (SPECIFIC_USERS mode only)
 */
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionRequest) =>
      collectionsApi.createCollection(data),
    onSuccess: newCollection => {
      // Add the new collection to the collections list cache
      queryClient.setQueryData<PageCollectionDto>(COLLECTIONS, oldData => {
        if (oldData) {
          return {
            ...oldData,
            content: [newCollection, ...oldData.content],
            totalElements: oldData.totalElements + 1,
          };
        }
        return oldData;
      });

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });

      // Invalidate collection detail query - we don't have full recipe DTOs
      // so let consumers refetch if they need the details
      queryClient.invalidateQueries({
        queryKey: [...COLLECTION, newCollection.collectionId],
      });
    },
  });
};

/**
 * Hook to update an existing collection
 */
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: UpdateCollectionRequest;
    }) => collectionsApi.updateCollection(collectionId, data),
    onSuccess: (updatedCollection, variables) => {
      // Update the collection in cache
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              ...updatedCollection,
            };
          }
          return oldData;
        }
      );

      // Invalidate collections list to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};

/**
 * Hook to delete a collection
 */
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: number) =>
      collectionsApi.deleteCollection(collectionId),
    onSuccess: (_, collectionId) => {
      // Remove the collection from cache
      queryClient.removeQueries({
        queryKey: [...COLLECTION, collectionId],
      });

      // Remove collection recipes from cache
      queryClient.removeQueries({
        queryKey: [...COLLECTION_RECIPES, collectionId],
      });

      // Remove collection collaborators from cache
      queryClient.removeQueries({
        queryKey: [...COLLECTION_COLLABORATORS, collectionId],
      });

      // Invalidate collections list
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};
