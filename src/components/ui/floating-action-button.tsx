import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  fabVariants,
  extendedFabVariants,
  fabPositionVariants,
  speedDialActionVariants,
  speedDialLabelVariants,
  speedDialContainerVariants,
  fabGroupVariants,
} from '@/lib/ui/floating-action-button-variants';
import {
  type FloatingActionButtonProps,
  type SpeedDialProps,
  type FABGroupProps,
} from '@/types/ui/floating-action-button';

/**
 * FloatingActionButton Component
 *
 * A Material Design-inspired floating action button that provides
 * quick access to primary actions. Supports extended mode with labels,
 * multiple positions, and speed dial functionality.
 *
 * Features:
 * - Multiple variants (primary, secondary, destructive, success, outline, surface)
 * - Multiple sizes (sm, md, lg)
 * - Extended mode with label
 * - Configurable screen position
 * - Portal rendering for proper z-index
 * - Loading state
 * - Full keyboard accessibility
 * - Speed dial support
 */
const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      className,
      variant,
      size = 'md',
      position = 'bottom-right',
      icon,
      label,
      extended = false,
      loading = false,
      disabled = false,
      usePortal = true,
      zIndex = 50,
      offset = 16,
      tooltipLabel,
      ariaLabel,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const isDisabled = Boolean(disabled) || Boolean(loading);
    const showExtended = extended && label;

    const positionStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};

      if (position?.includes('bottom')) {
        styles.bottom = `${offset}px`;
      }
      if (position?.includes('top')) {
        styles.top = `${offset}px`;
      }
      if (position?.includes('right')) {
        styles.right = `${offset}px`;
      }
      if (position?.includes('left')) {
        styles.left = `${offset}px`;
      }

      if (zIndex) {
        styles.zIndex = zIndex;
      }

      return styles;
    }, [position, offset, zIndex]);

    const buttonContent = (
      <>
        {loading && (
          <svg
            className={cn(
              'animate-spin',
              showExtended && 'mr-2 -ml-1',
              size === 'sm' && 'h-4 w-4',
              size === 'md' && 'h-5 w-5',
              size === 'lg' && 'h-6 w-6'
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon}
        {showExtended && <span>{label}</span>}
        {children}
      </>
    );

    const button = (
      <button
        ref={ref}
        className={cn(
          fabPositionVariants({ position }),
          fabVariants({ variant, size }),
          showExtended && extendedFabVariants({ size }),
          className
        )}
        style={{
          ...positionStyles,
          ...style,
        }}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={ariaLabel ?? label ?? tooltipLabel}
        title={tooltipLabel}
        {...props}
      >
        {buttonContent}
      </button>
    );

    if (!usePortal || !mounted) {
      return button;
    }

    return createPortal(button, document.body);
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

/**
 * SpeedDial Component
 *
 * A FAB that expands to reveal multiple related actions.
 * Perfect for grouping related quick actions together.
 */
const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  (
    {
      actions,
      open: controlledOpen,
      onOpenChange,
      direction = 'up',
      showLabels = true,
      showBackdrop = true,
      onBackdropClick,
      icon,
      size = 'md',
      variant,
      position = 'bottom-right',
      offset = 16,
      zIndex = 50,
      className,
      ariaLabel,
      usePortal = true,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const isOpen = controlledOpen ?? internalOpen;

    const handleToggle = React.useCallback(() => {
      const newState = !isOpen;
      if (controlledOpen === undefined) {
        setInternalOpen(newState);
      }
      onOpenChange?.(newState);
    }, [isOpen, controlledOpen, onOpenChange]);

    const handleActionClick = React.useCallback(
      (action: (typeof actions)[0]) => {
        action.onClick();
        handleToggle();
      },
      [handleToggle]
    );

    const handleBackdropClick = React.useCallback(() => {
      if (onBackdropClick) {
        onBackdropClick();
      } else {
        handleToggle();
      }
    }, [handleToggle, onBackdropClick]);

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          handleToggle();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen, handleToggle]);

    const positionStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};

      if (position?.includes('bottom')) {
        styles.bottom = `${offset}px`;
      }
      if (position?.includes('top')) {
        styles.top = `${offset}px`;
      }
      if (position?.includes('right')) {
        styles.right = `${offset}px`;
      }
      if (position?.includes('left')) {
        styles.left = `${offset}px`;
      }

      if (zIndex) {
        styles.zIndex = zIndex;
      }

      return styles;
    }, [position, offset, zIndex]);

    const speedDialContent = (
      <>
        {showBackdrop && isOpen && (
          <div
            className="fixed inset-0 bg-black/20 transition-opacity duration-200"
            style={{ zIndex: zIndex - 1 }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
        <div
          ref={ref}
          className={cn(
            fabPositionVariants({ position }),
            'relative',
            className
          )}
          style={positionStyles}
        >
          {isOpen && (
            <div
              className={cn(
                speedDialContainerVariants({ direction }),
                'transition-all duration-200'
              )}
              role="menu"
              aria-orientation={
                direction === 'up' || direction === 'down'
                  ? 'vertical'
                  : 'horizontal'
              }
            >
              {actions.map((action, index) => (
                <div
                  key={action.id}
                  className="animate-in fade-in-0 zoom-in-95 relative duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    className={cn(speedDialActionVariants({ size }))}
                    onClick={() => handleActionClick(action)}
                    disabled={action.disabled}
                    aria-label={action.ariaLabel ?? action.label}
                    role="menuitem"
                  >
                    {action.icon}
                  </button>
                  {showLabels && (
                    <span
                      className={cn(speedDialLabelVariants({ direction }))}
                      aria-hidden="true"
                    >
                      {action.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            className={cn(
              fabVariants({ variant, size }),
              isOpen && 'rotate-45',
              'transition-transform duration-200'
            )}
            onClick={handleToggle}
            aria-label={ariaLabel ?? 'Speed dial'}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            {...props}
          >
            {icon ?? (
              <svg
                className={cn(
                  size === 'sm' && 'h-4 w-4',
                  size === 'md' && 'h-5 w-5',
                  size === 'lg' && 'h-6 w-6'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </button>
        </div>
      </>
    );

    if (!usePortal || !mounted) {
      return speedDialContent;
    }

    return createPortal(speedDialContent, document.body);
  }
);

SpeedDial.displayName = 'SpeedDial';

/**
 * FABGroup Component
 *
 * Container for multiple FABs, useful for secondary actions
 * or when you need multiple floating buttons.
 */
const FABGroup: React.FC<FABGroupProps> = ({
  children,
  position = 'bottom-right',
  direction = 'vertical',
  spacing = 16,
  offset = 16,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const positionStyles = React.useMemo(() => {
    const styles: React.CSSProperties = {};

    if (position?.includes('bottom')) {
      styles.bottom = `${offset}px`;
    }
    if (position?.includes('top')) {
      styles.top = `${offset}px`;
    }
    if (position?.includes('right')) {
      styles.right = `${offset}px`;
    }
    if (position?.includes('left')) {
      styles.left = `${offset}px`;
    }

    return styles;
  }, [position, offset]);

  const groupContent = (
    <div
      className={cn(fabGroupVariants({ position, direction }))}
      style={{
        ...positionStyles,
        gap: `${spacing}px`,
      }}
    >
      {children}
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(groupContent, document.body);
};

FABGroup.displayName = 'FABGroup';

export { FloatingActionButton, SpeedDial, FABGroup };
export type { FloatingActionButtonProps, SpeedDialProps, FABGroupProps };
