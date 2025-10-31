import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionCollaboratorsApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  CollaboratorDto,
  CollectionDetailsDto,
  AddCollaboratorRequest,
} from '@/types/recipe-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const COLLECTION = QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION as readonly string[];
const COLLECTION_COLLABORATORS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTION_COLLABORATORS as readonly string[];
const COLLECTIONS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTIONS as readonly string[];

/**
 * Hook to fetch collaborators for a collection
 */
export const useCollectionCollaborators = (collectionId: number) => {
  return useQuery({
    queryKey: [...COLLECTION_COLLABORATORS, collectionId],
    queryFn: async (): Promise<CollaboratorDto[]> => {
      return await collectionCollaboratorsApi.getCollaborators(collectionId);
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add a collaborator to a collection
 */
export const useAddCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: AddCollaboratorRequest;
    }) => collectionCollaboratorsApi.addCollaborator(collectionId, data),
    onSuccess: (newCollaborator, variables) => {
      // Update the collaborators list in cache
      queryClient.setQueryData<CollaboratorDto[]>(
        [...COLLECTION_COLLABORATORS, variables.collectionId],
        oldData => {
          if (oldData) {
            return [...oldData, newCollaborator];
          }
          return [newCollaborator];
        }
      );

      // Update the collection details to increment collaborator count
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              collaboratorCount: oldData.collaboratorCount + 1,
            };
          }
          return oldData;
        }
      );

      // Invalidate collections list to update counts
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};

/**
 * Hook to remove a collaborator from a collection
 */
export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      userId,
    }: {
      collectionId: number;
      userId: string;
    }) => collectionCollaboratorsApi.removeCollaborator(collectionId, userId),
    onSuccess: (_, variables) => {
      // Update the collaborators list in cache
      queryClient.setQueryData<CollaboratorDto[]>(
        [...COLLECTION_COLLABORATORS, variables.collectionId],
        oldData => {
          if (oldData) {
            return oldData.filter(c => c.userId !== variables.userId);
          }
          return oldData;
        }
      );

      // Update the collection details to decrement collaborator count
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              collaboratorCount: oldData.collaboratorCount - 1,
            };
          }
          return oldData;
        }
      );

      // Invalidate collections list to update counts
      queryClient.invalidateQueries({
        queryKey: COLLECTIONS,
      });
    },
  });
};
