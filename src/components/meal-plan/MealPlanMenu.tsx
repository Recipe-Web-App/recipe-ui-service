'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import {
  getMealPlanMenuActions,
  mealPlanActionIcons,
} from './meal-plan-card-utils';
import type { MealPlanMenuActionHandlers } from '@/types/meal-plan/menu';

export interface MealPlanMenuProps {
  /** Meal plan ID */
  mealPlanId: string;
  /** Whether the current user owns this meal plan */
  isOwner?: boolean;
  /** Action handlers */
  handlers: MealPlanMenuActionHandlers;
  /** Custom class name */
  className?: string;
  /** Button size */
  size?: 'sm' | 'default' | 'lg' | 'icon';
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

/**
 * MealPlanMenu - Three-dot dropdown menu for meal plan actions
 *
 * Provides context menu actions for meal plans:
 * - View: View full meal plan details
 * - Edit: Edit meal plan (owner only)
 * - Duplicate: Copy meal plan to create a new one
 * - Share: Share the meal plan with others
 * - Generate Shopping List: Create shopping list from meal plan
 * - Delete: Remove meal plan (owner only, destructive)
 *
 * @example
 * ```tsx
 * <MealPlanMenu
 *   mealPlanId={mealPlan.id}
 *   isOwner={true}
 *   handlers={{
 *     onView: handleView,
 *     onEdit: handleEdit,
 *     onDuplicate: handleDuplicate,
 *     onShare: handleShare,
 *     onGenerateShoppingList: handleGenerateShoppingList,
 *     onDelete: handleDelete,
 *   }}
 * />
 * ```
 */
export const MealPlanMenu = React.forwardRef<
  HTMLButtonElement,
  MealPlanMenuProps
>(
  (
    {
      mealPlanId,
      isOwner = false,
      handlers,
      className,
      size = 'icon',
      variant = 'ghost',
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const menuActions = React.useMemo(
      () => getMealPlanMenuActions(mealPlanId, handlers, isOwner),
      [mealPlanId, handlers, isOwner]
    );

    const handleActionClick = React.useCallback(
      (handler: ((id: string) => void) | undefined) => {
        if (handler) {
          handler(mealPlanId);
          setOpen(false);
        }
      },
      [mealPlanId]
    );

    if (menuActions.length === 0) {
      return null;
    }

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn('h-8 w-8', className)}
            aria-label="Meal plan menu"
            onClick={e => {
              e.stopPropagation();
            }}
            {...props}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {menuActions.map((action, index) => {
            const IconComponent =
              mealPlanActionIcons[
                action.icon as keyof typeof mealPlanActionIcons
              ];
            const showSeparator =
              action.separator && index < menuActions.length - 1;

            return (
              <React.Fragment key={action.type}>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    handleActionClick(action.handler);
                  }}
                  className={cn(
                    'cursor-pointer',
                    action.variant === 'destructive' &&
                      'text-destructive focus:text-destructive'
                  )}
                >
                  {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                  <span>{action.label}</span>
                </DropdownMenuItem>
                {showSeparator && <DropdownMenuSeparator />}
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

MealPlanMenu.displayName = 'MealPlanMenu';
