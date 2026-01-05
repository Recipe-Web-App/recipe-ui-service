// Meal Plan Management Hooks - Centralized Exports
// This file provides a single entry point for all meal-plan-management related hooks

// Core Meal Plan Operations
export {
  useMealPlans,
  useMealPlanById,
  useCreateMealPlan,
  useUpdateMealPlan,
  useDeleteMealPlan,
  usePrefetchMealPlan,
  useInvalidateMealPlans,
} from './use-meal-plans';

// Favorites
export {
  useFavoriteMealPlans,
  useMealPlanFavoriteStatus,
  useAddMealPlanToFavorites,
  useRemoveMealPlanFromFavorites,
  useToggleMealPlanFavorite,
  useInvalidateFavorites,
} from './use-favorites';

// Tags
export {
  useMealPlanTags,
  useMealPlanTagsById,
  useAddMealPlanTags,
  useReplaceMealPlanTags,
  useRemoveMealPlanTag,
  useInvalidateTags,
} from './use-tags';

// Trending
export {
  useTrendingMealPlans,
  usePrefetchTrendingMealPlans,
  useInvalidateTrending,
} from './use-trending';

// Health Monitoring
export {
  useMealPlanHealth,
  useMealPlanReadiness,
  useMealPlanLiveness,
  useMealPlanVersion,
  useMealPlanStatus,
  useMealPlanHealthMonitor,
  useIsMealPlanServiceOperational,
  useMealPlanHealthComponents,
} from './use-health';

// Metrics
export { useMealPlanMetrics } from './use-metrics';

// System Information
export {
  useMealPlanSwaggerUI,
  useMealPlanOpenAPIJson,
  useMealPlanServiceInfo,
  useMealPlanConfiguration,
} from './use-system';

// Re-import hooks for use in compound hooks
import { useMealPlanById } from './use-meal-plans';
import { useMealPlanHealth } from './use-health';
import { useMealPlanServiceInfo } from './use-system';

/**
 * Hook that combines meal plan details with service health status
 * Useful for dashboard views that need both meal plan data and service status
 */
export const useMealPlanWithServiceStatus = (mealPlanId: string) => {
  const mealPlan = useMealPlanById(mealPlanId);
  const health = useMealPlanHealth();
  const serviceInfo = useMealPlanServiceInfo();

  return {
    mealPlan,
    health,
    serviceInfo,
    isLoading: mealPlan.isLoading || health.isLoading || serviceInfo.isLoading,
    hasError: mealPlan.isError || health.isError || serviceInfo.isError,
    isServiceHealthy: health.data?.status === 'ok',
  };
};

/**
 * Hook that provides a complete service overview
 * Combines health status, service info, and basic operational status
 */
export const useMealPlanServiceOverview = () => {
  const health = useMealPlanHealth();
  const serviceInfo = useMealPlanServiceInfo();

  return {
    health,
    serviceInfo,
    isServiceHealthy: health.data?.status === 'ok',
    isLoading: health.isLoading || serviceInfo.isLoading,
    hasError: health.isError || serviceInfo.isError,
    lastChecked: new Date().toISOString(),
  };
};
