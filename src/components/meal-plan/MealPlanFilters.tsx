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
  type MealPlanFiltersProps,
  type MealPlanFilterValues,
  DEFAULT_MEAL_PLAN_FILTER_VALUES,
  MEAL_PLAN_FILTER_CONSTANTS,
  getDurationOptions,
  getStatusOptions,
  getMealTypeOptions,
  formatRecipeCount,
  mealPlanFiltersToFilterValues,
  filterValuesToMealPlanFilters,
} from '@/types/meal-plan/filters';

/**
 * MealPlanFilters Component
 *
 * Entity-specific filter panel for meal plan browsing that wraps the generic
 * FilterPanel component with meal-plan-specific filtering options.
 *
 * Features:
 * - Responsive: Drawer on mobile (<768px), inline panel on desktop/tablet
 * - Session-only state persistence via search-filter store
 * - Meal-plan-specific filters: search, duration, recipe count, status, meal types, ownership, favorites
 * - Integration with FilterPanel for consistent UX
 *
 * @example
 * ```tsx
 * <MealPlanFilters
 *   mealPlans={mealPlans}
 *   values={filterValues}
 *   onFilterChange={setFilterValues}
 *   totalResults={12}
 *   showResultCount
 * />
 * ```
 */
export const MealPlanFilters = React.forwardRef<
  HTMLDivElement,
  MealPlanFiltersProps
>(
  (
    {
      mealPlans: _mealPlans,
      values = DEFAULT_MEAL_PLAN_FILTER_VALUES,
      onFilterChange,
      className,
      collapsible = true,
      defaultCollapsed = false,
      totalResults,
      showResultCount = false,
      loadingResults = false,
      title = 'Filter Meal Plans',
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
      return [
        // Search filter
        {
          type: 'search',
          id: 'search',
          placeholder: 'Search meal plans...',
          debounceDelay: MEAL_PLAN_FILTER_CONSTANTS.SEARCH_DEBOUNCE_DELAY,
          showSearchIcon: true,
          showClearButton: true,
        },
        // Duration filter
        {
          type: 'checkbox',
          id: 'duration',
          label: 'Duration',
          description: 'Filter by meal plan duration',
          options: getDurationOptions(),
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: true,
        },
        // Recipe count filter
        {
          type: 'range',
          id: 'recipeCountRange',
          label: 'Recipe Count',
          description: 'Filter by number of recipes',
          min: 0,
          max: MEAL_PLAN_FILTER_CONSTANTS.MAX_RECIPE_COUNT,
          step: MEAL_PLAN_FILTER_CONSTANTS.RECIPE_COUNT_STEP,
          unit: 'recipes',
          formatValue: formatRecipeCount,
          showValue: true,
          valuePosition: 'inline',
        },
        // Status filter
        {
          type: 'checkbox',
          id: 'status',
          label: 'Status',
          description: 'Filter by meal plan status',
          options: getStatusOptions(),
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: true,
        },
        // Meal types filter
        {
          type: 'checkbox',
          id: 'mealTypes',
          label: 'Meal Types',
          description: 'Filter by included meal types',
          options: getMealTypeOptions(),
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: true,
        },
        // My meal plans filter
        {
          type: 'checkbox',
          id: 'showMyMealPlans',
          label: 'Ownership',
          description: 'Filter by meal plan ownership',
          options: [
            {
              id: 'showMyMealPlans',
              label: 'My meal plans only',
              description: 'Show only meal plans you own',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: false,
        },
        // Favorited filter
        {
          type: 'checkbox',
          id: 'showOnlyFavorited',
          label: 'Favorites',
          description: 'Filter by favorite status',
          options: [
            {
              id: 'showOnlyFavorited',
              label: 'Favorited meal plans only',
              description: 'Show only meal plans you have favorited',
            },
          ],
          layout: 'vertical',
          showSelectAll: false,
          showClearAll: false,
        },
      ];
    }, []);

    // Convert MealPlanFilterValues to generic FilterValues
    const filterValues = React.useMemo(() => {
      const genericValues = mealPlanFiltersToFilterValues(values);

      // Convert individual boolean toggles to arrays for checkbox filters
      return {
        search: genericValues.search,
        duration: genericValues.duration,
        recipeCountRange: genericValues.recipeCountRange,
        status: genericValues.status,
        mealTypes: genericValues.mealTypes,
        showMyMealPlans: genericValues.showMyMealPlans
          ? ['showMyMealPlans']
          : [],
        showOnlyFavorited: genericValues.showOnlyFavorited
          ? ['showOnlyFavorited']
          : [],
      };
    }, [values]);

    // Handle filter value changes
    const handleFilterChange = React.useCallback(
      (newValues: Record<string, unknown>) => {
        // Convert arrays back to booleans for toggle filters
        const convertedValues = {
          search: newValues.search,
          duration: newValues.duration,
          recipeCountRange: newValues.recipeCountRange,
          status: newValues.status,
          mealTypes: newValues.mealTypes,
          showMyMealPlans: Array.isArray(newValues.showMyMealPlans)
            ? newValues.showMyMealPlans.includes('showMyMealPlans')
            : false,
          showOnlyFavorited: Array.isArray(newValues.showOnlyFavorited)
            ? newValues.showOnlyFavorited.includes('showOnlyFavorited')
            : false,
        };

        const mealPlanFilters = filterValuesToMealPlanFilters(convertedValues);
        onFilterChange(mealPlanFilters);

        // Sync search query to store
        if (typeof newValues.search === 'string') {
          setQuery(newValues.search);
        }
      },
      [onFilterChange, setQuery]
    );

    // Handle clear all filters
    const handleClear = React.useCallback(() => {
      onFilterChange(DEFAULT_MEAL_PLAN_FILTER_VALUES);
      setQuery('');
    }, [onFilterChange, setQuery]);

    // Handle reset filters
    const handleReset = React.useCallback(() => {
      onFilterChange(DEFAULT_MEAL_PLAN_FILTER_VALUES);
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
        aria-label="Meal plan filters"
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
                <DrawerTitle>Meal Plan Filters</DrawerTitle>
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

MealPlanFilters.displayName = 'MealPlanFilters';

export type { MealPlanFiltersProps, MealPlanFilterValues };
