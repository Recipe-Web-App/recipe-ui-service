'use client';

import React from 'react';
import { useNotificationPanelStore } from '@/stores/ui/notification-panel-store';
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/hooks/notification';
import { useToastStore } from '@/stores/ui/toast-store';
import { NotificationBell } from './NotificationBell';
import { NotificationPanel } from './NotificationPanel';
import type { UserNotification } from '@/types/notification';

export interface NotificationBellContainerProps {
  /**
   * URL for "View all notifications" link
   * @default '/account/notifications'
   */
  viewAllUrl?: string;

  /**
   * Maximum number of notifications to show in panel
   * @default 10
   */
  maxNotifications?: number;

  /**
   * Panel size variant
   * @default 'default'
   */
  panelSize?: 'default' | 'lg' | 'full';

  /**
   * Bell size variant
   * @default 'default'
   */
  bellSize?: 'sm' | 'default' | 'lg';

  /**
   * Whether to show filter tabs in panel
   * @default true
   */
  showFilters?: boolean;

  /**
   * Additional CSS classes for the bell button
   */
  bellClassName?: string;

  /**
   * Additional CSS classes for the panel
   */
  panelClassName?: string;
}

/**
 * NotificationBellContainer Component
 *
 * Smart component that connects the notification bell and panel with:
 * - Real-time notification data (auto-polls every 30s)
 * - Zustand store for UI state (panel open/closed, filter)
 * - TanStack Query hooks for data mutations
 * - Toast notifications for user feedback
 *
 * This is the component to use in your TopNav or header.
 *
 * @example
 * ```tsx
 * // In TopNav component
 * <NotificationBellContainer
 *   bellSize="default"
 *   panelSize="default"
 *   viewAllUrl="/account/notifications"
 * />
 * ```
 */
export const NotificationBellContainer: React.FC<
  NotificationBellContainerProps
> = ({
  viewAllUrl = '/account/notifications',
  maxNotifications = 10,
  panelSize = 'default',
  bellSize = 'default',
  showFilters = true,
  bellClassName,
  panelClassName,
}) => {
  // UI state from Zustand store
  const { isPanelOpen, filter, openPanel, closePanel, setFilter } =
    useNotificationPanelStore();

  // Toast store for feedback
  const { addSuccessToast, addErrorToast } = useToastStore();

  // Fetch unread notifications (auto-polls every 30s)
  const { data: notificationsResponse, isLoading: isLoadingNotifications } =
    useUnreadNotifications({
      limit: maxNotifications,
    });

  // Fetch unread count for badge (auto-polls every 30s)
  const { data: countResponse } = useUnreadNotificationCount();

  // Mutations
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationsResponse?.notifications ?? [];
  const unreadCount = countResponse?.totalCount ?? 0;

  // Handlers
  const handleTogglePanel = () => {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  };

  const handleNotificationClick = (notification: UserNotification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }

    // Close panel
    closePanel();

    // Navigate to relevant page if needed
    // TODO: Add navigation logic based on notification type
    // For now, just close the panel
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId, {
      onSuccess: () => {
        addSuccessToast('Notification marked as read');
      },
      onError: error => {
        addErrorToast(error.message ?? 'Failed to mark notification as read');
      },
    });
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId, {
      onSuccess: () => {
        addSuccessToast('Notification deleted');
      },
      onError: error => {
        addErrorToast(error.message ?? 'Failed to delete notification');
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: response => {
        const count = response.readNotificationIds?.length ?? 0;
        addSuccessToast(
          `${count} notification${count === 1 ? '' : 's'} marked as read`
        );
      },
      onError: error => {
        addErrorToast(
          error.message ?? 'Failed to mark all notifications as read'
        );
      },
    });
  };

  return (
    <NotificationPanel
      notifications={notifications}
      loading={isLoadingNotifications}
      open={isPanelOpen}
      onOpenChange={open => {
        if (open) {
          openPanel();
        } else {
          closePanel();
        }
      }}
      filter={filter}
      onFilterChange={setFilter}
      onNotificationClick={handleNotificationClick}
      onMarkAsRead={handleMarkAsRead}
      onDelete={handleDelete}
      onMarkAllAsRead={handleMarkAllAsRead}
      viewAllUrl={viewAllUrl}
      maxNotifications={maxNotifications}
      size={panelSize}
      showFilters={showFilters}
      className={panelClassName}
    >
      <NotificationBell
        unreadCount={unreadCount}
        size={bellSize}
        onClick={handleTogglePanel}
        className={bellClassName}
        aria-expanded={isPanelOpen}
      />
    </NotificationPanel>
  );
};

NotificationBellContainer.displayName = 'NotificationBellContainer';
