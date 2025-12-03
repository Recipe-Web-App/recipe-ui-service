'use client';

import * as React from 'react';
import { Trash2, FolderPlus, X, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface BulkActionToolbarProps {
  /** Number of currently selected items */
  selectedCount: number;
  /** Total number of items that can be selected */
  totalCount: number;
  /** Callback when "Select All" is clicked */
  onSelectAll: () => void;
  /** Callback when "Deselect All" is clicked */
  onDeselectAll: () => void;
  /** Callback when "Delete" is clicked */
  onDelete: () => void;
  /** Callback when "Add to Collection" is clicked */
  onAddToCollection: () => void;
  /** Callback when toolbar is cancelled/closed */
  onCancel: () => void;
  /** Whether delete action is in progress */
  isDeleting?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BulkActionToolbar Component
 *
 * A toolbar that appears when items are selected for bulk operations.
 * Provides options to select all, delete, add to collection, or cancel.
 *
 * @example
 * ```tsx
 * <BulkActionToolbar
 *   selectedCount={5}
 *   totalCount={20}
 *   onSelectAll={() => handleSelectAll()}
 *   onDeselectAll={() => handleDeselectAll()}
 *   onDelete={() => handleDeleteSelected()}
 *   onAddToCollection={() => handleAddToCollection()}
 *   onCancel={() => exitSelectionMode()}
 * />
 * ```
 */
export const BulkActionToolbar = React.forwardRef<
  HTMLDivElement,
  BulkActionToolbarProps
>(
  (
    {
      selectedCount,
      totalCount,
      onSelectAll,
      onDeselectAll,
      onDelete,
      onAddToCollection,
      onCancel,
      isDeleting = false,
      className,
    },
    ref
  ) => {
    const allSelected = selectedCount === totalCount && totalCount > 0;
    const hasSelection = selectedCount > 0;

    const handleSelectToggle = React.useCallback(() => {
      if (allSelected) {
        onDeselectAll();
      } else {
        onSelectAll();
      }
    }, [allSelected, onSelectAll, onDeselectAll]);

    // Format selection text
    const selectionText = React.useMemo(() => {
      if (selectedCount === 0) {
        return 'No items selected';
      }
      if (selectedCount === 1) {
        return '1 recipe selected';
      }
      return `${selectedCount} recipes selected`;
    }, [selectedCount]);

    return (
      <div
        ref={ref}
        className={cn(
          'border-primary/20 bg-primary/5 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3',
          className
        )}
        role="toolbar"
        aria-label="Bulk actions toolbar"
        data-testid="bulk-action-toolbar"
      >
        {/* Left side: Selection info and toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectToggle}
            className="gap-2"
            aria-label={
              allSelected ? 'Deselect all recipes' : 'Select all recipes'
            }
            data-testid="bulk-select-toggle"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Square className="h-4 w-4" aria-hidden="true" />
            )}
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>

          <span
            className="text-muted-foreground text-sm font-medium"
            aria-live="polite"
            data-testid="bulk-selection-count"
          >
            {selectionText}
          </span>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddToCollection}
            disabled={!hasSelection}
            className="gap-2"
            aria-label="Add selected recipes to collection"
            data-testid="bulk-add-to-collection"
          >
            <FolderPlus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Add to Collection</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={!hasSelection || isDeleting}
            className="gap-2"
            aria-label={`Delete ${selectedCount} selected recipe${selectedCount !== 1 ? 's' : ''}`}
            data-testid="bulk-delete"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </span>
            <span className="sm:hidden">{isDeleting ? '...' : 'Delete'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-2"
            aria-label="Cancel selection mode"
            data-testid="bulk-cancel"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        </div>
      </div>
    );
  }
);

BulkActionToolbar.displayName = 'BulkActionToolbar';

export default BulkActionToolbar;
