import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  toastVariants,
  toastIconVariants,
  toastContentVariants,
  toastTitleVariants,
  toastDescriptionVariants,
  toastCloseButtonVariants,
  toastActionVariants,
  toastProgressVariants,
} from '@/lib/ui/toast-variants';

/**
 * Toast component props interface
 */
export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  // Toast content
  title?: string;
  description?: string;

  // Toast behavior
  dismissible?: boolean;
  autoDismiss?: boolean;
  duration?: number;
  showProgress?: boolean;

  // Toast actions
  action?: React.ReactNode;
  onDismiss?: () => void;
  onAction?: () => void;

  // Icon configuration
  icon?: React.ReactNode;
  showIcon?: boolean;

  // Custom styling
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  closeButtonClassName?: string;
  actionClassName?: string;
}

/**
 * Default icons for each toast variant
 */
const DefaultIcons = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-full w-full"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.06a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-full w-full"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-full w-full"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-full w-full"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  default: null,
};

/**
 * Toast Component
 *
 * A flexible, accessible toast notification component built with Tailwind CSS
 * and class-variance-authority for type-safe variants.
 *
 * Features:
 * - Multiple variants (default, success, error, warning, info)
 * - Multiple sizes (sm, default, lg)
 * - Auto-dismiss with customizable duration
 * - Optional progress bar indicator
 * - Action buttons support
 * - Dismissible with close button
 * - Icon support with default icons per variant
 * - Full keyboard accessibility
 * - Compound component structure
 */
const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      title,
      description,
      dismissible = true,
      autoDismiss = true,
      duration = 5000,
      showProgress = false,
      action,
      onDismiss,
      onAction,
      icon,
      showIcon = true,
      titleClassName,
      descriptionClassName,
      contentClassName,
      iconClassName,
      closeButtonClassName,
      actionClassName,
      children,
      ...props
    },
    ref
  ) => {
    // Auto-dismiss timer
    const [progress, setProgress] = React.useState(100);
    const [isVisible, setIsVisible] = React.useState(true);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Generate unique ID for accessibility
    const toastId = React.useId();
    const titleId = `${toastId}-title`;
    const descriptionId = `${toastId}-description`;

    // Determine which icon to show
    const displayIcon = React.useMemo(() => {
      if (!showIcon) return null;
      if (icon) return icon;
      return variant && variant in DefaultIcons
        ? DefaultIcons[variant as keyof typeof DefaultIcons]
        : null;
    }, [icon, showIcon, variant]);

    // Handle dismiss
    const handleDismiss = React.useCallback(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, [onDismiss]);

    // Handle action click
    const handleAction = React.useCallback(() => {
      if (onAction) {
        onAction();
      }
      handleDismiss();
    }, [onAction, handleDismiss]);

    // Set up auto-dismiss timer
    React.useEffect(() => {
      if (!autoDismiss || !isVisible) return;

      // Clear any existing timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Set up main timer
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);

      // Set up progress bar animation if enabled
      if (showProgress) {
        const startTime = Date.now();
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
          setProgress(remaining);

          if (remaining > 0) {
            intervalRef.current = setTimeout(updateProgress, 16); // ~60fps
          }
        };
        updateProgress();
      }

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearTimeout(intervalRef.current);
      };
    }, [autoDismiss, duration, showProgress, isVisible, handleDismiss]);

    // Pause/resume timer on hover
    const handleMouseEnter = React.useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      if (!autoDismiss || !isVisible) return;

      const remainingTime = (progress / 100) * duration;
      if (remainingTime > 0) {
        timerRef.current = setTimeout(() => {
          handleDismiss();
        }, remainingTime);

        if (showProgress) {
          const startTime = Date.now();
          const startProgress = progress;
          const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(
              0,
              startProgress - (elapsed / remainingTime) * startProgress
            );
            setProgress(remaining);

            if (remaining > 0) {
              intervalRef.current = setTimeout(updateProgress, 16);
            }
          };
          updateProgress();
        }
      }
    }, [
      autoDismiss,
      duration,
      showProgress,
      isVisible,
      progress,
      handleDismiss,
    ]);

    if (!isVisible) return null;

    // Accessibility attributes
    const accessibilityProps = {
      role: variant === 'error' ? ('alert' as const) : ('status' as const),
      'aria-live':
        variant === 'error' ? ('assertive' as const) : ('polite' as const),
      'aria-labelledby': title ? titleId : undefined,
      'aria-describedby': description ? descriptionId : undefined,
    };

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant, size }), className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...accessibilityProps}
        {...props}
      >
        {/* Icon */}
        {displayIcon && (
          <div
            className={cn(toastIconVariants({ variant, size }), iconClassName)}
            aria-hidden="true"
          >
            {displayIcon}
          </div>
        )}

        {/* Content */}
        <div className={cn(toastContentVariants({ size }), contentClassName)}>
          {/* Title */}
          {title && (
            <div
              id={titleId}
              className={cn(
                toastTitleVariants({ variant, size }),
                titleClassName
              )}
            >
              {title}
            </div>
          )}

          {/* Description */}
          {description && (
            <div
              id={descriptionId}
              className={cn(
                toastDescriptionVariants({ variant, size }),
                descriptionClassName
              )}
            >
              {description}
            </div>
          )}

          {/* Custom children content */}
          {children && <div className="mt-2">{children}</div>}

          {/* Action Button */}
          {action && (
            <div className="mt-2">
              {React.isValidElement(action) ? (
                <div
                  onClick={handleAction}
                  className={cn(
                    toastActionVariants({ variant, size }),
                    actionClassName
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAction();
                    }
                  }}
                >
                  {action}
                </div>
              ) : (
                <button
                  onClick={handleAction}
                  className={cn(
                    toastActionVariants({ variant, size }),
                    actionClassName
                  )}
                >
                  {action}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              toastCloseButtonVariants({ variant, size }),
              closeButtonClassName
            )}
            aria-label="Dismiss notification"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Progress Bar */}
        {showProgress && autoDismiss && (
          <div
            className={cn(toastProgressVariants({ variant }))}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

/**
 * Compound Components for more flexible composition
 */

/**
 * Toast Root - Main container
 */
const ToastRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastVariants({ variant, size }), className)}
    role={variant === 'error' ? 'alert' : 'status'}
    aria-live={variant === 'error' ? 'assertive' : 'polite'}
    {...props}
  />
));
ToastRoot.displayName = 'ToastRoot';

/**
 * Toast Icon - Icon container
 */
const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastIconVariants> & {
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastIconVariants({ variant, size }), className)}
    aria-hidden="true"
    {...props}
  >
    {children ??
      (variant && variant in DefaultIcons
        ? DefaultIcons[variant as keyof typeof DefaultIcons]
        : null)}
  </div>
));
ToastIcon.displayName = 'ToastIcon';

/**
 * Toast Content - Content container
 */
const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastContentVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastContentVariants({ size }), className)}
    {...props}
  />
));
ToastContent.displayName = 'ToastContent';

/**
 * Toast Title - Title text
 */
const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastTitleVariants> & {
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastTitleVariants({ variant, size }), className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

/**
 * Toast Description - Description text
 */
const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastDescriptionVariants> & {
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastDescriptionVariants({ variant, size }), className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

/**
 * Toast Action - Action button
 */
const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof toastActionVariants> & {
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }
>(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(toastActionVariants({ variant, size }), className)}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

/**
 * Toast Close - Close button
 */
const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof toastCloseButtonVariants> & {
      variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }
>(({ className, variant, size, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(toastCloseButtonVariants({ variant, size }), className)}
    aria-label="Dismiss notification"
    type="button"
    {...props}
  >
    {children ?? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    )}
  </button>
));
ToastClose.displayName = 'ToastClose';

export {
  Toast,
  ToastRoot,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
