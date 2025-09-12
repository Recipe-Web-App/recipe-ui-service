import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mealPlansApi,
  type ListMealPlansParams,
  type GetMealPlanByIdParams,
} from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';
import type {
  CreateMealPlanDto,
  UpdateMealPlanDto,
  MealPlanQueryResponse,
  ApiResponse,
  MealPlanResponseDto,
} from '@/types/meal-plan-management';

// Safe query keys to prevent TypeScript unsafe member access warnings
const MEAL_PLANS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .MEAL_PLANS as readonly string[];
const MEAL_PLAN = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .MEAL_PLAN as readonly string[];

/**
 * Hook to fetch meal plans with pagination and filters
 */
export const useMealPlans = (params?: ListMealPlansParams) => {
  return useQuery({
    queryKey: [...MEAL_PLANS, params],
    queryFn: () => mealPlansApi.listMealPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a meal plan by ID with flexible viewing options
 */
export const useMealPlanById = (
  id: string,
  params?: GetMealPlanByIdParams,
  enabled = true
) => {
  return useQuery({
    queryKey: [...MEAL_PLAN, id, params],
    queryFn: () => mealPlansApi.getMealPlanById(id, params),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create a new meal plan
 */
export const useCreateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealPlanDto) => mealPlansApi.createMealPlan(data),
    onSuccess: (response: ApiResponse<MealPlanResponseDto>) => {
      // Invalidate meal plans list
      queryClient.invalidateQueries({ queryKey: MEAL_PLANS });

      // Add the new meal plan to the cache if we have the data
      if (response.data) {
        queryClient.setQueryData([...MEAL_PLAN, response.data.id], {
          success: true,
          viewMode: 'full',
          data: response.data,
        } as MealPlanQueryResponse);
      }
    },
  });
};

/**
 * Hook to update an existing meal plan
 */
export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMealPlanDto }) =>
      mealPlansApi.updateMealPlan(id, data),
    onSuccess: (response: ApiResponse<MealPlanResponseDto>, variables) => {
      // Invalidate meal plans list
      queryClient.invalidateQueries({ queryKey: MEAL_PLANS });

      // Invalidate the specific meal plan
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLAN, variables.id],
      });

      // Update the cached meal plan if we have the data
      if (response.data) {
        queryClient.setQueryData([...MEAL_PLAN, variables.id], {
          success: true,
          viewMode: 'full',
          data: response.data,
        } as MealPlanQueryResponse);
      }
    },
  });
};

/**
 * Hook to delete a meal plan
 */
export const useDeleteMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mealPlansApi.deleteMealPlan(id),
    onSuccess: (_, deletedId) => {
      // Invalidate meal plans list
      queryClient.invalidateQueries({ queryKey: MEAL_PLANS });

      // Remove the deleted meal plan from cache
      queryClient.removeQueries({
        queryKey: [...MEAL_PLAN, deletedId],
      });
    },
  });
};

/**
 * Hook to prefetch a meal plan
 * Useful for optimistic loading when hovering over meal plan cards
 */
export const usePrefetchMealPlan = () => {
  const queryClient = useQueryClient();

  return (id: string, params?: GetMealPlanByIdParams) => {
    queryClient.prefetchQuery({
      queryKey: [...MEAL_PLAN, id, params],
      queryFn: () => mealPlansApi.getMealPlanById(id, params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

/**
 * Hook to invalidate meal plan queries
 * Useful for manual cache invalidation
 */
export const useInvalidateMealPlans = () => {
  const queryClient = useQueryClient();

  return {
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: MEAL_PLANS }),
    invalidateById: (id: string) =>
      queryClient.invalidateQueries({ queryKey: [...MEAL_PLAN, id] }),
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: [...MEAL_PLANS[0], MEAL_PLANS[1]],
      }),
  };
};
