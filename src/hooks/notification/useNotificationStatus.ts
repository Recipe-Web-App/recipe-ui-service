import { useQuery } from '@tanstack/react-query';
import { managementApi } from '@/lib/api/notification';
import { QUERY_KEYS } from '@/constants';
import { NotificationStatus } from '@/types/notification';
import type { NotificationDetail } from '@/types/notification';

/**
 * Helper to check if all delivery statuses are complete (SENT, FAILED, or ABORTED)
 */
const isDeliveryComplete = (notification: NotificationDetail): boolean => {
  if (!notification.deliveryStatuses?.length) {
    return false;
  }

  return notification.deliveryStatuses.every(
    delivery =>
      delivery.status === NotificationStatus.SENT ||
      delivery.status === NotificationStatus.FAILED ||
      delivery.status === NotificationStatus.ABORTED
  );
};

/**
 * Hook to get notification status and poll for delivery status
 *
 * Automatically polls every 10 seconds while any delivery channel is pending or queued.
 * Stops polling when all delivery channels are sent, failed, or aborted.
 *
 * @param notificationId - Notification UUID to track
 * @param includeMessage - Include the full message body in response (default: false)
 * @returns Query result with notification details and delivery statuses
 */
export const useNotificationStatus = (
  notificationId: string | undefined,
  includeMessage = false
) => {
  const NOTIFICATION = QUERY_KEYS.NOTIFICATION
    .NOTIFICATION as readonly string[];

  return useQuery<NotificationDetail, Error>({
    queryKey: [...NOTIFICATION, notificationId, { includeMessage }],
    queryFn: () =>
      managementApi.getNotificationById(notificationId!, includeMessage),
    enabled: !!notificationId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    // Poll every 10 seconds while any delivery is pending or queued
    refetchInterval: query => {
      const notificationData = query.state.data;
      // Stop polling if all deliveries are complete
      if (notificationData && isDeliveryComplete(notificationData)) {
        return false;
      }
      // Poll every 10 seconds for pending/queued notifications
      return 10 * 1000;
    },
  });
};

/**
 * Hook to get notification status without polling
 *
 * Use this when you want to check status once without automatic polling.
 *
 * @param notificationId - Notification UUID to track
 * @param includeMessage - Include the full message body in response (default: false)
 * @returns Query result with notification details and delivery statuses
 */
export const useNotificationStatusOnce = (
  notificationId: string | undefined,
  includeMessage = false
) => {
  const NOTIFICATION = QUERY_KEYS.NOTIFICATION
    .NOTIFICATION as readonly string[];

  return useQuery<NotificationDetail, Error>({
    queryKey: [...NOTIFICATION, notificationId, { includeMessage, once: true }],
    queryFn: () =>
      managementApi.getNotificationById(notificationId!, includeMessage),
    enabled: !!notificationId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // No automatic refetching
  });
};
