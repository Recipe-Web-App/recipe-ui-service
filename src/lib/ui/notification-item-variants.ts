import { cva } from 'class-variance-authority';

/**
 * Notification Item variants using class-variance-authority
 *
 * Provides styling for individual notification items with color-coded
 * left borders based on notification type (social, activity, system).
 */
export const notificationItemVariants = cva(
  [
    'group',
    'relative',
    'flex',
    'flex-col',
    'gap-1',
    'px-4',
    'py-3',
    'border-l-4',
    'transition-colors',
    'cursor-pointer',
    'hover:bg-muted/50',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-inset',
  ],
  {
    variants: {
      type: {
        // Social notifications (follows, shares, recipe added to collection)
        social: [
          'border-l-blue-500',
          'hover:bg-blue-50/50',
          'dark:hover:bg-blue-950/20',
        ],
        // Activity notifications (likes, comments, ratings)
        activity: [
          'border-l-green-500',
          'hover:bg-green-50/50',
          'dark:hover:bg-green-950/20',
        ],
        // System notifications (welcome, updates, maintenance)
        system: [
          'border-l-orange-500',
          'hover:bg-orange-50/50',
          'dark:hover:bg-orange-950/20',
        ],
        // Default fallback
        default: ['border-l-border', 'hover:bg-muted/50'],
      },
      read: {
        true: ['opacity-70', 'hover:opacity-100'],
        false: ['bg-muted/20'],
      },
    },
    defaultVariants: {
      type: 'default',
      read: false,
    },
  }
);

/**
 * Notification Item Header variants
 *
 * Styling for the notification title and timestamp row.
 */
export const notificationItemHeaderVariants = cva([
  'flex',
  'items-start',
  'justify-between',
  'gap-2',
  'w-full',
]);

/**
 * Notification Item Title variants
 */
export const notificationItemTitleVariants = cva(
  ['text-sm', 'transition-colors'],
  {
    variants: {
      read: {
        true: ['font-normal', 'text-foreground'],
        false: ['font-semibold', 'text-foreground'],
      },
    },
    defaultVariants: {
      read: false,
    },
  }
);

/**
 * Notification Item Message variants
 */
export const notificationItemMessageVariants = cva([
  'text-xs',
  'text-muted-foreground',
  'line-clamp-2',
]);

/**
 * Notification Item Timestamp variants
 */
export const notificationItemTimestampVariants = cva([
  'text-xs',
  'text-muted-foreground',
  'whitespace-nowrap',
  'flex-shrink-0',
]);

/**
 * Notification Item Actions variants
 *
 * Styling for the action buttons (mark as read, delete).
 */
export const notificationItemActionsVariants = cva([
  'flex',
  'items-center',
  'gap-1',
  'mt-2',
  'opacity-0',
  'group-hover:opacity-100',
  'transition-opacity',
]);

/**
 * Notification Item Action Button variants
 */
export const notificationItemActionButtonVariants = cva([
  'inline-flex',
  'items-center',
  'gap-1',
  'px-2',
  'py-1',
  'text-xs',
  'font-medium',
  'rounded-md',
  'transition-colors',
  'hover:bg-muted',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-1',
  '[&_svg]:size-3',
]);

/**
 * Notification Unread Indicator variants
 *
 * Styling for the unread dot indicator.
 */
export const notificationUnreadIndicatorVariants = cva([
  'absolute',
  'left-1',
  'top-1/2',
  '-translate-y-1/2',
  'w-2',
  'h-2',
  'rounded-full',
  'bg-primary',
  'ring-2',
  'ring-background',
]);
