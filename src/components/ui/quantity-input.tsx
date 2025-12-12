'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  quantityInputContainerVariants,
  quantityInputWrapperVariants,
  quantityInputVariants,
  quantityInputButtonVariants,
  quantityInputLabelVariants,
  quantityInputHelperTextVariants,
} from '@/lib/ui/quantity-input-variants';
import {
  getSmartStep,
  incrementValue,
  decrementValue,
  roundToPrecision,
  DEFAULT_SMART_STEP_CONFIG,
} from '@/lib/utils/smart-step';
import type { QuantityInputProps } from '@/types/ui/quantity-input';

/** Initial delay before rapid increment starts (ms) */
const HOLD_DELAY = 400;
/** Interval between rapid increments (ms) */
const HOLD_INTERVAL = 75;

/**
 * QuantityInput Component
 *
 * A specialized numeric input with +/- buttons and smart stepping support.
 * Smart stepping adjusts the increment/decrement step based on the current value:
 * - 0.25 for values < 10
 * - 0.5 for values 10-100
 * - 1 for values > 100
 *
 * Features:
 * - Explicit +/- buttons for consistent behavior
 * - Smart stepping or fixed step support
 * - Snap-to-step behavior (odd values snap to nearest step)
 * - Press-and-hold for rapid increment/decrement
 * - Keyboard support (ArrowUp/ArrowDown)
 * - Full accessibility support
 * - React Hook Form integration (value-based onChange)
 */
const QuantityInput = React.forwardRef<HTMLInputElement, QuantityInputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      helperClassName,
      inputClassName,
      value,
      onChange,
      min = 0.01,
      max = 10000,
      smartStep = true,
      stepConfig = DEFAULT_SMART_STEP_CONFIG,
      step = 1,
      precision = 2,
      defaultValue = 1,
      showButtons = true,
      size = 'default',
      state = 'default',
      label,
      helperText,
      errorText,
      disabled,
      required,
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

    // Get the current numeric value
    const numericValue = typeof value === 'number' ? value : null;

    // Calculate the current step based on smart stepping or fixed step
    const getCurrentStep = React.useCallback(
      (currentValue: number) => {
        if (smartStep) {
          return getSmartStep(currentValue, stepConfig);
        }
        return step;
      },
      [smartStep, stepConfig, step]
    );

    // Handle increment
    const handleIncrement = React.useCallback(() => {
      if (disabled) return;

      const currentValue = numericValue ?? defaultValue;

      if (smartStep) {
        const newValue = incrementValue(
          currentValue,
          max,
          stepConfig,
          precision
        );
        onChange?.(newValue);
      } else {
        const newValue = roundToPrecision(
          Math.min(currentValue + step, max),
          precision
        );
        onChange?.(newValue);
      }
    }, [
      disabled,
      numericValue,
      defaultValue,
      smartStep,
      stepConfig,
      step,
      max,
      precision,
      onChange,
    ]);

    // Handle decrement
    const handleDecrement = React.useCallback(() => {
      if (disabled) return;

      const currentValue = numericValue ?? defaultValue;

      if (smartStep) {
        const newValue = decrementValue(
          currentValue,
          min,
          stepConfig,
          precision
        );
        onChange?.(newValue);
      } else {
        const newValue = roundToPrecision(
          Math.max(currentValue - step, min),
          precision
        );
        onChange?.(newValue);
      }
    }, [
      disabled,
      numericValue,
      defaultValue,
      smartStep,
      stepConfig,
      step,
      min,
      precision,
      onChange,
    ]);

    // Refs to store latest handlers (avoids stale closure in setInterval)
    const handleIncrementRef = React.useRef(handleIncrement);
    const handleDecrementRef = React.useRef(handleDecrement);

    // Keep refs up to date
    React.useEffect(() => {
      handleIncrementRef.current = handleIncrement;
    }, [handleIncrement]);

    React.useEffect(() => {
      handleDecrementRef.current = handleDecrement;
    }, [handleDecrement]);

    // Handle direct input changes
    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
          onChange?.('');
          return;
        }

        const parsed = parseFloat(inputValue);
        if (!isNaN(parsed)) {
          onChange?.(parsed);
        }
      },
      [onChange]
    );

    // Handle blur - clamp value to min/max
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (numericValue !== null) {
          const clamped = Math.max(min, Math.min(max, numericValue));
          const rounded = roundToPrecision(clamped, precision);
          if (rounded !== numericValue) {
            onChange?.(rounded);
          }
        }
        props.onBlur?.(e);
      },
      [numericValue, min, max, precision, onChange, props]
    );

    // Handle keyboard events
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          handleIncrement();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleDecrement();
        }
        props.onKeyDown?.(e);
      },
      [handleIncrement, handleDecrement, props]
    );

    // Check if buttons should be disabled (needed before hold handlers)
    const isDecrementDisabled =
      Boolean(disabled) || (numericValue !== null && numericValue <= min);
    const isIncrementDisabled =
      Boolean(disabled) || (numericValue !== null && numericValue >= max);

    // Press-and-hold functionality for rapid increment/decrement
    const holdTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    );
    const holdIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(
      null
    );

    const clearHoldTimers = React.useCallback(() => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    }, []);

    const startHold = React.useCallback(
      (actionRef: React.RefObject<(() => void) | null>) => {
        // Clear any existing timers
        clearHoldTimers();

        // Start the initial delay, then rapid fire
        // Use ref.current inside interval to always get latest handler
        holdTimeoutRef.current = setTimeout(() => {
          holdIntervalRef.current = setInterval(() => {
            actionRef.current?.();
          }, HOLD_INTERVAL);
        }, HOLD_DELAY);
      },
      [clearHoldTimers]
    );

    const handleIncrementMouseDown = React.useCallback(() => {
      if (isIncrementDisabled) return;
      startHold(handleIncrementRef);
    }, [isIncrementDisabled, startHold]);

    const handleDecrementMouseDown = React.useCallback(() => {
      if (isDecrementDisabled) return;
      startHold(handleDecrementRef);
    }, [isDecrementDisabled, startHold]);

    // Clean up timers on unmount or when mouse/touch ends
    React.useEffect(() => {
      return () => {
        clearHoldTimers();
      };
    }, [clearHoldTimers]);

    // Global mouse up listener to handle cases where mouse leaves button while held
    React.useEffect(() => {
      const handleGlobalMouseUp = () => {
        clearHoldTimers();
      };

      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalMouseUp);
      };
    }, [clearHoldTimers]);

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
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': numericValue ?? undefined,
    };

    return (
      <div
        className={cn(
          quantityInputContainerVariants({ size }),
          containerClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              quantityInputLabelVariants({
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

        {/* Input wrapper with buttons */}
        <div
          className={cn(
            quantityInputWrapperVariants({
              size,
              state: currentState,
              disabled,
            }),
            className
          )}
        >
          {/* Decrement button */}
          {showButtons && (
            <button
              type="button"
              onClick={handleDecrement}
              onMouseDown={handleDecrementMouseDown}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={handleDecrementMouseDown}
              onTouchEnd={clearHoldTimers}
              disabled={isDecrementDisabled}
              className={cn(
                quantityInputButtonVariants({ size, position: 'left' })
              )}
              aria-label="Decrease quantity"
              tabIndex={-1}
            >
              <Minus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            </button>
          )}

          {/* Input field */}
          <input
            ref={ref}
            type="number"
            id={inputId}
            disabled={disabled}
            required={required}
            value={value ?? ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(quantityInputVariants({ size }), inputClassName)}
            step={
              smartStep ? getCurrentStep(numericValue ?? defaultValue) : step
            }
            min={min}
            max={max}
            {...accessibilityProps}
            {...props}
          />

          {/* Increment button */}
          {showButtons && (
            <button
              type="button"
              onClick={handleIncrement}
              onMouseDown={handleIncrementMouseDown}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={handleIncrementMouseDown}
              onTouchEnd={clearHoldTimers}
              disabled={isIncrementDisabled}
              className={cn(
                quantityInputButtonVariants({ size, position: 'right' })
              )}
              aria-label="Increase quantity"
              tabIndex={-1}
            >
              <Plus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            </button>
          )}
        </div>

        {/* Helper Text / Error Text */}
        {currentHelperText && (
          <div
            id={errorText ? errorTextId : helperTextId}
            className={cn(
              quantityInputHelperTextVariants({
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
      </div>
    );
  }
);

QuantityInput.displayName = 'QuantityInput';

export { QuantityInput };
export type { QuantityInputProps };
