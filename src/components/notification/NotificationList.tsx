'use client';

import React from 'react';
import { BellOff, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationPanelListVariants } from '@/lib/ui/notification-panel-variants';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationItem } from './NotificationItem';
import type { UserNotification } from '@/types/notification';
import type { NotificationFilter } from '@/types/ui/notification';

export interface NotificationListProps {
  /**
   * Array of notifications to display
   */
  notifications: UserNotification[];

  /**
   * Whether notifications are being loaded
   * @default false
   */
  loading?: boolean;

  /**
   * Active filter (affects empty state message)
   */
  filter?: NotificationFilter;

  /**
   * Callback when a notification is clicked
   */
  onNotificationClick?: (notification: UserNotification) => void;

  /**
   * Callback when mark as read is clicked
   */
  onMarkAsRead?: (notificationId: string) => void;

  /**
   * Callback when delete is clicked
   */
  onDelete?: (notificationId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show action buttons on items
   * @default true
   */
  showActions?: boolean;

  /**
   * Maximum number of items to display
   * @default undefined (show all)
   */
  maxItems?: number;
}

/**
 * NotificationList Component
 *
 * Displays a list of notifications with loading and empty states.
 * Used in both the notification panel and full notification center page.
 *
 * @example
 * ```tsx
 * <NotificationList
 *   notifications={notifications}
 *   loading={isLoading}
 *   filter="all"
 *   onNotificationClick={handleClick}
 *   onMarkAsRead={handleMarkAsRead}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const NotificationList = React.forwardRef<
  HTMLDivElement,
  NotificationListProps
>(
  (
    {
      notifications,
      loading = false,
      filter = 'all',
      onNotificationClick,
      onMarkAsRead,
      onDelete,
      className,
      showActions = true,
      maxItems,
    },
    ref
  ) => {
    // Limit items if maxItems is specified
    const displayNotifications = maxItems
      ? notifications.slice(0, maxItems)
      : notifications;

    // Loading state - show skeleton loaders
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(notificationPanelListVariants(), className)}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="border-border flex flex-col gap-2 border-b px-4 py-3 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      );
    }

    // Empty state - no notifications
    if (displayNotifications.length === 0) {
      // All caught up (only unread notifications filtered, and none exist)
      const allRead = filter === 'all' && notifications.length === 0;
      const Icon = allRead ? CheckCircle2 : BellOff;

      return (
        <div ref={ref} className={cn('py-6', className)}>
          <EmptyState>
            <EmptyStateIcon
              className={allRead ? 'text-success' : 'text-muted-foreground'}
            >
              <Icon className="h-12 w-12" />
            </EmptyStateIcon>
            <EmptyStateTitle>
              {allRead ? "You're all caught up!" : 'No notifications'}
            </EmptyStateTitle>
            <EmptyStateDescription>
              {allRead
                ? 'You have no new notifications.'
                : getEmptyMessage(filter)}
            </EmptyStateDescription>
          </EmptyState>
        </div>
      );
    }

    // Display notifications
    return (
      <div
        ref={ref}
        className={cn(notificationPanelListVariants(), className)}
        role="list"
        aria-label="Notifications"
      >
        {displayNotifications.map(notification => (
          <NotificationItem
            key={notification.notificationId}
            notification={notification}
            onClick={onNotificationClick}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>
    );
  }
);

NotificationList.displayName = 'NotificationList';

/**
 * Get appropriate empty state message based on active filter
 */
function getEmptyMessage(filter: NotificationFilter): string {
  switch (filter) {
    case 'social':
      return 'No social notifications yet.';
    case 'activity':
      return 'No activity notifications yet.';
    case 'system':
      return 'No system notifications yet.';
    case 'all':
    default:
      return 'No notifications to display.';
  }
}
