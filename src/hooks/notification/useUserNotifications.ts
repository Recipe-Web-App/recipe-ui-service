import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userNotificationsApi } from '@/lib/api/notification';
import { QUERY_KEYS } from '@/constants';
import type {
  UserNotificationListResponse,
  UserNotificationCountResponse,
  UserNotificationParams,
} from '@/types/notification';

/**
 * User Notifications Hooks
 *
 * React hooks for managing user notifications (inbox, read/unread, delete).
 * Migrated from user-management service to notification service.
 */

/**
 * Hook to get current user's notifications
 *
 * @param params - Optional pagination and filter parameters
 * @returns Query result with notifications list or count
 */
export const useMyNotifications = (params?: UserNotificationParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS, params],
    queryFn: () => userNotificationsApi.getMyNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to get all notifications (read and unread)
 */
export const useAllNotifications = (
  params?: Omit<UserNotificationParams, 'countOnly'>
) => {
  return useQuery<UserNotificationListResponse>({
    queryKey: [...QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS, 'all', params],
    queryFn: () => userNotificationsApi.getAllNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get unread notifications
 */
export const useUnreadNotifications = (
  params?: Omit<UserNotificationParams, 'countOnly'>
) => {
  return useQuery<UserNotificationListResponse>({
    queryKey: [...QUERY_KEYS.NOTIFICATION.UNREAD_NOTIFICATIONS, params],
    queryFn: () => userNotificationsApi.getUnreadNotifications(params),
    staleTime: 20 * 1000, // 20 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to get unread notification count (for badge display)
 */
export const useUnreadNotificationCount = () => {
  return useQuery<UserNotificationCountResponse>({
    queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
    queryFn: () => userNotificationsApi.getUnreadNotificationCount(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

/**
 * Hook to check if there are new notifications since last check
 */
export const useHasNewNotifications = (lastCheckTime?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATION.HAS_NEW, lastCheckTime],
    queryFn: () => userNotificationsApi.hasNewNotifications(lastCheckTime),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Check every 30 seconds
  });
};

/**
 * Hook to get notifications for a specific user (admin only)
 */
export const useUserNotifications = (
  userId: string | undefined,
  params?: UserNotificationParams
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.NOTIFICATION.USER_NOTIFICATIONS, userId, params],
    queryFn: () => userNotificationsApi.getUserNotifications(userId!, params),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to mark a notification as read
 *
 * Includes optimistic update to decrement unread count immediately.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      userNotificationsApi.markNotificationAsRead(notificationId),
    onMutate: async notificationId => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });

      // Optimistically update the unread count
      const previousCount =
        queryClient.getQueryData<UserNotificationCountResponse>(
          QUERY_KEYS.NOTIFICATION.UNREAD_COUNT
        );

      if (previousCount) {
        queryClient.setQueryData<UserNotificationCountResponse>(
          QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
          { totalCount: Math.max(0, previousCount.totalCount - 1) }
        );
      }

      return { notificationId, previousCount };
    },
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
      });
    },
    onError: (_, __, context) => {
      // Rollback optimistic update on error
      if (context?.previousCount) {
        queryClient.setQueryData(
          QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
          context.previousCount
        );
      }
    },
  });
};

/**
 * Hook to mark all notifications as read
 *
 * Includes optimistic update to set unread count to zero immediately.
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userNotificationsApi.markAllNotificationsAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });

      // Optimistically set unread count to 0
      const previousCount =
        queryClient.getQueryData<UserNotificationCountResponse>(
          QUERY_KEYS.NOTIFICATION.UNREAD_COUNT
        );

      queryClient.setQueryData<UserNotificationCountResponse>(
        QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
        { totalCount: 0 }
      );

      return { previousCount };
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
      });
    },
    onError: (_, __, context) => {
      // Rollback optimistic update on error
      if (context?.previousCount) {
        queryClient.setQueryData(
          QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
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
      userNotificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
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
      userNotificationsApi.deleteNotifications(notificationIds),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_NOTIFICATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.UNREAD_COUNT,
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
    mutationFn: () => userNotificationsApi.clearReadNotifications(),
    onSuccess: () => {
      // Invalidate notifications queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATION.MY_NOTIFICATIONS,
      });
    },
  });
};
