'use client';

import * as React from 'react';
import { BrowseGrid } from '@/components/ui/browse-grid';
import {
  MealPlanCard,
  MealPlanCardSkeleton,
} from '@/components/meal-plan/MealPlanCard';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type MealPlanBrowseGridProps } from '@/types/meal-plan/browse-grid';
import { type MealPlanCardMealPlan } from '@/types/ui/meal-plan-card';
import { type MealPlanQuickActionHandlers } from '@/types/meal-plan/quick-actions';
import { type MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

/**
 * MealPlanBrowseGrid Component
 *
 * A meal-plan-specific grid component that wraps BrowseGrid with MealPlanCard,
 * providing a streamlined API for browsing meal plans throughout the application.
 *
 * **Features:**
 * - Type-safe meal plan grid with MealPlanCard integration
 * - Meal plan-specific action handlers (favorite, share, clone, shopping list, etc.)
 * - Status-based filtering (current, completed, upcoming)
 * - Loading state with MealPlanCard skeletons
 * - Empty state with meal-plan-specific defaults
 * - Error handling with retry functionality
 * - Responsive grid layout (2/3/4 columns)
 * - Full pagination support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MealPlanBrowseGrid
 *   mealPlans={mealPlans}
 *   loading={isLoading}
 *   onMealPlanClick={(mealPlan) => router.push(`/meal-plans/${mealPlan.id}`)}
 *   onFavorite={(mealPlan) => toggleFavorite(mealPlan.id)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pagination and ownership
 * <MealPlanBrowseGrid
 *   mealPlans={mealPlans}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   isOwner={(mealPlan) => mealPlan.userId === currentUserId}
 *   onEdit={(mealPlan) => router.push(`/meal-plans/${mealPlan.id}/edit`)}
 *   onDelete={(mealPlan) => deleteMealPlan(mealPlan.id)}
 *   onGenerateShoppingList={(mealPlan) => generateShoppingList(mealPlan.id)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With TanStack Query
 * const { data, isLoading, error, refetch } = useMealPlans(filters);
 *
 * <MealPlanBrowseGrid
 *   mealPlans={data?.mealPlans ?? []}
 *   loading={isLoading}
 *   error={error}
 *   onRetry={refetch}
 *   currentPage={filters.page}
 *   totalPages={data?.totalPages}
 *   onPageChange={(page) => setFilters({ ...filters, page })}
 * />
 * ```
 */
export const MealPlanBrowseGrid = React.forwardRef<
  HTMLDivElement,
  MealPlanBrowseGridProps
>(
  (
    {
      // Data
      mealPlans,

      // Pagination
      currentPage,
      totalPages,
      totalItems,
      pageSize = 12,
      onPageChange,
      onPageSizeChange,

      // States
      loading = false,
      error = null,

      // Meal Plan Card Configuration
      cardVariant = 'elevated',
      cardSize = 'default',
      showQuickActions = true,
      showMenu = true,

      // Meal Plan Actions
      onMealPlanClick,
      onFavorite,
      onShare,
      onClone,
      onQuickView,
      onGenerateShoppingList,
      onViewCalendar,
      onEdit,
      onDelete,
      onDuplicate,

      // Ownership
      isOwner = false,

      // Grid Configuration
      columns,
      gap = 'md',
      spacing = 'default',

      // Empty State
      emptyMessage = 'No meal plans found',
      emptyDescription = 'Try adjusting your filters or search terms to find more meal plans.',
      emptyIcon,
      emptyActions,

      // Error Handling
      onRetry,

      // Styling
      className,
      gridClassName,
      paginationClassName,

      // Pagination Options
      showPagination = true,
      paginationProps,

      // Skeleton
      skeletonCount = 12,

      // Accessibility
      'aria-label': ariaLabel = 'Browse meal plans',
      'aria-describedby': ariaDescribedBy,

      ...props
    },
    ref
  ) => {
    /**
     * Determine if a specific meal plan is owned by the current user
     */
    const isMealPlanOwner = React.useCallback(
      (mealPlan: MealPlanCardMealPlan): boolean => {
        if (typeof isOwner === 'function') {
          return isOwner(mealPlan);
        }
        return isOwner;
      },
      [isOwner]
    );

    /**
     * Build quick action handlers for a meal plan card
     */
    const buildQuickActionHandlers = React.useCallback(
      (
        mealPlan: MealPlanCardMealPlan
      ): MealPlanQuickActionHandlers | undefined => {
        // Only return handlers if showQuickActions is true
        if (!showQuickActions) {
          return undefined;
        }

        return {
          onFavorite: onFavorite ? () => onFavorite(mealPlan) : undefined,
          onShare: onShare ? () => onShare(mealPlan) : undefined,
          onClone: onClone ? () => onClone(mealPlan) : undefined,
          onQuickView: onQuickView ? () => onQuickView(mealPlan) : undefined,
          onGenerateShoppingList: onGenerateShoppingList
            ? () => onGenerateShoppingList(mealPlan)
            : undefined,
          onViewCalendar: onViewCalendar
            ? () => onViewCalendar(mealPlan)
            : undefined,
        };
      },
      [
        showQuickActions,
        onFavorite,
        onShare,
        onClone,
        onQuickView,
        onGenerateShoppingList,
        onViewCalendar,
      ]
    );

    /**
     * Build menu action handlers for a meal plan card
     */
    const buildMenuActionHandlers = React.useCallback(
      (
        mealPlan: MealPlanCardMealPlan
      ): MealPlanMenuActionHandlers | undefined => {
        // Only return handlers if showMenu is true
        if (!showMenu) {
          return undefined;
        }

        return {
          onView: onMealPlanClick ? () => onMealPlanClick(mealPlan) : undefined,
          onEdit: onEdit ? () => onEdit(mealPlan) : undefined,
          onDuplicate: onDuplicate ? () => onDuplicate(mealPlan) : undefined,
          onShare: onShare ? () => onShare(mealPlan) : undefined,
          onGenerateShoppingList: onGenerateShoppingList
            ? () => onGenerateShoppingList(mealPlan)
            : undefined,
          onDelete: onDelete ? () => onDelete(mealPlan) : undefined,
        };
      },
      [
        showMenu,
        onMealPlanClick,
        onEdit,
        onDuplicate,
        onShare,
        onGenerateShoppingList,
        onDelete,
      ]
    );

    /**
     * Render a single meal plan card
     */
    const renderMealPlanCard = React.useCallback(
      (mealPlan: MealPlanCardMealPlan, index: number) => {
        const owned = isMealPlanOwner(mealPlan);

        return (
          <MealPlanCard
            key={mealPlan.id}
            mealPlan={mealPlan}
            variant={cardVariant}
            size={cardSize}
            isOwner={owned}
            quickActionHandlers={buildQuickActionHandlers(mealPlan)}
            menuActionHandlers={buildMenuActionHandlers(mealPlan)}
            onClick={
              onMealPlanClick ? () => onMealPlanClick(mealPlan) : undefined
            }
            aria-label={`Meal plan: ${mealPlan.name}`}
            aria-posinset={index + 1}
            aria-setsize={mealPlans?.length ?? 0}
          />
        );
      },
      [
        isMealPlanOwner,
        cardVariant,
        cardSize,
        buildQuickActionHandlers,
        buildMenuActionHandlers,
        onMealPlanClick,
        mealPlans?.length,
      ]
    );

    /**
     * Custom skeleton renderer using MealPlanCardSkeleton
     */
    const renderSkeleton = React.useCallback(() => {
      return <MealPlanCardSkeleton size={cardSize} />;
    }, [cardSize]);

    /**
     * Default empty state icon
     */
    const defaultEmptyIcon = React.useMemo(
      () => (
        <Calendar
          className="text-muted-foreground h-16 w-16"
          aria-hidden="true"
        />
      ),
      []
    );

    /**
     * Default empty state actions
     */
    const defaultEmptyActions = React.useMemo(() => {
      // Only show default action if there's a retry handler
      // (implies this is an error or refetchable state)
      if (onRetry) {
        return (
          <Button variant="default" onClick={onRetry}>
            Refresh Meal Plans
          </Button>
        );
      }
      return undefined;
    }, [onRetry]);

    return (
      <BrowseGrid<MealPlanCardMealPlan>
        ref={ref}
        // Data
        items={mealPlans}
        renderItem={renderMealPlanCard}
        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        // States
        loading={loading}
        error={error}
        // Empty State
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon ?? defaultEmptyIcon}
        emptyActions={emptyActions ?? defaultEmptyActions}
        // Grid Configuration
        columns={columns}
        gap={gap}
        spacing={spacing}
        // Skeleton
        skeletonCount={skeletonCount}
        renderSkeleton={renderSkeleton}
        // Styling
        className={className}
        gridClassName={gridClassName}
        paginationClassName={paginationClassName}
        // Pagination Options
        showPagination={showPagination}
        paginationProps={paginationProps}
        // Error Handling
        onRetry={onRetry}
        // Accessibility
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );
  }
);

MealPlanBrowseGrid.displayName = 'MealPlanBrowseGrid';

export type { MealPlanBrowseGridProps };
