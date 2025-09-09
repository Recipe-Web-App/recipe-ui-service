import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type {
  CreateRecipeRequest,
  UpdateRecipeRequest,
  SearchRecipesResponse,
  RecipeDto,
} from '@/types/recipe-management';
import type { PaginationParams } from '@/lib/api/recipe-management/client';

// Safe query keys to prevent TypeScript unsafe member access warnings
const RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES as readonly string[];
const RECIPE = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE as readonly string[];
const RECIPE_INGREDIENTS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_INGREDIENTS as readonly string[];
const RECIPE_STEPS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_STEPS as readonly string[];
const RECIPE_TAGS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_TAGS as readonly string[];
const RECIPE_REVIEWS = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_REVIEWS as readonly string[];
const RECIPE_MEDIA = QUERY_KEYS.RECIPE_MANAGEMENT
  .RECIPE_MEDIA as readonly string[];

/**
 * Hook to fetch all recipes with optional pagination
 */
export const useRecipes = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...RECIPES, params],
    queryFn: (): Promise<SearchRecipesResponse> => {
      return recipesApi.getAllRecipes(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a specific recipe by ID
 */
export const useRecipe = (recipeId: number) => {
  return useQuery({
    queryKey: [...RECIPE, recipeId],
    queryFn: async (): Promise<RecipeDto> => {
      return await recipesApi.getRecipeById(recipeId);
    },
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch recipe description
 */
export const useRecipeDescription = (recipeId: number) => {
  return useQuery({
    queryKey: [...RECIPE, recipeId, 'description'],
    queryFn: async (): Promise<string> => {
      return await recipesApi.getRecipeDescription(recipeId);
    },
    enabled: !!recipeId,
    staleTime: 10 * 60 * 1000, // 10 minutes (descriptions change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch recipe history
 */
export const useRecipeHistory = (recipeId: number) => {
  return useQuery({
    queryKey: [...RECIPE, recipeId, 'history'],
    queryFn: async () => {
      return await recipesApi.getRecipeHistory(recipeId);
    },
    enabled: !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create a new recipe
 */
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipesApi.createRecipe(data),
    onSuccess: newRecipe => {
      // Add the new recipe to the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            content: [newRecipe, ...oldData.content],
            totalElements: oldData.totalElements + 1,
          };
        }
        return oldData;
      });

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });

      // Set the new recipe in cache
      queryClient.setQueryData([...RECIPE, newRecipe.recipeId], newRecipe);
    },
  });
};

/**
 * Hook to update an existing recipe
 */
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipeId,
      data,
    }: {
      recipeId: number;
      data: UpdateRecipeRequest;
    }) => recipesApi.updateRecipe(recipeId, data),
    onSuccess: (updatedRecipe, variables) => {
      // Update the specific recipe in cache
      queryClient.setQueryData([...RECIPE, variables.recipeId], updatedRecipe);

      // Update the recipe in the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            content: oldData.content.map(recipe =>
              recipe.recipeId === variables.recipeId ? updatedRecipe : recipe
            ),
          };
        }
        return oldData;
      });

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, variables.recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });
    },
  });
};

/**
 * Hook to delete a recipe
 */
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => recipesApi.deleteRecipe(recipeId),
    onSuccess: (_, recipeId) => {
      // Remove the recipe from the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            content: oldData.content.filter(
              recipe => recipe.recipeId !== recipeId
            ),
            totalElements: Math.max(0, oldData.totalElements - 1),
          };
        }
        return oldData;
      });

      // Remove the specific recipe from cache
      queryClient.removeQueries({
        queryKey: [...RECIPE, recipeId],
      });

      // Invalidate recipes list
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });

      // Invalidate all related data (ingredients, steps, tags, etc.)
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_INGREDIENTS, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_STEPS, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_TAGS, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_REVIEWS, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...RECIPE_MEDIA, recipeId],
      });
    },
  });
};
