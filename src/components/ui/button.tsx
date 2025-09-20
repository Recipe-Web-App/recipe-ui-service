import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/lib/ui/button-variants';
import { type ButtonProps } from '@/types/ui/button';

/**
 * Button Component
 *
 * A flexible, accessible button component built with Tailwind CSS and
 * class-variance-authority for type-safe variants.
 *
 * Features:
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Multiple sizes (default, sm, lg, icon)
 * - Loading state support
 * - Full keyboard accessibility
 * - Icon support with proper sizing
 * - Polymorphic component support (asChild prop)
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Handle loading state
    const isDisabled = Boolean(disabled) || Boolean(loading);

    // Create the button content with loading spinner if needed
    const buttonContent = (
      <>
        {loading && (
          <svg
            className="mr-2 -ml-1 h-4 w-4 animate-spin"
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
        {children}
      </>
    );

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={isDisabled}
          {...props}
        >
          {React.Children.only(children)}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
