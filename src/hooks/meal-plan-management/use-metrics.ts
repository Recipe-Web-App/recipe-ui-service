import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';

// Safe metrics key to prevent TypeScript unsafe member access warnings
const METRICS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.METRICS as readonly string[];

/**
 * Hook to fetch Prometheus metrics from meal plan management service
 */
export const useMealPlanMetrics = (enabled = true) => {
  return useQuery({
    queryKey: METRICS,
    queryFn: () => metricsApi.getMetrics(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for metrics monitoring
    retry: 2,
  });
};
