import { cva } from 'class-variance-authority';

/**
 * Notification Bell variants using class-variance-authority
 *
 * Provides styling for the notification bell button with variants for
 * different states (default, has-unread) and sizes.
 */
export const notificationBellVariants = cva(
  // Base styles - applied to all notification bells
  [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'transition-all',
    'duration-200',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'hover:bg-primary/10',
    'active:bg-primary/20',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Default state - no unread notifications
        default: ['text-muted-foreground', 'hover:text-foreground'],
        // Has unread notifications - subtle animation
        'has-unread': [
          'text-primary',
          'hover:text-primary/80',
          'animate-pulse',
        ],
      },
      size: {
        sm: ['h-8', 'w-8', '[&_svg]:size-4'],
        default: ['h-9', 'w-9', '[&_svg]:size-5'],
        lg: ['h-10', 'w-10', '[&_svg]:size-6'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Notification Badge variants (unread count badge overlay)
 *
 * Used for the small badge that appears on top of the bell icon
 * showing the count of unread notifications.
 */
export const notificationBadgeVariants = cva(
  // Base styles for the badge overlay
  [
    'absolute',
    '-top-1',
    '-right-1',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'bg-destructive',
    'text-destructive-foreground',
    'font-semibold',
    'shadow-sm',
    'border-2',
    'border-background',
    'pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: ['h-4', 'min-w-[1rem]', 'px-1', 'text-[10px]'],
        default: ['h-5', 'min-w-[1.25rem]', 'px-1.5', 'text-xs'],
        lg: ['h-6', 'min-w-[1.5rem]', 'px-2', 'text-sm'],
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);
