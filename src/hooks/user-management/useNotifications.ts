import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import type { NotificationCountResponse } from '@/types/user-management';

// Define local interface for notification filters
interface NotificationFilters {
  is_read?: boolean;
  notification_type?: string;
  limit?: number;
  offset?: number;
  count_only?: boolean;
  [key: string]: unknown; // Index signature to match PaginationParams
}

/**
 * Hook to get notifications with optional filters
 */
export const useNotifications = (params?: NotificationFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS, params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: params?.is_read === false ? 30 * 1000 : undefined, // Refetch unread notifications every 30 seconds
  });
};

/**
 * Hook to get all notifications
 */
export const useAllNotifications = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS, 'all'],
    queryFn: () => notificationsApi.getAllNotifications(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get unread notifications
 */
export const useUnreadNotifications = (params?: NotificationFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS, 'unread', params],
    queryFn: () => notificationsApi.getUnreadNotifications(params),
    staleTime: 20 * 1000, // 20 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to get read notifications
 */
export const useReadNotifications = (params?: NotificationFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS, 'read', params],
    queryFn: () => notificationsApi.getReadNotifications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get notifications by type
 */
export const useNotificationsByType = (
  notificationType: string,
  params?: NotificationFilters
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      'type',
      notificationType,
      params,
    ],
    queryFn: () =>
      notificationsApi.getNotificationsByType(notificationType, params),
    enabled: !!notificationType,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
    queryFn: () => notificationsApi.getUnreadNotificationCount(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to check if there are new notifications
 */
export const useHasNewNotifications = (lastCheckTime?: string) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      'hasNew',
      lastCheckTime,
    ],
    queryFn: () => notificationsApi.hasNewNotifications(lastCheckTime),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Check every 30 seconds
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markNotificationAsRead(notificationId),
    onMutate: async notificationId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });

      // Optimistically update the unread count
      const previousCount = queryClient.getQueryData<NotificationCountResponse>(
        QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT
      );

      if (previousCount) {
        queryClient.setQueryData<NotificationCountResponse>(
          QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
          { totalCount: Math.max(0, previousCount.totalCount - 1) }
        );
      }

      return { notificationId, previousCount };
    },
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
      });
    },
    onError: (_, __, context) => {
      // Rollback optimistic update on error
      if (context?.previousCount) {
        queryClient.setQueryData(
          QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
          context.previousCount
        );
      }
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });

      // Optimistically set unread count to 0
      const previousCount = queryClient.getQueryData<NotificationCountResponse>(
        QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT
      );

      queryClient.setQueryData<NotificationCountResponse>(
        QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
        { totalCount: 0 }
      );

      return { previousCount };
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
      });
    },
    onError: (_, __, context) => {
      // Rollback optimistic update on error
      if (context?.previousCount) {
        queryClient.setQueryData(
          QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
          context.previousCount
        );
      }
    },
  });
};

/**
 * Hook to delete a single notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
      });
    },
  });
};

/**
 * Hook to delete multiple notifications
 */
export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      notificationsApi.deleteNotifications(notificationIds),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.UNREAD_COUNT,
      });
    },
  });
};

/**
 * Hook to clear all read notifications
 */
export const useClearReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.clearReadNotifications(),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.NOTIFICATIONS,
      });
    },
  });
};
