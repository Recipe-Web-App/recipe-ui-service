import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { browseGridVariants } from '@/lib/ui/browse-grid-variants';
import { type PaginationProps } from '@/components/ui/pagination';

/**
 * Column configuration for responsive grid
 */
export interface BrowseGridColumns {
  /** Number of columns on mobile devices (default: 2) */
  mobile?: number;
  /** Number of columns on tablet devices (default: 3) */
  tablet?: number;
  /** Number of columns on desktop devices (default: 4) */
  desktop?: number;
}

/**
 * BrowseGrid component props interface
 *
 * A generic grid component that displays items in a responsive grid layout
 * with support for pagination, loading, empty, and error states.
 *
 * @template T - The type of items to display in the grid
 */
export interface BrowseGridProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof browseGridVariants> {
  // Data
  /** Array of items to display in the grid */
  items: T[];
  /** Function to render each item in the grid */
  renderItem: (item: T, index: number) => React.ReactNode;

  // Pagination
  /** Current active page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Total number of items across all pages */
  totalItems?: number;
  /** Number of items per page */
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

  // Empty State
  /** Message to display when there are no items */
  emptyMessage?: string;
  /** Detailed description for empty state */
  emptyDescription?: string;
  /** Icon or element to display in empty state */
  emptyIcon?: React.ReactNode;
  /** Action buttons for empty state */
  emptyActions?: React.ReactNode;

  // Grid Configuration
  /** Custom column configuration for responsive breakpoints */
  columns?: BrowseGridColumns;
  /** Gap size between grid items */
  gap?: 'sm' | 'md' | 'lg';

  // Skeleton
  /** Number of skeleton items to show during loading (default: 12) */
  skeletonCount?: number;
  /** Custom skeleton renderer function */
  renderSkeleton?: () => React.ReactNode;

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
  /** Additional props to pass to the Pagination component */
  paginationProps?: Partial<PaginationProps>;

  // Error Handling
  /** Callback fired when retry button is clicked in error state */
  onRetry?: () => void;
  /** Custom error message renderer */
  renderError?: (error: Error | string) => React.ReactNode;

  // Accessibility
  /** Accessible label for the grid region */
  'aria-label'?: string;
  /** Accessible description for the grid region */
  'aria-describedby'?: string;
}

/**
 * Type guard to check if error is an Error object
 */
export function isErrorObject(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Helper to extract error message from various error formats
 */
export function getErrorMessage(
  error: Error | string | null | undefined
): string {
  if (!error) return 'An error occurred';
  if (typeof error === 'string') return error;
  return error.message || 'An error occurred';
}
