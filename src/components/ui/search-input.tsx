'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  searchInputVariants,
  searchInputContainerVariants,
  searchIconVariants,
  searchClearButtonVariants,
  searchInputLabelVariants,
  searchInputHelperTextVariants,
  searchLoadingSpinnerVariants,
} from '@/lib/ui/search-input-variants';
import { type SearchInputProps } from '@/types/ui/search-input';
import { useDebounce } from '@/hooks/use-debounce';

/**
 * SearchInput Component
 *
 * A specialized input component optimized for search functionality:
 * - Built-in search icon and clear button
 * - Configurable debouncing for performance
 * - Loading states for async search
 * - Full accessibility support
 * - Comprehensive keyboard navigation
 * - Multiple visual variants and sizes
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      helperClassName,
      searchIconClassName,
      clearButtonClassName,
      type = 'search',
      variant = 'default',
      size = 'default',
      state = 'default',
      label,
      helperText,
      errorText,
      showSearchIcon = true,
      showClearButton = true,
      loading = false,
      debounceConfig,
      searchIcon,
      clearIcon,
      autoFocus = false,
      clearOnEscape = true,
      clearButtonAriaLabel = 'Clear search',
      searchAriaLabel,
      disabled,
      required,
      value: controlledValue,
      onSearch,
      onChange,
      onClear,
      onSubmit,
      onFocus,
      onBlur,
      onKeyDown,
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

    // Internal state management
    const [internalValue, setInternalValue] = React.useState(
      controlledValue?.toString() ?? ''
    );
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Use controlled or uncontrolled value
    const isControlled = controlledValue !== undefined;
    const value = isControlled
      ? (controlledValue?.toString() ?? '')
      : internalValue;

    // Determine current state based on error text
    const currentState = errorText ? 'error' : state;
    const currentHelperText = errorText ?? helperText;

    // Debounced search functionality
    const { debouncedValue: debouncedSearchValue } = useDebounce(
      value,
      debounceConfig ?? {}
    );

    // Effect to call onSearch when debounced value changes
    React.useEffect(() => {
      if (onSearch && debouncedSearchValue !== '') {
        onSearch(debouncedSearchValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchValue]); // Intentionally exclude onSearch to prevent infinite loops

    // Auto-focus functionality
    React.useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    // Imperative handle for ref forwarding
    React.useImperativeHandle(
      ref,
      () => inputRef.current ?? ({} as HTMLInputElement)
    );

    // Determine if clear button should be shown
    const showClear =
      showClearButton && !disabled && !loading && value.length > 0;

    // Handle input change
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        if (!isControlled) {
          setInternalValue(newValue);
        }

        onChange?.(event);
      },
      [isControlled, onChange]
    );

    // Handle clear functionality
    const handleClear = React.useCallback(() => {
      const newValue = '';

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onClear) {
        onClear();
      } else if (onChange) {
        // Create synthetic event for onChange
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Focus the input after clearing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [isControlled, onClear, onChange]);

    // Handle focus events
    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [onFocus]
    );

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur]
    );

    // Handle keyboard events
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle Enter key for search submission
        if (event.key === 'Enter' && onSubmit) {
          event.preventDefault();
          onSubmit(value, event);
        }

        // Handle Escape key for clearing
        if (event.key === 'Escape' && clearOnEscape && value.length > 0) {
          event.preventDefault();
          handleClear();
        }

        onKeyDown?.(event);
      },
      [value, onSubmit, clearOnEscape, handleClear, onKeyDown]
    );

    // Accessibility attributes
    const accessibilityProps = {
      'aria-describedby':
        [
          ariaDescribedBy,
          currentHelperText ? helperTextId : undefined,
          errorText ? errorTextId : undefined,
        ]
          .filter(Boolean)
          .join(' ') ?? undefined,
      'aria-invalid': currentState === 'error' ? true : undefined,
      'aria-required': required ? true : undefined,
      'aria-label': searchAriaLabel ?? (label ? undefined : 'Search'),
      role: 'searchbox',
    };

    // Default icons
    const defaultSearchIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-full w-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );

    const defaultClearIcon = (
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
    );

    const defaultLoadingIcon = (
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
    );

    return (
      <div
        className={cn(
          searchInputContainerVariants({ size }),
          containerClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              searchInputLabelVariants({
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
          {/* Search Icon */}
          {showSearchIcon && (
            <div
              className={cn(
                searchIconVariants({
                  size,
                  state: isFocused ? 'focused' : currentState,
                }),
                searchIconClassName
              )}
              aria-hidden="true"
            >
              {searchIcon ?? defaultSearchIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={inputRef}
            type={type}
            id={inputId}
            disabled={disabled ?? loading}
            required={required}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              searchInputVariants({
                variant,
                size,
                state: currentState,
              }),
              !showSearchIcon &&
                (size === 'sm' ? 'pl-3' : size === 'lg' ? 'pl-4' : 'pl-3'),
              className
            )}
            {...accessibilityProps}
            {...props}
          />

          {/* Loading Spinner */}
          {loading && (
            <div
              className={cn(
                searchLoadingSpinnerVariants({
                  size,
                  visible: loading,
                })
              )}
              aria-hidden="true"
            >
              {defaultLoadingIcon}
            </div>
          )}

          {/* Clear Button */}
          {showClear && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                searchClearButtonVariants({
                  size,
                  visible: showClear,
                }),
                clearButtonClassName
              )}
              aria-label={clearButtonAriaLabel}
              tabIndex={-1}
            >
              {clearIcon ?? defaultClearIcon}
            </button>
          )}
        </div>

        {/* Helper Text */}
        {currentHelperText && (
          <div
            id={errorText ? errorTextId : helperTextId}
            className={cn(
              searchInputHelperTextVariants({
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

SearchInput.displayName = 'SearchInput';

export { SearchInput };
export type { SearchInputProps };
