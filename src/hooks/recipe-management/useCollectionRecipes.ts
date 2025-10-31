import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionRecipesApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  CollectionDetailsDto,
  UpdateRecipeOrderRequest,
  ReorderRecipesRequest,
} from '@/types/recipe-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const COLLECTION = QUERY_KEYS.RECIPE_MANAGEMENT.COLLECTION as readonly string[];
const COLLECTIONS = QUERY_KEYS.RECIPE_MANAGEMENT
  .COLLECTIONS as readonly string[];

/**
 * Hook to add a recipe to a collection
 */
export const useAddRecipeToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      recipeId,
    }: {
      collectionId: number;
      recipeId: number;
    }) => collectionRecipesApi.addRecipeToCollection(collectionId, recipeId),
    onSuccess: (newRecipe, variables) => {
      // Update the collection details in cache
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              recipes: [...oldData.recipes, newRecipe],
              recipeCount: oldData.recipeCount + 1,
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
 * Hook to remove a recipe from a collection
 */
export const useRemoveRecipeFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      recipeId,
    }: {
      collectionId: number;
      recipeId: number;
    }) =>
      collectionRecipesApi.removeRecipeFromCollection(collectionId, recipeId),
    onSuccess: (_, variables) => {
      // Update the collection details in cache
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              recipes: oldData.recipes.filter(
                r => r.recipeId !== variables.recipeId
              ),
              recipeCount: oldData.recipeCount - 1,
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
 * Hook to update a recipe's display order in a collection
 */
export const useUpdateRecipeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      recipeId,
      data,
    }: {
      collectionId: number;
      recipeId: number;
      data: UpdateRecipeOrderRequest;
    }) => collectionRecipesApi.updateRecipeOrder(collectionId, recipeId, data),
    onSuccess: (updatedRecipe, variables) => {
      // Update the collection details in cache
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              recipes: oldData.recipes.map(r =>
                r.recipeId === variables.recipeId ? updatedRecipe : r
              ),
            };
          }
          return oldData;
        }
      );

      // Invalidate collection to get fresh sorted order
      queryClient.invalidateQueries({
        queryKey: [...COLLECTION, variables.collectionId],
      });
    },
  });
};

/**
 * Hook to batch reorder recipes in a collection
 */
export const useReorderRecipes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: number;
      data: ReorderRecipesRequest;
    }) => collectionRecipesApi.reorderRecipes(collectionId, data),
    onSuccess: (reorderedRecipes, variables) => {
      // Update the collection details in cache with new order
      queryClient.setQueryData(
        [...COLLECTION, variables.collectionId],
        (oldData: CollectionDetailsDto | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              recipes: reorderedRecipes,
            };
          }
          return oldData;
        }
      );

      // Invalidate collection to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [...COLLECTION, variables.collectionId],
      });
    },
  });
};
