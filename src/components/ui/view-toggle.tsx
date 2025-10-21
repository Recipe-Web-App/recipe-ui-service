'use client';

import * as React from 'react';
import { Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  viewToggleVariants,
  viewToggleButtonVariants,
} from '@/lib/ui/view-toggle-variants';
import {
  useViewPreferenceStore,
  type ViewMode,
} from '@/stores/ui/view-preference-store';
import type { ViewToggleProps } from '@/types/ui/view-toggle';

/**
 * ViewToggle Component
 *
 * A toggle button group for switching between grid and list views.
 * Supports both controlled and uncontrolled modes with automatic
 * localStorage persistence.
 *
 * @example
 * ```tsx
 * // Uncontrolled (uses store)
 * <ViewToggle />
 *
 * // Controlled
 * <ViewToggle value={viewMode} onValueChange={setViewMode} />
 *
 * // With customization
 * <ViewToggle size="lg" variant="outline" />
 * ```
 */
export const ViewToggle = React.forwardRef<HTMLDivElement, ViewToggleProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = 'md',
      variant = 'default',
      disabled = false,
      className,
      'aria-label': ariaLabel = 'Switch view mode',
      ...props
    },
    ref
  ) => {
    // Get store values
    const storeValue = useViewPreferenceStore(state => state.viewMode);
    const setStoreValue = useViewPreferenceStore(state => state.setViewMode);

    // Determine if component is controlled
    const isControlled = controlledValue !== undefined;

    // Set default value to store on mount (only in uncontrolled mode)
    React.useEffect(() => {
      if (!isControlled && defaultValue && storeValue !== defaultValue) {
        setStoreValue(defaultValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Get current value (controlled or uncontrolled)
    const currentValue = isControlled ? controlledValue : storeValue;

    // Handle value change
    const handleValueChange = React.useCallback(
      (newValue: ViewMode) => {
        if (disabled) return;

        if (isControlled) {
          // Controlled mode: call onChange callback
          onValueChange?.(newValue);
        } else {
          // Uncontrolled mode: update store and call callback
          setStoreValue(newValue);
          onValueChange?.(newValue);
        }
      },
      [disabled, isControlled, onValueChange, setStoreValue]
    );

    // Handle button click
    const handleGridClick = React.useCallback(() => {
      handleValueChange('grid');
    }, [handleValueChange]);

    const handleListClick = React.useCallback(() => {
      handleValueChange('list');
    }, [handleValueChange]);

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent, mode: ViewMode) => {
        if (disabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleValueChange(mode);
        }
      },
      [disabled, handleValueChange]
    );

    return (
      <div
        ref={ref}
        className={cn(viewToggleVariants({ size, variant }), className)}
        role="radiogroup"
        aria-label={ariaLabel}
        {...props}
      >
        {/* Grid button */}
        <button
          type="button"
          role="radio"
          aria-checked={currentValue === 'grid'}
          aria-label="Grid view"
          disabled={disabled}
          onClick={handleGridClick}
          onKeyDown={e => handleKeyDown(e, 'grid')}
          className={cn(
            viewToggleButtonVariants({
              size,
              variant,
              active: currentValue === 'grid',
            })
          )}
          tabIndex={disabled ? -1 : 0}
        >
          <Grid
            className={cn(
              'h-4 w-4',
              size === 'sm' && 'h-3 w-3',
              size === 'lg' && 'h-5 w-5'
            )}
            aria-hidden="true"
          />
          <span className="sr-only">Grid</span>
        </button>

        {/* List button */}
        <button
          type="button"
          role="radio"
          aria-checked={currentValue === 'list'}
          aria-label="List view"
          disabled={disabled}
          onClick={handleListClick}
          onKeyDown={e => handleKeyDown(e, 'list')}
          className={cn(
            viewToggleButtonVariants({
              size,
              variant,
              active: currentValue === 'list',
            })
          )}
          tabIndex={disabled ? -1 : 0}
        >
          <List
            className={cn(
              'h-4 w-4',
              size === 'sm' && 'h-3 w-3',
              size === 'lg' && 'h-5 w-5'
            )}
            aria-hidden="true"
          />
          <span className="sr-only">List</span>
        </button>
      </div>
    );
  }
);

ViewToggle.displayName = 'ViewToggle';
