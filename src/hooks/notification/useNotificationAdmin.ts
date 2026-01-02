import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, managementApi } from '@/lib/api/notification';
import { QUERY_KEYS } from '@/constants';
import type {
  NotificationStats,
  NotificationStatsParams,
  RetryFailedResponse,
  RetryStatusResponse,
  RetryNotificationResponse,
  TemplateListResponse,
} from '@/types/notification';

/**
 * Notification Admin Hooks
 *
 * React hooks for administrative notification operations.
 * Requires notification:admin scope.
 */

/**
 * Hook to get notification statistics
 *
 * @param params - Optional date range filters
 */
export const useNotificationStats = (params?: NotificationStatsParams) => {
  return useQuery<NotificationStats>({
    queryKey: [...QUERY_KEYS.NOTIFICATION.STATS, params],
    queryFn: () => adminApi.getStats(params),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get retry status for failed notifications
 */
export const useRetryStatus = () => {
  return useQuery<RetryStatusResponse>({
    queryKey: QUERY_KEYS.NOTIFICATION.RETRY_STATUS,
    queryFn: () => adminApi.getRetryStatus(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get available notification templates
 */
export const useNotificationTemplates = () => {
  return useQuery<TemplateListResponse>({
    queryKey: QUERY_KEYS.NOTIFICATION.TEMPLATES,
    queryFn: () => adminApi.getTemplates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to retry all failed notifications
 */
export const useRetryFailedNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<RetryFailedResponse, Error, number | undefined>({
    mutationFn: maxFailures => adminApi.retryFailedNotifications(maxFailures),
    onSuccess: () => {
      // Invalidate retry status and stats after retry operation
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.RETRY_STATUS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.STATS,
      });
    },
  });
};

/**
 * Hook to retry a specific failed notification
 */
export const useRetryNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<RetryNotificationResponse, Error, string>({
    mutationFn: notificationId =>
      managementApi.retryNotification(notificationId),
    onSuccess: (_, notificationId) => {
      // Invalidate the specific notification query
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.NOTIFICATION.NOTIFICATION, notificationId],
      });
      // Also invalidate retry status
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.RETRY_STATUS,
      });
    },
  });
};

/**
 * Hook to delete a notification (admin)
 */
export const useAdminDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: notificationId =>
      managementApi.deleteNotification(notificationId),
    onSuccess: (_, notificationId) => {
      // Remove the notification from cache
      queryClient.removeQueries({
        queryKey: [...QUERY_KEYS.NOTIFICATION.NOTIFICATION, notificationId],
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.STATS,
      });
    },
  });
};
