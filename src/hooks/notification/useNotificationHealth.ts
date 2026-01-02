import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/lib/api/notification';
import { QUERY_KEYS } from '@/constants';
import type { HealthResponse, LivenessResponse } from '@/types/notification';

/**
 * Notification Health Hooks
 *
 * React hooks for checking notification service health.
 * Used for monitoring and status displays.
 */

/**
 * Hook to check notification service readiness
 *
 * Returns detailed health status including all dependency checks.
 */
export const useNotificationReadiness = () => {
  return useQuery<HealthResponse>({
    queryKey: QUERY_KEYS.NOTIFICATION.READINESS,
    queryFn: () => healthApi.checkReadiness(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 1, // Only retry once for health checks
  });
};

/**
 * Hook to check notification service liveness
 *
 * Returns simple liveness status (no dependency checks).
 */
export const useNotificationLiveness = () => {
  return useQuery<LivenessResponse>({
    queryKey: QUERY_KEYS.NOTIFICATION.LIVENESS,
    queryFn: () => healthApi.checkLiveness(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 1, // Only retry once for health checks
  });
};
