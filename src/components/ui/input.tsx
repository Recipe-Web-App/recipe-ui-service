import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  inputVariants,
  inputContainerVariants,
  inputLabelVariants,
  floatingLabelVariants,
  helperTextVariants,
  inputIconVariants,
  clearButtonVariants,
  characterCounterVariants,
} from '@/lib/input-variants';

/**
 * Base Input component props interface
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  // Input styling
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';

  // Label and text
  label?: string;
  helperText?: string;
  errorText?: string;

  // Icons and interactions
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;

  // Advanced features
  loading?: boolean;
  floatingLabel?: boolean;
  showCharacterCount?: boolean;
  characterLimit?: number;

  // Container props
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}

/**
 * Input Component
 *
 * A flexible, accessible input component with comprehensive features:
 * - Multiple variants (default, filled, outlined)
 * - Multiple sizes and states
 * - Label support (fixed and floating)
 * - Icon support (left/right)
 * - Helper text and error messages
 * - Character counting
 * - Clear functionality
 * - Loading states
 * - Full accessibility support
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      helperClassName,
      type = 'text',
      variant = 'default',
      size = 'default',
      state = 'default',
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      loading = false,
      floatingLabel = false,
      showCharacterCount = false,
      characterLimit,
      disabled,
      required,
      value,
      onChange,
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperTextId = `${inputId}-helper`;
    const errorTextId = `${inputId}-error`;

    // Determine current state based on error text
    const currentState = errorText ? 'error' : state;
    const currentHelperText = errorText ?? helperText;

    // Character count logic
    const characterCount = React.useMemo(() => {
      if (!showCharacterCount) return null;

      const currentLength = String(value ?? '').length;
      const limit = characterLimit;

      if (!limit) {
        return {
          current: currentLength,
          state: 'default' as const,
        };
      }

      const percentage = currentLength / limit;
      let countState: 'default' | 'warning' | 'error' = 'default';

      if (percentage >= 1) {
        countState = 'error';
      } else if (percentage >= 0.8) {
        countState = 'warning';
      }

      return {
        current: currentLength,
        limit,
        state: countState,
      };
    }, [value, showCharacterCount, characterLimit]);

    // Handle clear functionality
    const handleClear = React.useCallback(() => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create synthetic event for onChange
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, [onClear, onChange]);

    // Determine if clear button should be shown
    const showClearButton = clearable && !disabled && !loading && value;

    // Calculate padding for icons
    const inputPaddingClasses = React.useMemo(() => {
      const classes = [];

      if (leftIcon) {
        let leftPaddingClass = 'pl-9';
        if (size === 'sm') {
          leftPaddingClass = 'pl-8';
        } else if (size === 'lg') {
          leftPaddingClass = 'pl-12';
        }
        classes.push(leftPaddingClass);
      }

      if (rightIcon || showClearButton || loading) {
        let rightPaddingClass = 'pr-9';
        if (size === 'sm') {
          rightPaddingClass = 'pr-8';
        } else if (size === 'lg') {
          rightPaddingClass = 'pr-12';
        }
        classes.push(rightPaddingClass);
      }

      return classes.join(' ');
    }, [leftIcon, rightIcon, showClearButton, loading, size]);

    // Accessibility attributes
    const accessibilityProps = {
      'aria-describedby':
        [
          ariaDescribedBy,
          currentHelperText ? helperTextId : undefined,
          errorText ? errorTextId : undefined,
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      'aria-invalid': currentState === 'error' ? true : undefined,
      'aria-required': required ? true : undefined,
    };

    return (
      <div className={cn(inputContainerVariants({ size }), containerClassName)}>
        {/* Fixed Label */}
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className={cn(
              inputLabelVariants({
                size,
                state: disabled ? 'disabled' : currentState,
                required,
              }),
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                inputIconVariants({
                  position: 'left',
                  size,
                })
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled ?? loading}
            required={required}
            value={value}
            onChange={onChange}
            className={cn(
              inputVariants({
                variant,
                size,
                state: currentState,
              }),
              inputPaddingClasses,
              floatingLabel && 'peer placeholder-transparent',
              className
            )}
            placeholder={floatingLabel ? ' ' : props.placeholder}
            {...accessibilityProps}
            {...props}
          />

          {/* Floating Label */}
          {label && floatingLabel && (
            <label
              htmlFor={inputId}
              className={cn(
                floatingLabelVariants({
                  size,
                  state: disabled ? 'default' : currentState,
                }),
                labelClassName
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}

          {/* Right Side Icons/Buttons */}
          <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 pr-3">
            {/* Loading Spinner */}
            {loading && (
              <div
                className={cn(inputIconVariants({ size }), 'animate-spin')}
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
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
              </div>
            )}

            {/* Clear Button */}
            {showClearButton && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(clearButtonVariants({ size }))}
                aria-label="Clear input"
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Right Icon */}
            {rightIcon && !showClearButton && !loading && (
              <div
                className={cn(
                  inputIconVariants({
                    position: 'right',
                    size,
                  })
                )}
              >
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Helper Text and Character Count */}
        {(currentHelperText ?? characterCount) && (
          <div className="mt-1 flex items-start justify-between gap-2">
            {/* Helper Text / Error Text */}
            {currentHelperText && (
              <div
                id={errorText ? errorTextId : helperTextId}
                className={cn(
                  helperTextVariants({
                    state: currentState,
                  }),
                  helperClassName
                )}
                role={errorText ? 'alert' : undefined}
                aria-live={errorText ? 'polite' : undefined}
              >
                {currentHelperText}
              </div>
            )}

            {/* Character Count */}
            {characterCount && (
              <div
                className={cn(
                  characterCounterVariants({
                    state: characterCount.state,
                  })
                )}
              >
                {characterCount.limit
                  ? `${characterCount.current}/${characterCount.limit}`
                  : characterCount.current}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
