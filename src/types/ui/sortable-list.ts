import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type {
  sortableListVariants,
  sortableItemVariants,
  sortableItemContentVariants,
  sortableItemActionsVariants,
  sortableEmptyVariants,
} from '@/lib/ui/sortable-list-variants';

/**
 * Base item interface for sortable list items
 * Items must have a unique id for drag-and-drop tracking
 */
export interface SortableItemData {
  id: string;
  [key: string]: unknown;
}

/**
 * SortableList component props
 */
export interface SortableListProps<T extends SortableItemData>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof sortableListVariants> {
  /** Array of items to render in the sortable list */
  items: T[];
  /** Callback when items are reordered */
  onReorder: (items: T[]) => void;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Unique key extractor (defaults to item.id) */
  keyExtractor?: (item: T) => string;
  /** Whether drag-and-drop is disabled */
  disabled?: boolean;
  /** Empty state message when no items */
  emptyMessage?: React.ReactNode;
  /** Accessibility label for the list */
  'aria-label'?: string;
}

/**
 * SortableItem component props
 */
export interface SortableItemProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'id'>,
    VariantProps<typeof sortableItemVariants> {
  /** Unique identifier for the sortable item */
  id: string;
  /** Whether dragging is disabled for this item */
  disabled?: boolean;
  /** Children to render inside the item */
  children: React.ReactNode;
  /** Whether to show the drag handle */
  showDragHandle?: boolean;
  /** Position of the drag handle */
  dragHandlePosition?: 'start' | 'end';
}

/**
 * SortableItemContent component props
 */
export interface SortableItemContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sortableItemContentVariants> {
  children: React.ReactNode;
}

/**
 * SortableItemActions component props
 */
export interface SortableItemActionsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sortableItemActionsVariants> {
  children: React.ReactNode;
}

/**
 * DragHandle component props
 */
export interface DragHandleProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled'
> {
  /** Whether the handle is being used to drag */
  isDragging?: boolean;
  /** Whether the handle is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Accessibility label */
  'aria-label'?: string;
}

/**
 * SortableEmpty component props
 */
export interface SortableEmptyProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sortableEmptyVariants> {
  /** Icon to show in empty state */
  icon?: React.ReactNode;
  /** Main message text */
  message?: React.ReactNode;
  /** Optional action button or link */
  action?: React.ReactNode;
}

/**
 * Hook return type for useSortable
 */
export interface UseSortableItemReturn {
  /** Attributes to spread on the sortable element */
  attributes: Record<string, unknown>;
  /** Listeners to spread on the drag handle */
  listeners: Record<string, unknown>;
  /** Ref to attach to the sortable element */
  setNodeRef: (node: HTMLElement | null) => void;
  /** Transform style for the element during drag */
  transform: { x: number; y: number } | null;
  /** Transition style for animation */
  transition: string | undefined;
  /** Whether this item is currently being dragged */
  isDragging: boolean;
}

/**
 * Drag start event data
 */
export interface SortableDragStartEvent<T extends SortableItemData> {
  active: {
    id: string;
    data: { current: T };
  };
}

/**
 * Drag end event data
 */
export interface SortableDragEndEvent<T extends SortableItemData> {
  active: {
    id: string;
    data: { current: T };
  };
  over: {
    id: string;
    data: { current: T };
  } | null;
}

/**
 * Reorder array utility function type
 */
export type ReorderArrayFn = <T>(
  array: T[],
  fromIndex: number,
  toIndex: number
) => T[];
