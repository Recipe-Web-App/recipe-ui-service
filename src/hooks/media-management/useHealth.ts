/**
 * Health and monitoring hooks for media management service
 * Handles health checks, readiness probes, and metrics endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/media-management';
import { QUERY_KEYS } from '@/constants';

/**
 * Hook to get media management service health status
 * Maps to GET /health endpoint
 */
export const useMediaManagementHealth = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.HEALTH,
    queryFn: () => healthApi.getHealth(),
    enabled,
    staleTime: 30000, // Consider fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

/**
 * Hook to get media management service readiness status
 * Maps to GET /ready endpoint
 */
export const useMediaManagementReadiness = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.READINESS,
    queryFn: () => healthApi.getReadiness(),
    enabled,
    staleTime: 30000, // Consider fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

/**
 * Hook to get media management service Prometheus metrics
 * Maps to GET /metrics endpoint
 */
export const useMediaManagementMetrics = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA_MANAGEMENT.METRICS,
    queryFn: () => healthApi.getMetrics(),
    enabled,
    staleTime: 10000, // Consider fresh for 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Combined hook for media management service monitoring
 * Provides health, readiness, and metrics in one hook
 */
export const useMediaManagementMonitoring = (enabled = true) => {
  const healthQuery = useMediaManagementHealth(enabled);
  const readinessQuery = useMediaManagementReadiness(enabled);
  const metricsQuery = useMediaManagementMetrics(enabled);

  return {
    health: healthQuery,
    readiness: readinessQuery,
    metrics: metricsQuery,

    // Convenience getters
    isHealthy: healthQuery.data?.status === 'healthy',
    isReady: readinessQuery.data?.status === 'ready',
    hasMetrics: metricsQuery.data !== undefined,

    // Overall status
    isLoading:
      healthQuery.isLoading ||
      readinessQuery.isLoading ||
      metricsQuery.isLoading,
    isError:
      healthQuery.isError || readinessQuery.isError || metricsQuery.isError,
    error: healthQuery.error ?? readinessQuery.error ?? metricsQuery.error,
  };
};

/**
 * Utility hook for service health monitoring
 * Provides helpers for health status management
 */
export const useMediaManagementHealthManager = () => {
  return {
    // Helper to generate query key for health
    getHealthQueryKey: () => QUERY_KEYS.MEDIA_MANAGEMENT.HEALTH,

    // Helper to generate query key for readiness
    getReadinessQueryKey: () => QUERY_KEYS.MEDIA_MANAGEMENT.READINESS,

    // Helper to generate query key for metrics
    getMetricsQueryKey: () => QUERY_KEYS.MEDIA_MANAGEMENT.METRICS,

    // Helper to determine if service is operational
    isServiceOperational: (healthStatus?: string, readinessStatus?: string) => {
      return healthStatus === 'healthy' && readinessStatus === 'ready';
    },

    // Helper to determine if service is degraded but functional
    isServiceDegraded: (healthStatus?: string, readinessStatus?: string) => {
      return (
        healthStatus === 'degraded' ||
        (healthStatus === 'healthy' && readinessStatus !== 'ready')
      );
    },

    // Helper to parse Prometheus metrics (basic parsing)
    parseMetrics: (metricsText: string) => {
      if (!metricsText) return new Map<string, string>();

      const lines = metricsText.split('\n');
      const metrics = new Map<string, string>();

      lines.forEach(line => {
        if (!line.startsWith('#') && line.includes(' ')) {
          const [name, value] = line.split(' ', 2);
          if (name && value) {
            metrics.set(name, value);
          }
        }
      });

      return metrics;
    },
  };
};
