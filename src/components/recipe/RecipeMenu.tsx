'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown';
import {
  recipeMenuTriggerVariants,
  recipeMenuItemVariants,
  recipeMenuIconVariants,
  recipeMenuSeparatorVariants,
} from '@/lib/ui/recipe-menu-variants';
import {
  type RecipeMenuProps,
  type RecipeMenuAction,
  DEFAULT_RECIPE_MENU_PROPS,
} from '@/types/recipe/menu';
import { getRecipeMenuActions } from './recipe-card-utils';

/**
 * RecipeMenu Component
 *
 * A standalone, reusable contextual menu for recipe-specific actions.
 * This component provides a three-dot menu trigger that displays different
 * actions based on ownership and available handlers.
 *
 * Features:
 * - Uses ui/dropdown as the base component
 * - Displays ownership-based actions (owner vs non-owner)
 * - Supports additional actions: Copy Link and Add to Meal Plan
 * - Replaces menu functionality in QuickActions (QuickActions now handles only icon buttons)
 * - Fully accessible with keyboard navigation
 * - Customizable variants, sizes, and positioning
 *
 * @example
 * ```tsx
 * <RecipeMenu
 *   recipe={recipe}
 *   isOwner={true}
 *   variant="ghost"
 *   size="md"
 *   onView={() => console.log('View')}
 *   onEdit={() => console.log('Edit')}
 *   onDelete={() => console.log('Delete')}
 *   onShare={() => console.log('Share')}
 * />
 * ```
 */
export const RecipeMenu = React.forwardRef<HTMLButtonElement, RecipeMenuProps>(
  (
    {
      recipe: _recipe, // Currently unused but required for future features (e.g., analytics, menu headers)
      isOwner = DEFAULT_RECIPE_MENU_PROPS.isOwner,
      variant = DEFAULT_RECIPE_MENU_PROPS.variant,
      size = DEFAULT_RECIPE_MENU_PROPS.size,
      align = DEFAULT_RECIPE_MENU_PROPS.align,
      side = DEFAULT_RECIPE_MENU_PROPS.side,
      showIcons = DEFAULT_RECIPE_MENU_PROPS.showIcons,
      disabled = DEFAULT_RECIPE_MENU_PROPS.disabled,
      triggerLabel = DEFAULT_RECIPE_MENU_PROPS.triggerLabel,
      className,
      triggerProps,
      contentProps,
      // Action handlers
      onView,
      onEdit,
      onDelete,
      onDuplicate,
      onShare,
      onAddToCollection,
      onCopyLink,
      onAddToMealPlan,
      onReport,
      ...props
    },
    ref
  ) => {
    // Build menu actions based on ownership and available handlers
    const menuActions = React.useMemo<RecipeMenuAction[]>(
      () =>
        getRecipeMenuActions(
          {
            onView,
            onEdit,
            onDuplicate,
            onDelete,
            onShare,
            onAddToCollection,
            onCopyLink,
            onAddToMealPlan,
            onReport,
          },
          isOwner
        ),
      [
        isOwner,
        onView,
        onEdit,
        onDuplicate,
        onDelete,
        onShare,
        onAddToCollection,
        onCopyLink,
        onAddToMealPlan,
        onReport,
      ]
    );

    // Separate actions into groups for visual organization
    const { primaryActions, secondaryActions, destructiveActions } =
      React.useMemo(() => {
        // Primary actions: view, edit, duplicate
        const primary = menuActions.filter(
          action =>
            action.variant === 'default' &&
            ['view', 'edit', 'duplicate'].includes(action.id)
        );

        // Secondary actions: share, add-to-collection, copy-link, add-to-meal-plan
        const secondary = menuActions.filter(
          action =>
            action.variant === 'default' &&
            !['view', 'edit', 'duplicate'].includes(action.id)
        );

        // Destructive actions: delete, report
        const destructive = menuActions.filter(
          action => action.variant === 'destructive'
        );

        return {
          primaryActions: primary,
          secondaryActions: secondary,
          destructiveActions: destructive,
        };
      }, [menuActions]);

    // Don't render if no actions available
    if (menuActions.length === 0) {
      return null;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={ref}
          className={cn(
            recipeMenuTriggerVariants({ variant, size }),
            className
          )}
          disabled={disabled}
          aria-label={triggerLabel}
          {...triggerProps}
          {...props}
        >
          <MoreVertical
            className={cn(recipeMenuIconVariants({ size }))}
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          side={side}
          className="w-56"
          {...contentProps}
        >
          {/* Primary actions group */}
          {primaryActions.length > 0 &&
            primaryActions.map(action => (
              <DropdownMenuItem
                key={action.id}
                onClick={e => {
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={action.disabled}
                className={cn(
                  recipeMenuItemVariants({
                    variant: action.variant,
                    hasIcon: showIcons,
                  })
                )}
              >
                {showIcons && (
                  <action.icon
                    className={cn(recipeMenuIconVariants({ size }))}
                    aria-hidden="true"
                  />
                )}
                <span>{action.label}</span>
                {action.shortcut && (
                  <span className="ml-auto text-xs tracking-widest opacity-60">
                    {action.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            ))}

          {/* Separator between primary and secondary */}
          {primaryActions.length > 0 && secondaryActions.length > 0 && (
            <DropdownMenuSeparator className={recipeMenuSeparatorVariants()} />
          )}

          {/* Secondary actions group */}
          {secondaryActions.length > 0 &&
            secondaryActions.map(action => (
              <DropdownMenuItem
                key={action.id}
                onClick={e => {
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={action.disabled}
                className={cn(
                  recipeMenuItemVariants({
                    variant: action.variant,
                    hasIcon: showIcons,
                  })
                )}
              >
                {showIcons && (
                  <action.icon
                    className={cn(recipeMenuIconVariants({ size }))}
                    aria-hidden="true"
                  />
                )}
                <span>{action.label}</span>
                {action.shortcut && (
                  <span className="ml-auto text-xs tracking-widest opacity-60">
                    {action.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            ))}

          {/* Separator before destructive actions */}
          {(primaryActions.length > 0 || secondaryActions.length > 0) &&
            destructiveActions.length > 0 && (
              <DropdownMenuSeparator
                className={recipeMenuSeparatorVariants()}
              />
            )}

          {/* Destructive actions group */}
          {destructiveActions.length > 0 &&
            destructiveActions.map(action => (
              <DropdownMenuItem
                key={action.id}
                onClick={e => {
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={action.disabled}
                className={cn(
                  recipeMenuItemVariants({
                    variant: action.variant,
                    hasIcon: showIcons,
                  })
                )}
              >
                {showIcons && (
                  <action.icon
                    className={cn(recipeMenuIconVariants({ size }))}
                    aria-hidden="true"
                  />
                )}
                <span>{action.label}</span>
                {action.shortcut && (
                  <span className="ml-auto text-xs tracking-widest opacity-60">
                    {action.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

RecipeMenu.displayName = 'RecipeMenu';

export type { RecipeMenuProps };
