import { useQuery, useQueryClient } from '@tanstack/react-query';
import { trendingApi } from '@/lib/api/meal-plan-management';
import { type PaginationParams } from '@/lib/api/meal-plan-management/client';
import { QUERY_KEYS } from '@/constants';

// Safe query keys to prevent TypeScript unsafe member access warnings
const TRENDING = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.TRENDING as readonly string[];

/**
 * Hook to fetch trending meal plans
 * Results are ordered by trending score in descending order
 */
export const useTrendingMealPlans = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [...TRENDING, params],
    queryFn: () => trendingApi.getTrendingMealPlans(params),
    staleTime: 15 * 60 * 1000, // 15 minutes - trending data can be stale
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to prefetch trending meal plans
 * Useful for optimistic loading on navigation
 */
export const usePrefetchTrendingMealPlans = () => {
  const queryClient = useQueryClient();

  return (params?: PaginationParams) => {
    queryClient.prefetchQuery({
      queryKey: [...TRENDING, params],
      queryFn: () => trendingApi.getTrendingMealPlans(params),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };
};

/**
 * Hook to invalidate trending queries
 * Useful for manual cache invalidation
 */
export const useInvalidateTrending = () => {
  const queryClient = useQueryClient();

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey: TRENDING }),
  };
};
