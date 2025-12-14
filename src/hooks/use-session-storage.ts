'use client';

import * as React from 'react';

/**
 * Type for the setValue function returned by useSessionStorage
 */
type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Helper function to read value from sessionStorage
 */
function readFromStorage<T>(key: string, initialValue: T): T {
  // Check if we're on the client
  if (globalThis.window === undefined) {
    return initialValue;
  }

  try {
    const item = globalThis.window.sessionStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item) as T;
    }
    return initialValue;
  } catch (error) {
    console.warn('Error reading sessionStorage key:', key, error);
    return initialValue;
  }
}

/**
 * Custom hook for managing state in sessionStorage
 *
 * Persists state to sessionStorage while handling:
 * - SSR compatibility (sessionStorage doesn't exist on server)
 * - Type-safe serialization/deserialization
 * - Storage event synchronization across tabs (optional)
 *
 * @param key - The sessionStorage key to use
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [storedValue, setValue] similar to useState
 *
 * @example
 * ```tsx
 * const [gatheredItems, setGatheredItems] = useSessionStorage<number[]>(
 *   'recipe-123-gathered',
 *   []
 * );
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Initialize state lazily by reading from sessionStorage
  const [storedValue, setStoredValue] = React.useState<T>(() =>
    readFromStorage(key, initialValue)
  );

  // Sync with storage when key changes
  React.useEffect(() => {
    const value = readFromStorage(key, initialValue);
    setStoredValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage
  const setValue: SetValue<T> = React.useCallback(
    (value: React.SetStateAction<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          typeof value === 'function'
            ? (value as (prevState: T) => T)(storedValue)
            : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to sessionStorage (only on client)
        if (globalThis.window !== undefined) {
          globalThis.window.sessionStorage.setItem(
            key,
            JSON.stringify(valueToStore)
          );
        }
      } catch (error) {
        console.warn('Error setting sessionStorage key:', key, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook to remove a value from sessionStorage
 *
 * @param key - The sessionStorage key to remove
 * @returns A function to remove the stored value
 *
 * @example
 * ```tsx
 * const clearGatheredItems = useRemoveSessionStorage('recipe-123-gathered');
 * clearGatheredItems(); // Removes the item from sessionStorage
 * ```
 */
export function useRemoveSessionStorage(key: string): () => void {
  return React.useCallback(() => {
    try {
      if (globalThis.window !== undefined) {
        globalThis.window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Error removing sessionStorage key:', key, error);
    }
  }, [key]);
}
