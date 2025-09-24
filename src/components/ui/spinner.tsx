'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import {
  spinnerVariants,
  spinnerWrapperVariants,
} from '@/lib/ui/spinner-variants';
import {
  type SpinnerProps,
  type SpinnerContentProps,
} from '@/types/ui/spinner';

/**
 * Spinner Icon Component - Default rotating SVG spinner
 */
const SpinnerIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
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
));
SpinnerIcon.displayName = 'SpinnerIcon';

/**
 * Spinner Content - Renders the actual spinner based on variant
 */
const SpinnerContent = React.forwardRef<HTMLElement, SpinnerContentProps>(
  ({ variant = 'spinner' }, _ref) => {
    switch (variant) {
      case 'dots':
        return (
          <>
            <span />
            <span />
            <span />
          </>
        );
      case 'pulse':
        return <span />;
      case 'bars':
        return (
          <>
            <span />
            <span />
            <span />
          </>
        );
      case 'spinner':
      default:
        return <SpinnerIcon />;
    }
  }
);
SpinnerContent.displayName = 'SpinnerContent';

/**
 * Spinner Component
 *
 * A flexible loading indicator component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 *
 * // With different variants
 * <Spinner variant="dots" />
 * <Spinner variant="pulse" />
 * <Spinner variant="bars" />
 *
 * // With sizes
 * <Spinner size="xs" />
 * <Spinner size="lg" />
 *
 * // With colors
 * <Spinner color="primary" />
 * <Spinner color="muted" />
 *
 * // With loading text
 * <Spinner text="Loading..." />
 *
 * // As fullscreen overlay
 * <Spinner overlay text="Please wait..." />
 *
 * // Centered in container
 * <Spinner centered />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      variant = 'spinner',
      size = 'default',
      color = 'default',
      speed = 'default',
      asChild = false,
      label = 'Loading',
      overlay = false,
      centered = false,
      text,
      textPosition = 'bottom',
      ...props
    },
    ref
  ) => {
    const spinnerElement = (
      <div
        className={cn(
          spinnerVariants({ variant, size, color, speed }),
          className
        )}
        role="status"
        aria-label={label}
        aria-live="polite"
        {...props}
      >
        <SpinnerContent variant={variant} />
        <span className="sr-only">{label}</span>
      </div>
    );

    // If there's text, wrap spinner with text
    const spinnerWithText = text ? (
      <div
        className={cn(
          'flex items-center gap-3',
          textPosition === 'bottom' && 'flex-col',
          textPosition === 'right' && 'flex-row'
        )}
      >
        {spinnerElement}
        <span className="text-muted-foreground text-sm">{text}</span>
      </div>
    ) : (
      spinnerElement
    );

    // Handle overlay or centered wrapper
    if (overlay || centered) {
      return (
        <div
          ref={ref}
          className={cn(spinnerWrapperVariants({ overlay, centered }))}
        >
          {spinnerWithText}
        </div>
      );
    }

    // Handle asChild prop
    if (asChild) {
      return <Slot>{spinnerWithText}</Slot>;
    }

    // Apply ref directly to the element
    if (React.isValidElement(spinnerWithText)) {
      return React.cloneElement(spinnerWithText, {
        ref,
      } as React.HTMLAttributes<HTMLDivElement>);
    }

    return spinnerWithText;
  }
);

Spinner.displayName = 'Spinner';

export { Spinner, SpinnerIcon };
export type { SpinnerProps };
