import * as React from 'react';
import { type BrowseGridColumns } from '@/types/ui/browse-grid';
import {
  type WebRecipeCardData,
  type WebRecipeCardProps,
} from '@/types/ui/web-recipe-card';

/**
 * Web recipe-specific browse grid props
 *
 * A specialized version of BrowseGridProps that works specifically with web recipes,
 * providing type-safe action handlers and WebRecipeCard configuration.
 */
export interface WebRecipeBrowseGridProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  // Data
  /** Array of web recipes to display in the grid */
  recipes: WebRecipeCardData[];

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of recipes across all pages */
  totalItems?: number;
  /** Number of recipes per page */
  pageSize?: number;
  /** Callback fired when page changes */
  onPageChange?: (page: number) => void;
  /** Callback fired when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  // States
  /** Whether the grid is in a loading state */
  loading?: boolean;
  /** Error to display (Error object or string message) */
  error?: Error | string | null;

  // Card Configuration
  /** Visual variant for all cards */
  cardVariant?: WebRecipeCardProps['variant'];
  /** Size for all cards */
  cardSize?: WebRecipeCardProps['size'];
  /** Whether to show quick actions on cards */
  showQuickActions?: boolean;

  // Actions (applied to ALL cards)
  /** Callback when a recipe card is clicked */
  onRecipeClick?: (recipe: WebRecipeCardData) => void;
  /** Callback when open external is clicked */
  onOpenExternal?: (recipe: WebRecipeCardData) => void;
  /** Callback when import is clicked */
  onImport?: (recipe: WebRecipeCardData) => void;
  /** Callback when copy link is clicked */
  onCopyLink?: (recipe: WebRecipeCardData) => void;

  // Grid Configuration
  /** Custom column configuration for responsive breakpoints */
  columns?: BrowseGridColumns;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';
  /** Spacing variant for the grid container */
  spacing?: 'compact' | 'default' | 'comfortable';

  // Empty State
  /** Message to display when there are no recipes */
  emptyMessage?: string;
  /** Detailed description for empty state */
  emptyDescription?: string;
  /** Icon or element to display in empty state */
  emptyIcon?: React.ReactNode;
  /** Action buttons for empty state */
  emptyActions?: React.ReactNode;

  // Error Handling
  /** Callback fired when retry button is clicked in error state */
  onRetry?: () => void;

  // Styling
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the grid element */
  gridClassName?: string;
  /** Additional CSS classes for the pagination wrapper */
  paginationClassName?: string;

  // Pagination Options
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean;

  // Skeleton
  /** Number of skeleton items to show during loading (default: 20) */
  skeletonCount?: number;

  // Accessibility
  /** Accessible label for the grid region */
  'aria-label'?: string;
  /** Accessible description for the grid region */
  'aria-describedby'?: string;
}

/**
 * Web recipe-specific browse list props
 */
export interface WebRecipeBrowseListProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  // Data
  /** Array of web recipes to display in the list */
  recipes: WebRecipeCardData[];

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of recipes across all pages */
  totalItems?: number;
  /** Number of recipes per page */
  pageSize?: number;
  /** Callback fired when page changes */
  onPageChange?: (page: number) => void;
  /** Callback fired when page size changes */
  onPageSizeChange?: (pageSize: number) => void;

  // States
  /** Whether the list is in a loading state */
  loading?: boolean;
  /** Error to display (Error object or string message) */
  error?: Error | string | null;

  // Item Configuration
  /** Visual variant for all list items */
  itemVariant?: 'default' | 'compact';
  /** Whether to show quick actions on items */
  showQuickActions?: boolean;

  // Actions (applied to ALL items)
  /** Callback when a recipe item is clicked */
  onRecipeClick?: (recipe: WebRecipeCardData) => void;
  /** Callback when open external is clicked */
  onOpenExternal?: (recipe: WebRecipeCardData) => void;
  /** Callback when import is clicked */
  onImport?: (recipe: WebRecipeCardData) => void;
  /** Callback when copy link is clicked */
  onCopyLink?: (recipe: WebRecipeCardData) => void;

  // Empty State
  /** Message to display when there are no recipes */
  emptyMessage?: string;
  /** Detailed description for empty state */
  emptyDescription?: string;
  /** Icon or element to display in empty state */
  emptyIcon?: React.ReactNode;
  /** Action buttons for empty state */
  emptyActions?: React.ReactNode;

  // Error Handling
  /** Callback fired when retry button is clicked in error state */
  onRetry?: () => void;

  // Styling
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the list element */
  listClassName?: string;
  /** Additional CSS classes for the pagination wrapper */
  paginationClassName?: string;

  // Pagination Options
  /** Whether to show pagination controls (default: true) */
  showPagination?: boolean;

  // Skeleton
  /** Number of skeleton items to show during loading (default: 20) */
  skeletonCount?: number;

  // Accessibility
  /** Accessible label for the list region */
  'aria-label'?: string;
  /** Accessible description for the list region */
  'aria-describedby'?: string;
}

/**
 * Web recipe browse action handlers
 */
export interface WebRecipeBrowseActions {
  onRecipeClick?: (recipe: WebRecipeCardData) => void;
  onOpenExternal?: (recipe: WebRecipeCardData) => void;
  onImport?: (recipe: WebRecipeCardData) => void;
  onCopyLink?: (recipe: WebRecipeCardData) => void;
}
