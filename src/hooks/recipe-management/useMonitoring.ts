import { useQuery } from '@tanstack/react-query';
import { monitoringApi } from '@/lib/api/recipe-management';
import { QUERY_KEYS } from '@/constants';
import type { RecipeManagementMetricResponse } from '@/types/recipe-management';

// Safe monitoring key to prevent TypeScript unsafe member access warnings
const MONITORING = QUERY_KEYS.RECIPE_MANAGEMENT.MONITORING as readonly string[];

/**
 * Hook to fetch application information
 */
export const useRecipeManagementInfo = (enabled = true) => {
  return useQuery({
    queryKey: [...MONITORING, 'info'],
    queryFn: () => monitoringApi.getInfo(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes (app info changes infrequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch available metrics
 */
export const useRecipeManagementMetrics = (enabled = true) => {
  return useQuery({
    queryKey: [...MONITORING, 'metrics'],
    queryFn: () => monitoringApi.getMetrics(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to fetch a specific metric value
 */
export const useRecipeManagementMetric = (
  metricName: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...MONITORING, 'metric', metricName],
    queryFn: () => monitoringApi.getMetric(metricName),
    enabled: enabled && !!metricName,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time monitoring
  });
};

/**
 * Hook to fetch Prometheus metrics
 */
export const usePrometheusMetrics = (enabled = true) => {
  return useQuery({
    queryKey: [...MONITORING, 'prometheus'],
    queryFn: () => monitoringApi.getPrometheusMetrics(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to fetch environment properties
 */
export const useRecipeManagementEnvironment = (enabled = true) => {
  return useQuery({
    queryKey: [...MONITORING, 'environment'],
    queryFn: () => monitoringApi.getEnvironment(),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes (environment rarely changes)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to fetch a specific environment property
 */
export const useRecipeManagementEnvironmentProperty = (
  propertyName: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...MONITORING, 'environment', 'property', propertyName],
    queryFn: () => monitoringApi.getEnvironmentProperty(propertyName),
    enabled: enabled && !!propertyName,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to fetch configuration properties
 */
export const useRecipeManagementConfigProperties = (enabled = true) => {
  return useQuery({
    queryKey: [...MONITORING, 'configprops'],
    queryFn: () => monitoringApi.getConfigurationProperties(),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook for comprehensive monitoring dashboard data
 * Fetches multiple monitoring endpoints in parallel
 */
export const useRecipeManagementDashboard = (enabled = true) => {
  const infoQuery = useRecipeManagementInfo(enabled);
  const metricsQuery = useRecipeManagementMetrics(enabled);
  const environmentQuery = useRecipeManagementEnvironment(enabled);

  const isLoading =
    infoQuery.isLoading ?? metricsQuery.isLoading ?? environmentQuery.isLoading;
  const hasError =
    infoQuery.isError ?? metricsQuery.isError ?? environmentQuery.isError;
  const error = infoQuery.error ?? metricsQuery.error ?? environmentQuery.error;

  return {
    info: infoQuery.data,
    metrics: metricsQuery.data,
    environment: environmentQuery.data,
    isLoading,
    hasError,
    error,
    queries: {
      info: infoQuery,
      metrics: metricsQuery,
      environment: environmentQuery,
    },
  };
};

// Define proper interfaces for metric data
interface MetricData {
  data: RecipeManagementMetricResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number;
}

interface MetricsMap {
  [metricName: string]: MetricData;
}

/**
 * Hook to monitor specific metrics with custom intervals
 * Useful for real-time metric monitoring
 *
 * Note: This hook uses a different pattern to avoid violating rules of hooks
 */
export const useMetricMonitor = (
  metricNames: string[],
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
  } = {}
) => {
  const {
    enabled = true,
    refetchInterval = 30 * 1000, // 30 seconds default
    staleTime = 15 * 1000, // 15 seconds default
  } = options;

  // Use a single query that fetches all metrics in sequence
  const metricsQuery = useQuery({
    queryKey: [
      ...MONITORING,
      'metrics',
      'monitor',
      metricNames.toSorted((a, b) => a.localeCompare(b)), // Sort to ensure consistent cache key
    ],
    queryFn: async () => {
      const results: MetricsMap = {};

      // Fetch all metrics in parallel with safe handling
      const promises = metricNames.map(async (metricName, index) => {
        try {
          const data = await monitoringApi.getMetric(metricName);
          return { index, data, error: null };
        } catch (error) {
          return { index, data: undefined, error: error as Error };
        }
      });

      const responses = await Promise.allSettled(promises);

      // Process results safely without object injection
      for (let i = 0; i < responses.length; i++) {
        const response = responses.at(i);
        const metricName = metricNames.at(i);

        // Skip if either is undefined
        if (!response || !metricName) continue;

        // Validate metricName to prevent injection and ensure it's safe
        if (
          typeof metricName === 'string' &&
          metricName.length > 0 &&
          /^[a-zA-Z0-9._-]+$/.test(metricName)
        ) {
          const metricData: MetricData =
            response.status === 'fulfilled'
              ? {
                  data: response.value.data,
                  error: response.value.error,
                  isLoading: false,
                  lastUpdated: Date.now(),
                }
              : {
                  data: undefined,
                  error: response.reason as Error,
                  isLoading: false,
                  lastUpdated: Date.now(),
                };

          // Use Object.defineProperty for secure property assignment
          Object.defineProperty(results, metricName, {
            value: metricData,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }
      }

      return results;
    },
    enabled: enabled && metricNames.length > 0,
    staleTime,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval,
  });

  const metrics = metricsQuery.data ?? {};
  const isLoading = metricsQuery.isLoading;
  const hasError =
    metricsQuery.isError || Object.values(metrics).some(metric => metric.error);

  return {
    metrics,
    isLoading,
    hasError,
    metricNames,
    refreshAll: () => {
      metricsQuery.refetch();
    },
  };
};

/**
 * Hook for performance metrics monitoring
 * Focuses on key performance indicators
 */
export const usePerformanceMetrics = (enabled = true) => {
  const commonMetrics = [
    'jvm.memory.used',
    'jvm.memory.max',
    'system.cpu.usage',
    'http.server.requests',
    'jvm.gc.pause',
  ];

  const { metrics, isLoading, hasError } = useMetricMonitor(commonMetrics, {
    enabled,
    refetchInterval: 15 * 1000, // 15 seconds for performance metrics
  });

  // Extract specific performance data safely
  const memoryUsage = metrics['jvm.memory.used']?.data;
  const memoryMax = metrics['jvm.memory.max']?.data;
  const cpuUsage = metrics['system.cpu.usage']?.data;
  const requestMetrics = metrics['http.server.requests']?.data;
  const gcMetrics = metrics['jvm.gc.pause']?.data;

  return {
    memoryUsage,
    memoryMax,
    cpuUsage,
    requestMetrics,
    gcMetrics,
    isLoading,
    hasError,
    metrics,
  };
};

/**
 * Hook to get system information summary
 * Combines info and environment data for system overview
 */
export const useSystemInformation = () => {
  const infoQuery = useRecipeManagementInfo();
  const environmentQuery = useRecipeManagementEnvironment();

  const systemInfo = {
    application: infoQuery.data?.app,
    build: infoQuery.data?.build,
    java: infoQuery.data?.java,
    operatingSystem: infoQuery.data?.os,
    activeProfiles: environmentQuery.data?.activeProfiles,
    isLoading: infoQuery.isLoading || environmentQuery.isLoading,
    hasError: infoQuery.isError || environmentQuery.isError,
  };

  return systemInfo;
};
