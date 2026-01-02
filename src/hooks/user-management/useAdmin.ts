import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, healthApi, metricsApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import type { CacheClearRequest } from '@/types/user-management';

/**
 * Hook to get user statistics (admin only)
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USERS, 'stats'],
    queryFn: () => adminApi.getUserStats(),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to clear cache (admin only)
 * Updated: Moved from metrics to admin per OpenAPI spec
 * Endpoint: POST /admin/cache/clear
 */
export const useClearCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request?: CacheClearRequest) => adminApi.clearCache(request),
    onSuccess: () => {
      // Invalidate metrics queries since cache was cleared
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.METRICS,
      });
    },
  });
};

// Health and Metrics Hooks for Admin

/**
 * Hook to get basic health/liveness check
 */
export const useHealthCheck = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_MANAGEMENT.HEALTH,
    queryFn: () => healthApi.getHealthCheck(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to get readiness check
 * New: Added per OpenAPI spec for Kubernetes readiness probes
 * Returns degraded status when database is down but Redis is healthy
 * Returns 503 when Redis is unavailable
 */
export const useReadinessCheck = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.HEALTH, 'ready'],
    queryFn: () => healthApi.getReadinessCheck(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to get comprehensive health status
 */
export const useComprehensiveHealth = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.HEALTH, 'comprehensive'],
    queryFn: () => healthApi.getComprehensiveHealth(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

/**
 * Hook to get performance metrics
 */
export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.METRICS, 'performance'],
    queryFn: () => metricsApi.getPerformanceMetrics(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to monitor health with retries
 */
export const useHealthMonitor = (retries?: number, retryDelay?: number) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.HEALTH,
      'monitor',
      { retries, retryDelay },
    ],
    queryFn: () => healthApi.monitorHealth({ retries, retryDelay }),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Monitor every 30 seconds
    retry: false, // Let the API handle retries
  });
};

/**
 * Hook to get health summary (combines multiple health checks)
 */
export const useHealthSummary = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.HEALTH, 'summary'],
    queryFn: () => healthApi.getHealthSummary(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};
