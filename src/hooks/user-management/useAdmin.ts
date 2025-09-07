import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, healthApi, metricsApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';

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
 * Hook to force logout a user (admin only)
 */
export const useForceLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminApi.forceUserLogout(userId),
    onSuccess: () => {
      // Invalidate user stats
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USERS, 'stats'],
      });
    },
  });
};

/**
 * Hook to batch force logout multiple users (admin only)
 */
export const useBatchForceLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => adminApi.batchForceLogout(userIds),
    onSuccess: () => {
      // Invalidate user stats
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.USERS, 'stats'],
      });
    },
  });
};

// Health and Metrics Hooks for Admin

/**
 * Hook to get basic health check
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
