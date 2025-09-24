import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { searchInputVariants } from '@/lib/ui/search-input-variants';

/**
 * Debounce configuration options
 */
export interface DebounceConfig {
  /**
   * Delay in milliseconds before triggering the debounced function
   * @default 300
   */
  delay?: number;
  /**
   * Whether to call the function on the leading edge of the timeout
   * @default false
   */
  leading?: boolean;
  /**
   * Whether to call the function on the trailing edge of the timeout
   * @default true
   */
  trailing?: boolean;
}

/**
 * Search event handler types
 */
export interface SearchEventHandlers {
  /**
   * Called when the search value changes (debounced)
   * @param value - The current search value
   * @param event - The original change event
   */
  onSearch?: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void;

  /**
   * Called immediately when the input value changes (not debounced)
   * @param event - The change event
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Called when the search is cleared
   */
  onClear?: () => void;

  /**
   * Called when the Enter key is pressed
   * @param value - The current search value
   * @param event - The keyboard event
   */
  onSubmit?: (
    value: string,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;

  /**
   * Called when the input gains focus
   * @param event - The focus event
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Called when the input loses focus
   * @param event - The blur event
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * SearchInput component props interface
 */
export interface SearchInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'onChange' | 'onFocus' | 'onBlur' | 'onSubmit'
    >,
    VariantProps<typeof searchInputVariants>,
    SearchEventHandlers {
  // Visual styling
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';

  // Label and descriptive text
  label?: string;
  helperText?: string;
  errorText?: string;

  // Search-specific features
  /**
   * Whether to show the search icon
   * @default true
   */
  showSearchIcon?: boolean;

  /**
   * Whether to show the clear button when there's content
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Whether to show a loading spinner (typically during search)
   * @default false
   */
  loading?: boolean;

  /**
   * Debounce configuration for the search function
   */
  debounceConfig?: DebounceConfig;

  /**
   * Custom search icon (replaces default search icon)
   */
  searchIcon?: React.ReactNode;

  /**
   * Custom clear icon (replaces default X icon)
   */
  clearIcon?: React.ReactNode;

  // Container and styling props
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  searchIconClassName?: string;
  clearButtonClassName?: string;

  // Additional props for enhanced functionality
  /**
   * Whether the search input should auto-focus on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Whether to clear the input when escape is pressed
   * @default true
   */
  clearOnEscape?: boolean;

  /**
   * Custom aria-label for the clear button
   * @default "Clear search"
   */
  clearButtonAriaLabel?: string;

  /**
   * Custom aria-label for the search input
   */
  searchAriaLabel?: string;
}

/**
 * Hook return type for useDebounce
 */
export interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
  flush: () => void;
}

/**
 * Internal state interface for SearchInput
 */
export interface SearchInputState {
  value: string;
  isFocused: boolean;
  hasValue: boolean;
}

/**
 * Search input context type (if using context provider)
 */
export interface SearchInputContextType {
  value: string;
  setValue: (value: string) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
