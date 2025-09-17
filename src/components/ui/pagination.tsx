'use client';

import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  paginationVariants,
  paginationItemVariants,
  paginationNavVariants,
  paginationEllipsisVariants,
  paginationInfoVariants,
  pageSizeSelectorVariants,
  pageJumpVariants,
} from '@/lib/ui/pagination-variants';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';

/**
 * Pagination component props
 */
export interface PaginationProps
  extends VariantProps<typeof paginationVariants> {
  // Core pagination state
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // Optional pagination info
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];

  // Display options
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  showPageJump?: boolean;

  // Labels
  previousLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
  pageInfoLabel?: (start: number, end: number, total: number) => string;
  pageSizeLabel?: string;
  pageJumpLabel?: string;

  // Styling
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';

  // Accessibility
  'aria-label'?: string;
}

/**
 * Calculate page range to display
 */
const getPageRange = (
  currentPage: number,
  totalPages: number,
  maxButtons: number
): (number | 'ellipsis')[] => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfButtons = Math.floor(maxButtons / 2);
  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(1);

  // Calculate start and end of range
  let rangeStart = Math.max(2, currentPage - halfButtons);
  let rangeEnd = Math.min(totalPages - 1, currentPage + halfButtons);

  // Adjust range if at the beginning or end
  if (currentPage <= halfButtons + 1) {
    rangeEnd = Math.min(maxButtons - 1, totalPages - 1);
  } else if (currentPage >= totalPages - halfButtons) {
    rangeStart = Math.max(2, totalPages - maxButtons + 2);
  }

  // Add ellipsis if needed at the start
  if (rangeStart > 2) {
    pages.push('ellipsis');
  }

  // Add range pages
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed at the end
  if (rangeEnd < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page if we have more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

/**
 * Get icon size class based on size prop
 */
const getIconSizeClass = (size: 'sm' | 'default' | 'lg' | null | undefined) => {
  switch (size) {
    case 'sm':
      return 'h-3 w-3';
    case 'lg':
      return 'h-5 w-5';
    default:
      return 'h-4 w-4';
  }
};

/**
 * Pagination component
 */
const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      totalItems = 0,
      pageSize = 10,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 30, 50, 100],
      showFirstLast = true,
      showPrevNext = true,
      showPageNumbers = true,
      maxPageButtons = 7,
      showPageInfo = false,
      showPageSizeSelector = false,
      showPageJump = false,
      previousLabel = 'Previous',
      nextLabel = 'Next',
      firstLabel = 'First',
      lastLabel = 'Last',
      pageInfoLabel = (start, end, total) =>
        `Showing ${start}-${end} of ${total}`,
      pageSizeLabel = 'Items per page:',
      pageJumpLabel = 'Go to page:',
      size = 'default',
      justify = 'center',
      variant = 'default',
      className,
      'aria-label': ariaLabel = 'Pagination',
      ...props
    },
    ref
  ) => {
    const [jumpValue, setJumpValue] = React.useState('');

    // Calculate item range for page info
    const itemStart = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const itemEnd = Math.min(currentPage * pageSize, totalItems);

    // Get pages to display
    const pageRange = React.useMemo(
      () => getPageRange(currentPage, totalPages, maxPageButtons),
      [currentPage, totalPages, maxPageButtons]
    );

    // Handle page jump
    const handlePageJump = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const page = parseInt(jumpValue, 10);
        if (page >= 1 && page <= totalPages) {
          onPageChange(page);
          setJumpValue('');
        }
      },
      [jumpValue, totalPages, onPageChange]
    );

    return (
      <nav
        ref={ref}
        className={cn(
          paginationVariants({ size, justify }),
          'flex-wrap gap-y-2',
          className
        )}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Page Info */}
        {showPageInfo && totalItems > 0 && (
          <div className="bg-muted/20 rounded border px-2 py-1 text-xs">
            <span
              className={cn(paginationInfoVariants({ size }), 'font-medium')}
            >
              {pageInfoLabel(itemStart, itemEnd, totalItems)}
            </span>
          </div>
        )}

        {/* Page Size Selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div
            className={cn(
              pageSizeSelectorVariants({ size }),
              'bg-muted/20 rounded border px-2 py-1'
            )}
          >
            <label
              htmlFor="page-size"
              className="text-muted-foreground text-xs font-medium"
            >
              {pageSizeLabel}
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'border-input bg-background ml-1 rounded border px-1 py-0.5 text-xs font-medium',
                size === 'sm' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-7'
              )}
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Main Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* First Page Button */}
          {showFirstLast && (
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className={cn(paginationNavVariants({ variant, size }))}
              aria-label={firstLabel}
            >
              <ChevronsLeft className={getIconSizeClass(size)} />
              <span className="sr-only">{firstLabel}</span>
            </button>
          )}

          {/* Previous Page Button */}
          {showPrevNext && (
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(paginationNavVariants({ variant, size }))}
              aria-label={previousLabel}
            >
              <ChevronLeft className={getIconSizeClass(size)} />
              <span className="hidden sm:inline">{previousLabel}</span>
            </button>
          )}

          {/* Page Number Buttons */}
          {showPageNumbers && (
            <div className="flex items-center space-x-1">
              {pageRange.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <span
                      key={`ellipsis-${currentPage}-${index}`}
                      className={cn(paginationEllipsisVariants({ size }))}
                    >
                      <MoreHorizontal className={getIconSizeClass(size)} />
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                    className={cn(
                      paginationItemVariants({
                        variant,
                        size,
                        active: page === currentPage,
                      })
                    )}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next Page Button */}
          {showPrevNext && (
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={cn(paginationNavVariants({ variant, size }))}
              aria-label={nextLabel}
            >
              <span className="hidden sm:inline">{nextLabel}</span>
              <ChevronRight className={getIconSizeClass(size)} />
            </button>
          )}

          {/* Last Page Button */}
          {showFirstLast && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(paginationNavVariants({ variant, size }))}
              aria-label={lastLabel}
            >
              <span className="sr-only">{lastLabel}</span>
              <ChevronsRight className={getIconSizeClass(size)} />
            </button>
          )}
        </div>

        {/* Page Jump */}
        {showPageJump && (
          <form
            onSubmit={handlePageJump}
            className={cn(
              pageJumpVariants({ size }),
              'bg-muted/20 rounded border px-2 py-1'
            )}
          >
            <label
              htmlFor="page-jump"
              className="text-muted-foreground text-xs font-medium"
            >
              {pageJumpLabel}
            </label>
            <input
              id="page-jump"
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={e => setJumpValue(e.target.value)}
              placeholder={String(currentPage)}
              className={cn(
                'border-input bg-background ml-1 w-12 rounded border px-1 text-center text-xs font-medium',
                size === 'sm' ? 'h-6' : size === 'lg' ? 'h-8' : 'h-7'
              )}
            />
          </form>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

/**
 * Simple Pagination - A simpler pagination variant
 */
export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const SimplePagination = React.forwardRef<
  HTMLDivElement,
  SimplePaginationProps
>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      size = 'default',
      variant = 'default',
      className,
    },
    ref
  ) => {
    return (
      <Pagination
        ref={ref}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        size={size}
        variant={variant}
        showFirstLast={false}
        maxPageButtons={5}
        className={className}
      />
    );
  }
);

SimplePagination.displayName = 'SimplePagination';

/**
 * Compact Pagination - Mobile-friendly pagination
 */
export interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CompactPagination = React.forwardRef<
  HTMLDivElement,
  CompactPaginationProps
>(({ currentPage, totalPages, onPageChange, className }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn('flex items-center justify-between', className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          paginationNavVariants({ variant: 'outline', size: 'default' })
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          paginationNavVariants({ variant: 'outline', size: 'default' })
        )}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
});

CompactPagination.displayName = 'CompactPagination';

export { Pagination, SimplePagination, CompactPagination };
