'use client';

import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  notificationItemVariants,
  notificationItemHeaderVariants,
  notificationItemTitleVariants,
  notificationItemMessageVariants,
  notificationItemTimestampVariants,
  notificationItemActionsVariants,
  notificationItemActionButtonVariants,
  notificationUnreadIndicatorVariants,
} from '@/lib/ui/notification-item-variants';
import {
  DEFAULT_TYPE_MAPPING,
  type NotificationDisplayType,
} from '@/types/ui/notification';
import type { Notification } from '@/types/user-management/notifications';

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

/**
 * Map notification type string to display type for styling
 */
function mapNotificationType(type: string): NotificationDisplayType {
  const lowerType = type.toLowerCase();
  // eslint-disable-next-line security/detect-object-injection
  return DEFAULT_TYPE_MAPPING[lowerType] ?? 'default';
}

export interface NotificationItemProps {
  /**
   * The notification data from the API
   */
  notification: Notification;

  /**
   * Callback when notification is clicked
   */
  onClick?: (notification: Notification) => void;

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
   * Whether to show action buttons
   * @default true
   */
  showActions?: boolean;
}

/**
 * NotificationItem Component
 *
 * Displays a single notification with:
 * - Color-coded left border by type (social, activity, system)
 * - Unread indicator for unread notifications
 * - Title, message, and relative timestamp
 * - Quick action buttons (mark as read, delete)
 *
 * @example
 * ```tsx
 * <NotificationItem
 *   notification={notification}
 *   onClick={handleClick}
 *   onMarkAsRead={handleMarkAsRead}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const NotificationItem = React.forwardRef<
  HTMLDivElement,
  NotificationItemProps
>(
  (
    {
      notification,
      onClick,
      onMarkAsRead,
      onDelete,
      className,
      showActions = true,
    },
    ref
  ) => {
    const displayType = mapNotificationType(notification.notificationType);
    const relativeTime = formatRelativeTime(notification.createdAt);

    const handleClick = () => {
      if (onClick) {
        onClick(notification);
      }
      // Auto mark as read when clicked (if unread)
      if (!notification.isRead && onMarkAsRead) {
        onMarkAsRead(notification.notificationId);
      }
    };

    const handleMarkAsRead = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onMarkAsRead) {
        onMarkAsRead(notification.notificationId);
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(notification.notificationId);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          notificationItemVariants({
            type: displayType,
            read: notification.isRead,
          }),
          className
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`Notification: ${notification.title}. ${notification.isRead ? 'Read' : 'Unread'}`}
      >
        {/* Unread indicator dot */}
        {!notification.isRead && (
          <div
            className={cn(notificationUnreadIndicatorVariants())}
            aria-hidden="true"
          />
        )}

        {/* Header with title and timestamp */}
        <div className={cn(notificationItemHeaderVariants())}>
          <h4
            className={cn(
              notificationItemTitleVariants({ read: notification.isRead })
            )}
          >
            {notification.title}
          </h4>
          <time
            className={cn(notificationItemTimestampVariants())}
            dateTime={notification.createdAt}
          >
            {relativeTime}
          </time>
        </div>

        {/* Message */}
        {notification.message && (
          <p className={cn(notificationItemMessageVariants())}>
            {notification.message}
          </p>
        )}

        {/* Action buttons (mark as read, delete) */}
        {showActions && (
          <div className={cn(notificationItemActionsVariants())}>
            {!notification.isRead && onMarkAsRead && (
              <button
                className={cn(notificationItemActionButtonVariants())}
                onClick={handleMarkAsRead}
                aria-label="Mark as read"
                type="button"
              >
                <Check />
                <span>Mark read</span>
              </button>
            )}
            {onDelete && (
              <button
                className={cn(notificationItemActionButtonVariants())}
                onClick={handleDelete}
                aria-label="Delete notification"
                type="button"
              >
                <Trash2 />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
