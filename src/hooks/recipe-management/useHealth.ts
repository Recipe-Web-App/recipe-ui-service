import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type { RecipeManagementHealthResponse } from '@/types/recipe-management';

// Safe health key to prevent TypeScript unsafe member access warnings
const HEALTH = QUERY_KEYS.RECIPE_MANAGEMENT.HEALTH as readonly string[];

/**
 * Hook to fetch recipe management service health status
 */
export const useRecipeManagementHealth = (enabled = true) => {
  return useQuery({
    queryKey: HEALTH,
    queryFn: () => healthApi.getHealth(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for health monitoring
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook to fetch recipe management service readiness status
 */
export const useRecipeManagementReadiness = (enabled = true) => {
  return useQuery({
    queryKey: [...HEALTH, 'readiness'],
    queryFn: () => healthApi.getReadiness(),
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch recipe management service liveness status
 */
export const useRecipeManagementLiveness = (enabled = true) => {
  return useQuery({
    queryKey: [...HEALTH, 'liveness'],
    queryFn: () => healthApi.getLiveness(),
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

/**
 * Hook to monitor overall service status
 * Combines health, readiness, and liveness checks
 */
export const useRecipeManagementStatus = (enabled = true) => {
  const healthQuery = useRecipeManagementHealth(enabled);
  const readinessQuery = useRecipeManagementReadiness(enabled);
  const livenessQuery = useRecipeManagementLiveness(enabled);

  const healthData = healthQuery.data as
    | RecipeManagementHealthResponse
    | undefined;
  const readinessData = readinessQuery.data as
    | RecipeManagementHealthResponse
    | undefined;
  const livenessData = livenessQuery.data as
    | RecipeManagementHealthResponse
    | undefined;

  const isHealthy = healthData?.status === 'UP';
  const isReady = readinessData?.status === 'UP';
  const isLive = livenessData?.status === 'UP';

  const overallStatus = isHealthy && isReady && isLive ? 'UP' : 'DOWN';
  const isLoading =
    healthQuery.isLoading ||
    readinessQuery.isLoading ||
    livenessQuery.isLoading;
  const hasError =
    healthQuery.isError || readinessQuery.isError || livenessQuery.isError;

  return {
    overallStatus,
    isHealthy,
    isReady,
    isLive,
    isLoading,
    hasError,
    health: {
      ...healthQuery,
      status: healthData?.status,
      components: healthData?.components,
    },
    readiness: {
      ...readinessQuery,
      status: readinessData?.status,
    },
    liveness: {
      ...livenessQuery,
      status: livenessData?.status,
    },
    lastChecked: new Date().toISOString(),
  };
};

/**
 * Hook for health monitoring with custom intervals
 * Useful for dashboards or monitoring components
 */
export const useRecipeManagementHealthMonitor = (
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
    onHealthChange?: (isHealthy: boolean) => void;
  } = {}
) => {
  const {
    enabled = true,
    refetchInterval = 60 * 1000, // 1 minute default
    staleTime = 30 * 1000, // 30 seconds default
  } = options;

  const healthQuery = useQuery({
    queryKey: [...HEALTH, 'monitor'],
    queryFn: () => healthApi.getHealth(),
    enabled,
    staleTime,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
    retry: 3,
    retryDelay: 1000,
  });

  // Track health status changes with proper typing
  const healthData = healthQuery.data as
    | RecipeManagementHealthResponse
    | undefined;
  const isHealthy = healthData?.status === 'UP';

  // You could add useEffect here to call onHealthChange when status changes
  // but that would require useState to track previous status

  return {
    ...healthQuery,
    isHealthy,
    status: healthData?.status ?? 'UNKNOWN',
    components: healthData?.components ?? {},
    groups: healthData?.groups ?? {},
    lastChecked: healthQuery.dataUpdatedAt,
  };
};

/**
 * Hook to check if the service is operational
 * Simple boolean check for service availability
 */
export const useIsServiceOperational = () => {
  const { overallStatus, isLoading } = useRecipeManagementStatus();

  return {
    isOperational: overallStatus === 'UP',
    isChecking: isLoading,
    status: overallStatus,
  };
};

/**
 * Hook to get health component details
 * Useful for detailed health dashboard views
 */
export const useHealthComponents = () => {
  const healthQuery = useRecipeManagementHealth();

  const healthData = healthQuery.data as
    | RecipeManagementHealthResponse
    | undefined;
  const components = healthData?.components ?? {};
  const componentStatuses = Object.entries(components).map(
    ([name, details]) => ({
      name,
      status: details.status,
      details: details.details,
    })
  );

  return {
    ...healthQuery,
    components: componentStatuses,
    healthyComponents: componentStatuses.filter(c => c.status === 'UP'),
    unhealthyComponents: componentStatuses.filter(c => c.status !== 'UP'),
    totalComponents: componentStatuses.length,
  };
};
