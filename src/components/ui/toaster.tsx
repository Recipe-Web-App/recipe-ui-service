'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/stores/ui/toast-store';
import { Toast } from './toast';
import type { Toast as ToastType } from '@/types/ui/toast';

/**
 * Toast positioning options
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Toaster component props
 */
export interface ToasterProps {
  /** Position of the toast container */
  position?: ToastPosition;
  /** Maximum number of toasts to show */
  limit?: number;
  /** Custom container class name */
  className?: string;
  /** Gap between toasts */
  gap?: 'sm' | 'md' | 'lg';
  /** Enable animations */
  animated?: boolean;
  /** Custom portal container */
  portalContainer?: HTMLElement | null;
}

/**
 * Get positioning classes for toast container
 */
const getPositionClasses = (position: ToastPosition): string => {
  const baseClasses = 'fixed z-[100] pointer-events-none';

  switch (position) {
    case 'top-left':
      return `${baseClasses} top-4 left-4`;
    case 'top-center':
      return `${baseClasses} top-4 left-1/2 -translate-x-1/2`;
    case 'top-right':
      return `${baseClasses} top-4 right-4`;
    case 'bottom-left':
      return `${baseClasses} bottom-4 left-4`;
    case 'bottom-center':
      return `${baseClasses} bottom-4 left-1/2 -translate-x-1/2`;
    case 'bottom-right':
      return `${baseClasses} bottom-4 right-4`;
    default:
      return `${baseClasses} top-4 right-4`;
  }
};

/**
 * Get gap classes between toasts
 */
const getGapClasses = (gap: NonNullable<ToasterProps['gap']>): string => {
  switch (gap) {
    case 'sm':
      return 'space-y-2';
    case 'md':
      return 'space-y-3';
    case 'lg':
      return 'space-y-4';
    default:
      return 'space-y-3';
  }
};

/**
 * Individual toast wrapper with animations
 */
interface ToastWrapperProps {
  toast: ToastType;
  animated: boolean;
  onRemove: (id: string) => void;
}

const ToastWrapper: React.FC<ToastWrapperProps> = ({
  toast,
  animated,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  // Handle entrance animation
  React.useEffect(() => {
    if (animated) {
      // Slight delay to trigger entrance animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  // Handle exit animation
  const handleRemove = React.useCallback(() => {
    if (animated) {
      setIsExiting(true);
      // Wait for exit animation before actually removing
      setTimeout(() => onRemove(toast.id), 200);
    } else {
      onRemove(toast.id);
    }
  }, [animated, toast.id, onRemove]);

  return (
    <div
      className={cn(
        'pointer-events-auto transition-all duration-200 ease-in-out',
        animated && {
          'translate-x-full opacity-0': !isVisible && !isExiting,
          'translate-x-0 opacity-100': isVisible && !isExiting,
          'translate-x-full scale-95 opacity-0': isExiting,
        }
      )}
    >
      <Toast
        title={toast.message}
        variant={
          toast.type === 'error'
            ? 'error'
            : toast.type === 'success'
              ? 'success'
              : toast.type === 'warning'
                ? 'warning'
                : toast.type === 'info'
                  ? 'info'
                  : 'default'
        }
        dismissible={toast.dismissible}
        autoDismiss={false} // We handle auto-dismiss via store
        onDismiss={handleRemove}
        action={
          toast.action ? (
            <button
              onClick={() => {
                toast.action?.onClick();
                handleRemove();
              }}
              className="text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

/**
 * Toaster Container Component
 */
const ToasterContainer: React.FC<ToasterProps> = ({
  position = 'top-right',
  limit,
  className,
  gap = 'md',
  animated = true,
}) => {
  const { toasts, removeToast } = useToastStore();

  // Limit toasts if specified
  const displayToasts = React.useMemo(() => {
    if (limit && toasts.length > limit) {
      return toasts.slice(-limit);
    }
    return toasts;
  }, [toasts, limit]);

  // Don't render container if no toasts
  if (displayToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        getPositionClasses(position),
        getGapClasses(gap),
        'flex flex-col',
        // Reverse order for bottom positions so newest appears at bottom
        position.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col',
        className
      )}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {displayToasts.map(toast => (
        <ToastWrapper
          key={toast.id}
          toast={toast}
          animated={animated}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

/**
 * Main Toaster Component
 *
 * Renders toast notifications in a portal outside the normal DOM tree.
 * Provides a complete toast notification system with positioning, animations,
 * and integration with the toast store.
 *
 * Features:
 * - Portal rendering to avoid z-index conflicts
 * - Configurable positioning (6 positions)
 * - Smooth enter/exit animations
 * - Auto-dismiss integration with toast store
 * - Accessibility support with ARIA attributes
 * - Responsive design with mobile considerations
 * - Action button support
 * - Toast limit configuration
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Toaster />
 *
 * // Custom positioning
 * <Toaster position="bottom-left" />
 *
 * // With custom styling and limits
 * <Toaster
 *   position="top-center"
 *   limit={3}
 *   gap="lg"
 *   className="custom-toaster"
 * />
 * ```
 */
export const Toaster: React.FC<ToasterProps> = props => {
  const [mounted, setMounted] = React.useState(false);

  // Ensure component only renders on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR
  if (!mounted) {
    return null;
  }

  // Get portal container (defaults to document.body)
  const portalContainer =
    props.portalContainer ??
    (typeof document !== 'undefined' ? document.body : null);

  if (!portalContainer) {
    return null;
  }

  return createPortal(<ToasterContainer {...props} />, portalContainer);
};

Toaster.displayName = 'Toaster';
