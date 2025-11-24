import { cva } from 'class-variance-authority';

/**
 * Notification Panel content variants using class-variance-authority
 *
 * Provides styling for the notification dropdown panel container
 * that appears when clicking the notification bell.
 */
export const notificationPanelVariants = cva(
  [
    'relative',
    'z-50',
    'rounded-md',
    'border',
    'shadow-lg',
    'outline-none',
    'animate-in',
    'fade-in-0',
    'slide-in-from-top-2',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:slide-out-to-top-2',
    'bg-popover',
    'text-popover-foreground',
  ],
  {
    variants: {
      size: {
        default: ['w-80', 'max-h-[400px]'],
        lg: ['w-96', 'max-h-[500px]'],
        full: ['w-[calc(100vw-2rem)]', 'max-w-md', 'max-h-[600px]'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Notification Panel Header variants
 *
 * Styling for the panel header containing title and actions.
 */
export const notificationPanelHeaderVariants = cva([
  'flex',
  'items-center',
  'justify-between',
  'px-4',
  'py-3',
  'border-b',
  'border-border',
  'sticky',
  'top-0',
  'z-10',
  'bg-popover',
]);

/**
 * Notification Panel Title variants
 */
export const notificationPanelTitleVariants = cva([
  'font-semibold',
  'text-sm',
  'text-foreground',
]);

/**
 * Notification Panel Footer variants
 *
 * Styling for the panel footer with "View all" link.
 */
export const notificationPanelFooterVariants = cva([
  'flex',
  'items-center',
  'justify-center',
  'px-4',
  'py-3',
  'border-t',
  'border-border',
  'sticky',
  'bottom-0',
  'z-10',
  'bg-popover',
]);

/**
 * Notification Panel List variants
 *
 * Styling for the scrollable list container of notifications.
 */
export const notificationPanelListVariants = cva([
  'overflow-y-auto',
  'overflow-x-hidden',
  'max-h-[320px]',
  'scrollbar-thin',
  'scrollbar-thumb-border',
  'scrollbar-track-transparent',
]);

/**
 * Notification Filter Tab variants
 *
 * Styling for filter tabs (All, Social, Activity, System).
 */
export const notificationFilterTabVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'px-3',
    'py-1.5',
    'text-xs',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'cursor-pointer',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-1',
  ],
  {
    variants: {
      active: {
        true: ['bg-primary', 'text-primary-foreground', 'shadow-sm'],
        false: [
          'text-muted-foreground',
          'hover:bg-muted',
          'hover:text-foreground',
        ],
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

/**
 * Notification Filter Container variants
 *
 * Styling for the container of filter tabs.
 */
export const notificationFilterContainerVariants = cva([
  'flex',
  'items-center',
  'gap-1',
  'px-4',
  'py-2',
  'border-b',
  'border-border',
  'bg-muted/30',
]);

/**
 * Notification Empty State variants
 *
 * Styling for empty state when no notifications exist.
 */
export const notificationEmptyStateVariants = cva([
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'py-8',
  'px-4',
  'text-center',
  'text-muted-foreground',
]);
