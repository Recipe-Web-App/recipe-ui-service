import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi, type ListTagsParams } from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';
import type { AddMealPlanTagsDto } from '@/types/meal-plan-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const TAGS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.TAGS as readonly string[];
const MEAL_PLAN_TAGS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .MEAL_PLAN_TAGS as readonly string[];
const MEAL_PLAN = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .MEAL_PLAN as readonly string[];

/**
 * Hook to fetch all available meal plan tags
 */
export const useMealPlanTags = (params?: ListTagsParams) => {
  return useQuery({
    queryKey: [...TAGS, params],
    queryFn: () => tagsApi.listMealPlanTags(params),
    staleTime: 30 * 60 * 1000, // 30 minutes - tags are relatively static
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * Hook to fetch tags for a specific meal plan
 */
export const useMealPlanTagsById = (mealPlanId: string, enabled = true) => {
  return useQuery({
    queryKey: [...MEAL_PLAN_TAGS, mealPlanId],
    queryFn: () => tagsApi.getMealPlanTags(mealPlanId),
    enabled: enabled && !!mealPlanId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to add tags to a meal plan (additive - existing tags are kept)
 */
export const useAddMealPlanTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mealPlanId,
      data,
    }: {
      mealPlanId: string;
      data: AddMealPlanTagsDto;
    }) => tagsApi.addMealPlanTags(mealPlanId, data),
    onSuccess: (response, { mealPlanId }) => {
      // Update the meal plan tags cache
      queryClient.setQueryData([...MEAL_PLAN_TAGS, mealPlanId], response);

      // Invalidate the meal plan itself since it includes tags
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN, mealPlanId],
      });

      // Invalidate the tags list in case new tags were created
      queryClient.invalidateQueries({ queryKey: TAGS });
    },
  });
};

/**
 * Hook to replace all tags on a meal plan
 */
export const useReplaceMealPlanTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mealPlanId,
      data,
    }: {
      mealPlanId: string;
      data: AddMealPlanTagsDto;
    }) => tagsApi.replaceMealPlanTags(mealPlanId, data),
    onSuccess: (response, { mealPlanId }) => {
      // Update the meal plan tags cache
      queryClient.setQueryData([...MEAL_PLAN_TAGS, mealPlanId], response);

      // Invalidate the meal plan itself since it includes tags
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN, mealPlanId],
      });

      // Invalidate the tags list in case new tags were created
      queryClient.invalidateQueries({ queryKey: TAGS });
    },
  });
};

/**
 * Hook to remove a specific tag from a meal plan
 */
export const useRemoveMealPlanTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mealPlanId,
      tagId,
    }: {
      mealPlanId: string;
      tagId: string;
    }) => tagsApi.removeMealPlanTag(mealPlanId, tagId),
    onSuccess: (_, { mealPlanId }) => {
      // Invalidate the meal plan tags cache
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN_TAGS, mealPlanId],
      });

      // Invalidate the meal plan itself since it includes tags
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN, mealPlanId],
      });
    },
  });
};

/**
 * Hook to invalidate tag queries
 * Useful for manual cache invalidation
 */
export const useInvalidateTags = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAllTags: () => queryClient.invalidateQueries({ queryKey: TAGS }),
    invalidateMealPlanTags: (mealPlanId: string) =>
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN_TAGS, mealPlanId],
      }),
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: TAGS });
      queryClient.invalidateQueries({ queryKey: MEAL_PLAN_TAGS });
    },
  };
};
