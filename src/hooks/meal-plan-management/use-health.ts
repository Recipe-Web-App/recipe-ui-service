import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/meal-plan-management';
import { QUERY_KEYS } from '@/constants';
import type { HealthCheckResult } from '@/types/meal-plan-management';

// Safe health key to prevent TypeScript unsafe member access warnings
const HEALTH = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.HEALTH as readonly string[];
const READINESS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT
  .READINESS as readonly string[];
const LIVENESS = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.LIVENESS as readonly string[];
const VERSION = QUERY_KEYS.MEAL_PLAN_MANAGEMENT.VERSION as readonly string[];

/**
 * Hook to fetch meal plan management service health status
 */
export const useMealPlanHealth = (enabled = true) => {
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
 * Hook to fetch meal plan management service readiness status
 */
export const useMealPlanReadiness = (enabled = true) => {
  return useQuery({
    queryKey: READINESS,
    queryFn: () => healthApi.getReadiness(),
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch meal plan management service liveness status
 */
export const useMealPlanLiveness = (enabled = true) => {
  return useQuery({
    queryKey: LIVENESS,
    queryFn: () => healthApi.getLiveness(),
    enabled,
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: 2,
  });
};

/**
 * Hook to fetch meal plan management service version information
 */
export const useMealPlanVersion = (enabled = true) => {
  return useQuery({
    queryKey: VERSION,
    queryFn: () => healthApi.getVersion(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false, // Version doesn't change often
    retry: 2,
  });
};

/**
 * Hook to monitor overall service status
 * Combines health, readiness, and liveness checks
 */
export const useMealPlanStatus = (enabled = true) => {
  const healthQuery = useMealPlanHealth(enabled);
  const readinessQuery = useMealPlanReadiness(enabled);
  const livenessQuery = useMealPlanLiveness(enabled);

  const healthData = healthQuery.data as HealthCheckResult | undefined;
  const readinessData = readinessQuery.data as HealthCheckResult | undefined;
  const livenessData = livenessQuery.data as HealthCheckResult | undefined;

  const isHealthy = healthData?.status === 'ok';
  const isReady = readinessData?.status === 'ok';
  const isLive = livenessData?.status === 'ok';

  const overallStatus = isHealthy && isReady && isLive ? 'ok' : 'error';
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
      info: healthData?.info,
      error: healthData?.error,
      details: healthData?.details,
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
export const useMealPlanHealthMonitor = (
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
  const healthData = healthQuery.data as HealthCheckResult | undefined;
  const isHealthy = healthData?.status === 'ok';

  return {
    ...healthQuery,
    isHealthy,
    status: healthData?.status ?? 'unknown',
    info: healthData?.info ?? {},
    error: healthData?.error ?? {},
    details: healthData?.details ?? {},
    lastChecked: healthQuery.dataUpdatedAt,
  };
};

/**
 * Hook to check if the service is operational
 * Simple boolean check for service availability
 */
export const useIsMealPlanServiceOperational = () => {
  const { overallStatus, isLoading } = useMealPlanStatus();

  return {
    isOperational: overallStatus === 'ok',
    isChecking: isLoading,
    status: overallStatus,
  };
};

/**
 * Hook to get health component details
 * Useful for detailed health dashboard views
 */
export const useMealPlanHealthComponents = () => {
  const healthQuery = useMealPlanHealth();

  const healthData = healthQuery.data as HealthCheckResult | undefined;
  const details = healthData?.details ?? {};
  const componentStatuses = Object.entries(details).map(([name, details]) => ({
    name,
    status:
      typeof details === 'object' && details && 'status' in details
        ? details.status
        : 'unknown',
    details,
  }));

  return {
    ...healthQuery,
    components: componentStatuses,
    healthyComponents: componentStatuses.filter(c => c.status === 'up'),
    unhealthyComponents: componentStatuses.filter(c => c.status !== 'up'),
    totalComponents: componentStatuses.length,
  };
};
