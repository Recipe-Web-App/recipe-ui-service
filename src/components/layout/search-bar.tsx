'use client';

import * as React from 'react';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { CommandPalette } from '@/components/ui/command-palette';
import { SimpleTooltip } from '@/components/ui/tooltip';

// Store hooks
import { useLayoutStore } from '@/stores/ui/layout-store';

export interface SearchBarProps {
  className?: string;
  compact?: boolean;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onCommandPaletteOpen?: () => void;
}

/**
 * SearchBar Component
 *
 * Provides search functionality with command palette integration.
 *
 * Features:
 * - Full search input on desktop
 * - Compact search button on mobile/tablet
 * - Command palette integration (⌘K / Ctrl+K)
 * - Responsive design
 * - Debounced search functionality
 */
export const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      className,
      compact = false,
      placeholder = 'Search recipes, ingredients...',
      onSearch,
      onCommandPaletteOpen,
    },
    ref
  ) => {
    const { breakpoint } = useLayoutStore();
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
      React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const isMobile = breakpoint === 'mobile';

    // Handle search input changes
    const handleSearchChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
      },
      []
    );

    // Handle search submission
    const handleSearchSubmit = React.useCallback(
      (query: string, event?: React.KeyboardEvent<HTMLInputElement>) => {
        event?.preventDefault();
        onSearch?.(query);
      },
      [onSearch]
    );

    // Handle debounced search
    const handleDebouncedSearch = React.useCallback(
      (query: string) => {
        if (query.trim().length > 2) {
          onSearch?.(query);
        }
      },
      [onSearch]
    );

    // Handle command palette open
    const handleCommandPaletteOpen = React.useCallback(() => {
      setIsCommandPaletteOpen(true);
      onCommandPaletteOpen?.();
    }, [onCommandPaletteOpen]);

    // Handle command palette close
    const handleCommandPaletteClose = React.useCallback(() => {
      setIsCommandPaletteOpen(false);
    }, []);

    // Keyboard shortcut for command palette
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // ⌘K or Ctrl+K to open command palette
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault();
          handleCommandPaletteOpen();
        }

        // Escape to close
        if (event.key === 'Escape' && isCommandPaletteOpen) {
          event.preventDefault();
          handleCommandPaletteClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [
      isCommandPaletteOpen,
      handleCommandPaletteOpen,
      handleCommandPaletteClose,
    ]);

    // Compact mode (mobile/tablet) - show search button
    if (compact || isMobile) {
      return (
        <div ref={ref} className={cn('relative', className)}>
          <SimpleTooltip
            content={
              <>
                Search recipes
                <kbd className="bg-muted text-muted-foreground pointer-events-none ml-2 inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </>
            }
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCommandPaletteOpen}
              className={cn(
                'h-9 w-9 transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                isMobile && 'h-8 w-8'
              )}
              aria-label="Open search"
            >
              <Search
                className={cn('h-4 w-4', isMobile && 'h-3.5 w-3.5')}
                aria-hidden="true"
              />
            </Button>
          </SimpleTooltip>

          <CommandPalette
            open={isCommandPaletteOpen}
            onOpenChange={setIsCommandPaletteOpen}
            commands={[]}
            onCommandSelect={() => {}}
          />
        </div>
      );
    }

    // Full search bar for desktop
    return (
      <div ref={ref} className={cn('relative max-w-md flex-1', className)}>
        <div className="relative">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleDebouncedSearch}
            onSubmit={handleSearchSubmit}
            placeholder={placeholder}
            className="w-full"
            variant="default"
            size="default"
            debounceConfig={{ delay: 300 }}
            showSearchIcon
            showClearButton
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          {/* Command palette keyboard shortcut hint */}
          <div className="absolute inset-y-0 right-3 flex items-center">
            <SimpleTooltip content="Open command palette">
              <button
                type="button"
                onClick={handleCommandPaletteOpen}
                className={cn(
                  'bg-muted inline-flex items-center gap-1 rounded border px-1.5 py-0.5',
                  'text-muted-foreground text-[10px] font-medium',
                  'hover:bg-accent hover:text-accent-foreground transition-colors',
                  'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none'
                )}
                aria-label="Open command palette (⌘K)"
              >
                <Command className="h-3 w-3" />
                <span>K</span>
              </button>
            </SimpleTooltip>
          </div>
        </div>

        <CommandPalette
          open={isCommandPaletteOpen}
          onOpenChange={setIsCommandPaletteOpen}
          commands={[]}
          onCommandSelect={() => {}}
          searchValue={searchValue}
        />
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

/**
 * Search results placeholder component
 * TODO: Replace with actual search results implementation
 */
export interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export const SearchResults = React.forwardRef<
  HTMLDivElement,
  SearchResultsProps
>(({ query, onClose }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-background border-border absolute top-full right-0 left-0 z-50 mt-2 rounded-md border shadow-lg"
    >
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          Search results for &quot;{query}&quot; will appear here.
        </p>
        <Button variant="ghost" size="sm" onClick={onClose} className="mt-2">
          Close
        </Button>
      </div>
    </div>
  );
});

SearchResults.displayName = 'SearchResults';
