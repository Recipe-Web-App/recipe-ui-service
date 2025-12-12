import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Auto-save hook options
 */
export interface UseAutoSaveOptions<T> {
  /** Data to auto-save */
  data: T;
  /** Save function to call on interval */
  onSave: (data: T) => void | Promise<void>;
  /** Auto-save interval in milliseconds (default: 30000 = 30 seconds) */
  interval?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Debounce delay after changes before saving (default: 1000ms) */
  debounceDelay?: number;
  /** Callback when save completes successfully */
  onSaveComplete?: () => void;
  /** Callback when save fails */
  onSaveError?: (error: Error) => void;
}

/**
 * Auto-save hook return type
 */
export interface UseAutoSaveReturn {
  /** Whether a save is currently in progress */
  isSaving: boolean;
  /** Timestamp of last successful save */
  lastSaved: Date | null;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Manually trigger a save */
  saveNow: () => Promise<void>;
  /** Mark current state as saved (useful after external saves) */
  markAsSaved: () => void;
}

/**
 * Deep equality check for objects
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return false;

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    // eslint-disable-next-line security/detect-object-injection
    if (!isEqual(aObj[key], bObj[key])) return false;
  }

  return true;
}

/**
 * Auto-save hook for form data
 *
 * Automatically saves data at a specified interval when changes are detected.
 * Includes debouncing to prevent excessive saves during rapid edits.
 *
 * @example
 * ```typescript
 * const { isSaving, lastSaved, hasUnsavedChanges, saveNow } = useAutoSave({
 *   data: formData,
 *   onSave: (data) => updateDraftRecipe(data),
 *   interval: 30000, // 30 seconds
 *   enabled: true,
 * });
 * ```
 */
export function useAutoSave<T>({
  data,
  onSave,
  interval = 30000,
  enabled = true,
  debounceDelay = 1000,
  onSaveComplete,
  onSaveError,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs to track state without causing re-renders
  const dataRef = useRef<T>(data);
  const lastSavedDataRef = useRef<T | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Keep dataRef in sync with data prop (no effect cascade)
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Perform the save operation
  const performSave = useCallback(async () => {
    if (!enabled || isSaving) return;

    const currentData = dataRef.current;

    // Check if there are actual changes to save
    if (isEqual(currentData, lastSavedDataRef.current)) {
      setHasUnsavedChanges(false);
      return;
    }

    setIsSaving(true);

    try {
      await onSave(currentData);

      if (isMountedRef.current) {
        lastSavedDataRef.current = currentData;
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        onSaveComplete?.();
      }
    } catch (error) {
      if (isMountedRef.current) {
        onSaveError?.(
          error instanceof Error ? error : new Error('Save failed')
        );
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [enabled, isSaving, onSave, onSaveComplete, onSaveError]);

  // Manual save function
  const saveNow = useCallback(async () => {
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    await performSave();
  }, [performSave]);

  // Mark as saved (useful after external saves)
  const markAsSaved = useCallback(() => {
    lastSavedDataRef.current = dataRef.current;
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  }, []);

  // Track changes with debouncing
  useEffect(() => {
    if (!enabled) return;

    // Check if data has changed from last saved state
    const hasChanges = !isEqual(data, lastSavedDataRef.current);
    setHasUnsavedChanges(hasChanges);

    // Debounce: wait for user to stop typing before considering save
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only set up debounce if there are changes
    if (hasChanges) {
      debounceTimeoutRef.current = setTimeout(() => {
        // After debounce, the interval will pick up the save
        debounceTimeoutRef.current = null;
      }, debounceDelay);
    }
  }, [data, enabled, debounceDelay]);

  // Set up interval-based auto-save
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Don't save if there's a pending debounce (user is actively typing)
      if (debounceTimeoutRef.current === null) {
        performSave();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, performSave]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges && enabled) {
        // Synchronous save attempt on unmount
        // Note: This may not complete if the component unmounts quickly
        try {
          onSave(dataRef.current);
        } catch {
          // Ignore errors on unmount save
        }
      }
    };
  }, [hasUnsavedChanges, enabled, onSave]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    markAsSaved,
  };
}

/**
 * Format last saved time for display
 */
export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return 'Not saved yet';

  const now = new Date();
  const diffMs = now.getTime() - lastSaved.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) return 'Just saved';
  if (diffSec < 60) return `Saved ${diffSec} seconds ago`;
  if (diffMin < 60)
    return `Saved ${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;

  return `Saved at ${lastSaved.toLocaleTimeString()}`;
}
