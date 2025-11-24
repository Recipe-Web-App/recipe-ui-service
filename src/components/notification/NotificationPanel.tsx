'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  notificationPanelVariants,
  notificationPanelHeaderVariants,
  notificationPanelTitleVariants,
  notificationPanelFooterVariants,
  notificationFilterTabVariants,
  notificationFilterContainerVariants,
} from '@/lib/ui/notification-panel-variants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { NotificationList } from './NotificationList';
import type { Notification } from '@/types/user-management/notifications';
import type { NotificationFilter } from '@/types/ui/notification';

const FILTER_LABELS: Record<NotificationFilter, string> = {
  all: 'All',
  social: 'Social',
  activity: 'Activity',
  system: 'System',
};

export interface NotificationPanelProps {
  /**
   * Notifications to display
   */
  notifications: Notification[];

  /**
   * Whether notifications are loading
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the panel is open (controlled)
   */
  open?: boolean;

  /**
   * Callback when panel open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Active filter
   * @default 'all'
   */
  filter?: NotificationFilter;

  /**
   * Callback when filter changes
   */
  onFilterChange?: (filter: NotificationFilter) => void;

  /**
   * Callback when a notification is clicked
   */
  onNotificationClick?: (notification: Notification) => void;

  /**
   * Callback when mark as read is clicked
   */
  onMarkAsRead?: (notificationId: string) => void;

  /**
   * Callback when delete is clicked
   */
  onDelete?: (notificationId: string) => void;

  /**
   * Callback when "Mark all as read" is clicked
   */
  onMarkAllAsRead?: () => void;

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
  size?: 'default' | 'lg' | 'full';

  /**
   * Whether to show filter tabs
   * @default true
   */
  showFilters?: boolean;

  /**
   * Trigger element (typically NotificationBell)
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes for the panel content
   */
  className?: string;
}

/**
 * NotificationPanel Component
 *
 * A dropdown panel that displays recent notifications with:
 * - Header with title and "Mark all as read" action
 * - Filter tabs (All, Social, Activity, System)
 * - Scrollable list of notifications
 * - Footer with "View all notifications" link
 *
 * Uses Popover component as the base and NotificationList for display.
 *
 * @example
 * ```tsx
 * <NotificationPanel
 *   notifications={notifications}
 *   loading={isLoading}
 *   open={isPanelOpen}
 *   onOpenChange={setIsPanelOpen}
 *   filter={filter}
 *   onFilterChange={setFilter}
 *   onMarkAsRead={handleMarkAsRead}
 *   onDelete={handleDelete}
 *   onMarkAllAsRead={handleMarkAllAsRead}
 * >
 *   <NotificationBell unreadCount={unreadCount} />
 * </NotificationPanel>
 * ```
 */
export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  loading = false,
  open,
  onOpenChange,
  filter = 'all',
  onFilterChange,
  onNotificationClick,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  viewAllUrl = '/account/notifications',
  maxNotifications = 10,
  size = 'default',
  showFilters = true,
  children,
  className,
}) => {
  // Filter notifications based on active filter
  const filteredNotifications = React.useMemo(() => {
    if (filter === 'all') {
      return notifications;
    }

    return notifications.filter(notification => {
      const type = notification.notificationType.toLowerCase();

      switch (filter) {
        case 'social':
          return ['follow', 'share', 'collection_add'].includes(type);
        case 'activity':
          return ['like', 'comment', 'rating', 'featured', 'trending'].includes(
            type
          );
        case 'system':
          return ['welcome', 'update', 'maintenance'].includes(type);
        default:
          return true;
      }
    });
  }, [notifications, filter]);

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        className={cn(notificationPanelVariants({ size }), 'p-0', className)}
        align="end"
        sideOffset={8}
        showArrow={false}
      >
        {/* Header */}
        <div className={cn(notificationPanelHeaderVariants())}>
          <h3 className={cn(notificationPanelTitleVariants())}>
            Notifications
          </h3>

          {hasUnread && onMarkAllAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="hover:text-primary h-auto px-2 py-1 text-xs hover:bg-transparent"
            >
              <CheckCheck className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        {showFilters && onFilterChange && (
          <div className={cn(notificationFilterContainerVariants())}>
            {(Object.keys(FILTER_LABELS) as NotificationFilter[]).map(
              filterOption => (
                <button
                  key={filterOption}
                  type="button"
                  className={cn(
                    notificationFilterTabVariants({
                      active: filter === filterOption,
                    })
                  )}
                  onClick={() => onFilterChange(filterOption)}
                  aria-pressed={filter === filterOption}
                >
                  {/* eslint-disable-next-line security/detect-object-injection */}
                  {FILTER_LABELS[filterOption]}
                </button>
              )
            )}
          </div>
        )}

        {/* Notification List */}
        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          filter={filter}
          onNotificationClick={onNotificationClick}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          maxItems={maxNotifications}
        />

        {/* Footer */}
        <div className={cn(notificationPanelFooterVariants())}>
          <Link
            href={viewAllUrl}
            className="text-primary hover:text-primary/80 text-sm font-medium hover:underline"
          >
            View all notifications →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

NotificationPanel.displayName = 'NotificationPanel';
