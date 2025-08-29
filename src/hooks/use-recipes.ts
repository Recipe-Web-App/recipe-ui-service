import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  recipesApi,
  GetRecipesParams,
  CreateRecipeData,
} from '@/lib/api/recipes';
import { QUERY_KEYS } from '@/constants';

export const useRecipes = (params: GetRecipesParams = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPES, params],
    queryFn: () => recipesApi.getRecipes(params),
  });
};

export const useRecipeById = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECIPE_DETAIL, id],
    queryFn: () => recipesApi.getRecipeById(id),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeData) => recipesApi.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPES });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateRecipeData>;
    }) => recipesApi.updateRecipe(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPES });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.RECIPE_DETAIL, variables.id],
      });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipesApi.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECIPES });
    },
  });
};
