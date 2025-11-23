'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterPanel } from '@/components/ui/filter-panel';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useSearchFilterStore } from '@/stores/ui/search-filter-store';
import type { FilterConfig } from '@/types/ui/filter-panel';
import {
  type RecipeFiltersProps,
  type RecipeFilterValues,
  DEFAULT_RECIPE_FILTER_VALUES,
  RECIPE_FILTER_CONSTANTS,
  extractUniqueTags,
  getDifficultyOptions,
  getRatingOptions,
  formatFilterTime,
  recipeFiltersToFilterValues,
  filterValuesToRecipeFilters,
} from '@/types/recipe/filters';

/**
 * RecipeFilters Component
 *
 * Entity-specific filter panel for recipe browsing that wraps the generic
 * FilterPanel component with recipe-specific filtering options.
 *
 * Features:
 * - Extracts tags dynamically from recipe entities
 * - Responsive: Drawer on mobile (<768px), inline panel on desktop/tablet
 * - Session-only state persistence via search-filter store
 * - Recipe-specific filters: search, tags, prep time, cook time, difficulty, rating
 * - Integration with FilterPanel for consistent UX
 *
 * @example
 * ```tsx
 * <RecipeFilters
 *   recipes={recipes}
 *   values={filterValues}
 *   onFilterChange={setFilterValues}
 *   totalResults={42}
 *   showResultCount
 * />
 * ```
 */
export const RecipeFilters = React.forwardRef<
  HTMLDivElement,
  RecipeFiltersProps
>(
  (
    {
      recipes,
      values = DEFAULT_RECIPE_FILTER_VALUES,
      onFilterChange,
      className,
      collapsible = true,
      defaultCollapsed = false,
      totalResults,
      showResultCount = false,
      loadingResults = false,
      title = 'Filter Recipes',
      variant = 'default',
      size = 'md',
      position = 'sidebar',
      showHeader = true,
      showFooter = true,
      ...props
    },
    ref
  ) => {
    // Mobile drawer state
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Check if mobile viewport
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Integration with search-filter store (for session state)
    const { setQuery } = useSearchFilterStore();

    // Build filter configuration dynamically
    const filterConfig: FilterConfig[] = React.useMemo(() => {
      const tagOptions = extractUniqueTags(recipes);

      return [
        // Search filter
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search recipes...',
          debounceDelay: RECIPE_FILTER_CONSTANTS.SEARCH_DEBOUNCE_DELAY,
          showSearchIcon: true,
          showClearButton: true,
        },
        // Tags filter
        {
          type: 'checkbox',
          id: 'tags',
          label: 'Tags',
          description: 'Filter by recipe tags',
          options: tagOptions,
          searchable: tagOptions.length > 10,
          searchPlaceholder: 'Search tags...',
          showSelectAll: true,
          showClearAll: true,
          layout: 'vertical',
        },
        // Prep time filter
        {
          type: 'range',
          id: 'prepTime',
          label: 'Prep Time',
          description: 'Filter by preparation time',
          min: 0,
          max: RECIPE_FILTER_CONSTANTS.MAX_PREP_TIME,
          step: RECIPE_FILTER_CONSTANTS.PREP_TIME_STEP,
          unit: 'min',
          formatValue: formatFilterTime,
          showValue: true,
          valuePosition: 'inline',
        },
        // Cook time filter
        {
          type: 'range',
          id: 'cookTime',
          label: 'Cook Time',
          description: 'Filter by cooking time',
          min: 0,
          max: RECIPE_FILTER_CONSTANTS.MAX_COOK_TIME,
          step: RECIPE_FILTER_CONSTANTS.COOK_TIME_STEP,
          unit: 'min',
          formatValue: formatFilterTime,
          showValue: true,
          valuePosition: 'inline',
        },
        // Difficulty filter
        {
          type: 'checkbox',
          id: 'difficulty',
          label: 'Difficulty',
          description: 'Filter by difficulty level',
          options: getDifficultyOptions(),
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: true,
        },
        // Minimum rating filter
        {
          type: 'select',
          id: 'minRating',
          label: 'Minimum Rating',
          description: 'Filter by minimum star rating',
          options: getRatingOptions(),
          defaultValue: '0',
          placeholder: 'Select minimum rating',
        },
      ];
    }, [recipes]);

    // Convert RecipeFilterValues to generic FilterValues
    const filterValues = React.useMemo(
      () => recipeFiltersToFilterValues(values),
      [values]
    );

    // Handle filter value changes
    const handleFilterChange = React.useCallback(
      (newValues: Record<string, unknown>) => {
        const recipeFilters = filterValuesToRecipeFilters(newValues);
        onFilterChange(recipeFilters);

        // Sync search query to store
        if (typeof newValues.search === 'string') {
          setQuery(newValues.search);
        }
      },
      [onFilterChange, setQuery]
    );

    // Handle clear all filters
    const handleClear = React.useCallback(() => {
      onFilterChange(DEFAULT_RECIPE_FILTER_VALUES);
      setQuery('');
    }, [onFilterChange, setQuery]);

    // Handle reset filters
    const handleReset = React.useCallback(() => {
      onFilterChange(DEFAULT_RECIPE_FILTER_VALUES);
    }, [onFilterChange]);

    // Render filter panel
    const renderFilterPanel = () => (
      <FilterPanel
        ref={isMobile ? undefined : ref}
        filters={filterConfig}
        values={filterValues}
        onValuesChange={handleFilterChange}
        title={title}
        collapsible={collapsible && !isMobile}
        defaultCollapsed={defaultCollapsed}
        showHeader={showHeader}
        showFooter={showFooter}
        onClear={handleClear}
        onReset={handleReset}
        totalResults={totalResults}
        showResultCount={showResultCount}
        loadingResults={loadingResults}
        variant={variant}
        size={size}
        position={isMobile ? 'drawer' : position}
        className={isMobile ? 'h-full' : className}
        aria-label="Recipe filters"
        {...props}
      />
    );

    // Mobile: Render drawer with trigger button
    if (isMobile) {
      return (
        <div ref={ref} className={cn('w-full', className)}>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="w-full"
                aria-label="Open filters"
              >
                <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                Filters
                {totalResults !== undefined && (
                  <span className="text-muted-foreground ml-2">
                    ({totalResults} {totalResults === 1 ? 'result' : 'results'})
                  </span>
                )}
              </Button>
            </DrawerTrigger>

            <DrawerOverlay />

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Recipe Filters</DrawerTitle>
              </DrawerHeader>

              <DrawerBody className="overflow-y-auto">
                {renderFilterPanel()}
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      );
    }

    // Desktop/Tablet: Render inline filter panel
    return renderFilterPanel();
  }
);

RecipeFilters.displayName = 'RecipeFilters';

export type { RecipeFiltersProps, RecipeFilterValues };
