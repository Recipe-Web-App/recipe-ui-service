import * as React from 'react';
import {
  type DebounceConfig,
  type UseDebounceReturn,
} from '@/types/ui/search-input';

/**
 * Custom hook for debouncing values
 */
export function useDebounce<T>(
  value: T,
  config: DebounceConfig = {}
): UseDebounceReturn<T> {
  const { delay = 300, leading = false, trailing = true } = config;
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const previousValueRef = React.useRef<T>(value);
  const hasInvokedRef = React.useRef<boolean>(false);

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const flush = React.useCallback(() => {
    cancel();
    setDebouncedValue(value);
  }, [cancel, value]);

  React.useEffect(() => {
    // If value hasn't changed, do nothing
    if (previousValueRef.current === value) {
      return;
    }

    previousValueRef.current = value;

    // Handle leading edge
    if (leading && !hasInvokedRef.current) {
      setDebouncedValue(value);
      hasInvokedRef.current = true;
    }

    // Clear any existing timeout
    cancel();

    // Set new timeout for trailing edge
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        hasInvokedRef.current = false;
      }, delay);
    }

    return () => {
      cancel();
    };
  }, [value, delay, leading, trailing, cancel]);

  return { debouncedValue, cancel, flush };
}
