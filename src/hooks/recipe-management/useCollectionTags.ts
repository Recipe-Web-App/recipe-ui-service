import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionTagsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  AddTagRequest,
  RemoveTagRequest,
} from '@/types/recipe-management';

/**
 * Hook to fetch collection tags
 */
export const useCollectionTags = (collectionId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS, collectionId],
    queryFn: () => collectionTagsApi.getCollectionTags(collectionId),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a tag to a collection
 */
export const useAddTagToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: AddTagRequest;
    }) => collectionTagsApi.addTagToCollection(collectionId, data),
    onSuccess: (response, variables) => {
      // Update the collection tags cache with the new response
      queryClient.setQueryData(
        [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS,
          variables.collectionId,
        ],
        response
      );

      // Invalidate collection tags to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS,
          variables.collectionId,
        ],
      });

      // Invalidate the collection query as it might include tag information
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION,
          variables.collectionId,
        ],
      });

      // Invalidate collections list as it might include tag information
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTIONS,
      });
    },
  });
};

/**
 * Hook to remove a tag from a collection
 */
export const useRemoveTagFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: RemoveTagRequest;
    }) => collectionTagsApi.removeTagFromCollection(collectionId, data),
    onSuccess: (response, variables) => {
      // Update the collection tags cache with the new response
      queryClient.setQueryData(
        [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS,
          variables.collectionId,
        ],
        response
      );

      // Invalidate collection tags to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS,
          variables.collectionId,
        ],
      });

      // Invalidate the collection query as it might include tag information
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION,
          variables.collectionId,
        ],
      });

      // Invalidate collections list as it might include tag information
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTIONS,
      });
    },
  });
};

/**
 * Hook to manage multiple tags for a collection
 * Provides both add and remove operations with optimistic updates
 */
export const useCollectionTagManager = (collectionId: number) => {
  const addTagMutation = useAddTagToCollection();
  const removeTagMutation = useRemoveTagFromCollection();

  const addTag = (tagData: AddTagRequest) => {
    return addTagMutation.mutateAsync({ collectionId, data: tagData });
  };

  const removeTag = (tagData: RemoveTagRequest) => {
    return removeTagMutation.mutateAsync({ collectionId, data: tagData });
  };

  const isLoading = addTagMutation.isPending || removeTagMutation.isPending;
  const error = addTagMutation.error ?? removeTagMutation.error;

  return {
    addTag,
    removeTag,
    isLoading,
    error,
    isAddingTag: addTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    addTagError: addTagMutation.error,
    removeTagError: removeTagMutation.error,
  };
};

/**
 * Helper hook to invalidate all tag-related queries for a collection
 * Useful when tags are modified outside of these hooks
 */
export const useInvalidateCollectionTags = () => {
  const queryClient = useQueryClient();

  return (collectionId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION_TAGS, collectionId],
    });
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION, collectionId],
    });
  };
};
