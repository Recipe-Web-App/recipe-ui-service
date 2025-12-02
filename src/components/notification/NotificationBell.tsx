'use client';

import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  notificationBellVariants,
  notificationBadgeVariants,
} from '@/lib/ui/notification-bell-variants';

export interface NotificationBellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Number of unread notifications
   * @default 0
   */
  unreadCount?: number;

  /**
   * Size variant
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Additional CSS classes for the button
   */
  className?: string;

  /**
   * Additional CSS classes for the badge
   */
  badgeClassName?: string;

  /**
   * Whether to animate the bell when there are unread notifications
   * @default true
   */
  animateWhenUnread?: boolean;

  /**
   * Maximum number to display in badge (shows "99+" if exceeded)
   * @default 99
   */
  maxBadgeCount?: number;
}

/**
 * NotificationBell Component
 *
 * A bell icon button that displays a badge with the count of unread notifications.
 * Automatically animates (pulse) when there are unread notifications.
 *
 * @example
 * ```tsx
 * <NotificationBell
 *   unreadCount={5}
 *   onClick={() => console.log('Bell clicked')}
 *   aria-label="View notifications"
 * />
 * ```
 */
export const NotificationBell = React.forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(
  (
    {
      unreadCount = 0,
      size = 'default',
      className,
      badgeClassName,
      animateWhenUnread = true,
      maxBadgeCount = 99,
      ...props
    },
    ref
  ) => {
    const hasUnread = unreadCount > 0;
    const BellIcon = hasUnread && animateWhenUnread ? BellRing : Bell;

    // Format badge count (e.g., "99+" if exceeds max)
    const badgeCount =
      unreadCount > maxBadgeCount
        ? `${maxBadgeCount}+`
        : unreadCount.toString();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          notificationBellVariants({
            variant: hasUnread && animateWhenUnread ? 'has-unread' : 'default',
            size,
          }),
          className
        )}
        aria-label={
          hasUnread
            ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
            : 'No unread notifications'
        }
        {...props}
      >
        <BellIcon aria-hidden="true" />

        {/* Unread count badge */}
        {hasUnread && (
          <span
            className={cn(notificationBadgeVariants({ size }), badgeClassName)}
            aria-hidden="true"
          >
            {badgeCount}
          </span>
        )}
      </button>
    );
  }
);

NotificationBell.displayName = 'NotificationBell';
