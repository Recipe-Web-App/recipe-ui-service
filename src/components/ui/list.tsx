import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  listVariants,
  listItemVariants,
  listItemContentVariants,
  listItemTitleVariants,
  listItemDescriptionVariants,
  listItemIconVariants,
  recipeListVariants,
} from '@/lib/ui/list-variants';
import type {
  ListProps,
  ListItemProps,
  ListItemContentProps,
  ListItemTitleProps,
  ListItemDescriptionProps,
  ListItemIconProps,
  CheckboxListItemProps,
  RecipeListProps,
  IngredientListItemProps,
  InstructionListItemProps,
  NutritionListItemProps,
} from '@/types/ui/list';

// Create list context for compound components
const ListContext = React.createContext<{
  variant?: ListProps['variant'];
  size?: ListProps['size'];
  density?: ListProps['density'];
}>({});

/**
 * List Component
 *
 * A flexible, accessible list component built with Tailwind CSS and
 * class-variance-authority for type-safe variants.
 *
 * Features:
 * - Multiple variants (default, bordered, divided, card, inline, grid)
 * - Multiple sizes and densities
 * - Recipe-specific functionality
 * - Full keyboard accessibility
 * - Support for ordered and unordered lists
 * - Polymorphic component support (asChild prop)
 */
const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  (
    {
      className,
      variant,
      size,
      density,
      gridCols,
      asChild = false,
      ordered = false,
      children,
      role = 'list',
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({ variant, size, density }),
      [variant, size, density]
    );

    if (asChild) {
      return (
        <ListContext.Provider value={contextValue}>
          <Slot
            className={cn(
              listVariants({ variant, size, density, gridCols, className })
            )}
            ref={ref}
            role={role}
            {...props}
          >
            {React.Children.only(children)}
          </Slot>
        </ListContext.Provider>
      );
    }

    const Element = ordered ? 'ol' : 'ul';

    return (
      <ListContext.Provider value={contextValue}>
        <Element
          className={cn(
            listVariants({ variant, size, density, gridCols, className })
          )}
          ref={ref as React.ForwardedRef<HTMLUListElement & HTMLOListElement>}
          role={role}
          {...props}
        >
          {children}
        </Element>
      </ListContext.Provider>
    );
  }
);

List.displayName = 'List';

/**
 * ListItem Component
 *
 * Individual list item component with support for interactive states,
 * accessibility, and flexible content layout.
 */
const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      asChild = false,
      selected = false,
      disabled = false,
      loading = false,
      children,
      onSelect,
      role = 'listitem',
      'aria-disabled': ariaDisabled,
      onClick,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ListContext);
    const isInteractive = Boolean(onSelect) || variant === 'interactive';
    const computedSize = size ?? context.size;

    // Handle click events
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        if (disabled || loading) return;
        onClick?.(event);
        onSelect?.();
      },
      [disabled, loading, onClick, onSelect]
    );

    // Handle keyboard events
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLLIElement>) => {
        if (disabled || loading) return;
        onKeyDown?.(event);

        if ((event.key === 'Enter' || event.key === ' ') && onSelect) {
          event.preventDefault();
          onSelect();
        }
      },
      [disabled, loading, onKeyDown, onSelect]
    );

    // Compute variant based on state
    const computedVariant = React.useMemo(() => {
      if (disabled) return 'disabled';
      if (selected) return 'selected';
      return variant;
    }, [variant, selected, disabled]);

    // Compute ARIA and interaction props
    const interactionProps = isInteractive
      ? {
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          tabIndex: disabled ? -1 : (tabIndex ?? 0),
          'aria-disabled': ariaDisabled ?? disabled,
          role,
        }
      : {
          'aria-disabled': ariaDisabled ?? disabled,
          role,
        };

    if (asChild) {
      return (
        <Slot
          className={cn(
            listItemVariants({
              variant: computedVariant,
              size: computedSize,
              alignment,
              className,
            })
          )}
          ref={ref}
          {...interactionProps}
          {...props}
        >
          {React.Children.only(children)}
        </Slot>
      );
    }

    return (
      <li
        className={cn(
          listItemVariants({
            variant: computedVariant,
            size: computedSize,
            alignment,
            className,
          })
        )}
        ref={ref}
        {...interactionProps}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

/**
 * ListItemContent Component
 *
 * Container for list item content with proper layout
 */
const ListItemContent = React.forwardRef<HTMLDivElement, ListItemContentProps>(
  ({ className, alignment, children, ...props }, ref) => {
    return (
      <div
        className={cn(listItemContentVariants({ alignment, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ListItemContent.displayName = 'ListItemContent';

/**
 * ListItemTitle Component
 *
 * Title/heading for list items with semantic markup
 */
const ListItemTitle = React.forwardRef<HTMLHeadingElement, ListItemTitleProps>(
  (
    { className, size, truncate, as: Element = 'div', children, ...props },
    ref
  ) => {
    return (
      <Element
        className={cn(listItemTitleVariants({ size, truncate, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

ListItemTitle.displayName = 'ListItemTitle';

/**
 * ListItemDescription Component
 *
 * Description/subtitle for list items
 */
const ListItemDescription = React.forwardRef<
  HTMLParagraphElement,
  ListItemDescriptionProps
>(
  (
    { className, size, truncate, lines, as: Element = 'p', children, ...props },
    ref
  ) => {
    return (
      <Element
        className={cn(
          listItemDescriptionVariants({ size, truncate, lines, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

ListItemDescription.displayName = 'ListItemDescription';

/**
 * ListItemIcon Component
 *
 * Icon container for list items with proper positioning
 */
const ListItemIcon = React.forwardRef<HTMLSpanElement, ListItemIconProps>(
  (
    {
      className,
      position,
      size,
      variant,
      icon,
      children,
      'aria-hidden': ariaHidden = true,
      ...props
    },
    ref
  ) => {
    return (
      <span
        className={cn(
          listItemIconVariants({ position, size, variant, className })
        )}
        ref={ref}
        aria-hidden={ariaHidden}
        {...props}
      >
        {icon ?? children}
      </span>
    );
  }
);

ListItemIcon.displayName = 'ListItemIcon';

/**
 * CheckboxListItem Component
 *
 * List item with integrated checkbox functionality
 */
const CheckboxListItem = React.forwardRef<HTMLLIElement, CheckboxListItemProps>(
  (
    {
      className,
      checked = false,
      indeterminate = false,
      onCheckedChange,
      checkboxId,
      label,
      description,
      value,
      disabled = false,
      children = null,
      ...props
    },
    ref
  ) => {
    const handleChange = React.useCallback(() => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    }, [checked, disabled, onCheckedChange]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === ' ') {
          event.preventDefault();
          handleChange();
        }
      },
      [handleChange]
    );

    return (
      <ListItem
        ref={ref}
        className={className}
        variant={checked ? 'selected' : 'interactive'}
        disabled={disabled}
        onSelect={handleChange}
        onKeyDown={handleKeyDown}
        role="listitem"
        {...props}
      >
        <ListItemIcon
          size="md"
          variant={checked ? 'primary' : 'muted'}
          position="leading"
        >
          <div
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border-2 transition-colors',
              checked || indeterminate
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground',
              disabled && 'opacity-50'
            )}
          >
            {indeterminate ? (
              <Minus className="h-3 w-3" />
            ) : checked ? (
              <Check className="h-3 w-3" />
            ) : null}
          </div>
        </ListItemIcon>
        <ListItemContent>
          <ListItemTitle>{label}</ListItemTitle>
          {description && (
            <ListItemDescription size="sm">{description}</ListItemDescription>
          )}
          {children}
        </ListItemContent>
        <input
          type="checkbox"
          id={checkboxId}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </ListItem>
    );
  }
);

CheckboxListItem.displayName = 'CheckboxListItem';

/**
 * RecipeList Component
 *
 * Recipe-specific list with specialized styling
 */
const RecipeList = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  RecipeListProps
>(
  (
    { className, variant, context, numbered, checkable, children, ...props },
    ref
  ) => {
    return (
      <List
        className={cn(
          recipeListVariants({ context, numbered, checkable }),
          className
        )}
        variant={variant}
        ref={ref}
        {...props}
      >
        {children}
      </List>
    );
  }
);

RecipeList.displayName = 'RecipeList';

/**
 * IngredientListItem Component
 *
 * Specialized list item for recipe ingredients
 */
const IngredientListItem = React.forwardRef<
  HTMLLIElement,
  IngredientListItemProps
>(
  (
    {
      className,
      ingredient,
      showQuantity = true,
      allowChecking = false,
      onToggleCheck,
      context: _context = 'display',
      ...props
    },
    ref
  ) => {
    const handleToggle = React.useCallback(() => {
      if (allowChecking && onToggleCheck) {
        onToggleCheck(ingredient.id);
      }
    }, [allowChecking, onToggleCheck, ingredient.id]);

    return (
      <ListItem
        ref={ref}
        className={cn(
          'relative',
          ingredient.checked && 'line-through opacity-60',
          className
        )}
        variant={allowChecking ? 'interactive' : 'default'}
        onSelect={allowChecking ? handleToggle : undefined}
        data-checked={ingredient.checked}
        {...props}
      >
        {allowChecking && (
          <ListItemIcon
            size="sm"
            variant={ingredient.checked ? 'success' : 'muted'}
            position="leading"
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border-2 transition-colors',
                ingredient.checked
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-muted-foreground'
              )}
            >
              {ingredient.checked && <Check className="h-3 w-3" />}
            </div>
          </ListItemIcon>
        )}
        <ListItemContent>
          <div className="flex items-baseline gap-2">
            {showQuantity && (ingredient.quantity ?? ingredient.unit) && (
              <span className="text-muted-foreground text-sm font-medium">
                {ingredient.quantity}
                {ingredient.unit && ` ${ingredient.unit}`}
              </span>
            )}
            <ListItemTitle className="flex-1">
              {ingredient.name}
              {ingredient.optional && (
                <span className="text-muted-foreground ml-1 text-sm italic">
                  (optional)
                </span>
              )}
            </ListItemTitle>
          </div>
        </ListItemContent>
      </ListItem>
    );
  }
);

IngredientListItem.displayName = 'IngredientListItem';

/**
 * InstructionListItem Component
 *
 * Specialized list item for recipe instructions
 */
const InstructionListItem = React.forwardRef<
  HTMLLIElement,
  InstructionListItemProps
>(
  (
    {
      className,
      instruction,
      showDuration = true,
      allowChecking = false,
      onToggleComplete,
      context = 'display',
      ...props
    },
    ref
  ) => {
    const handleToggle = React.useCallback(() => {
      if (allowChecking && onToggleComplete) {
        onToggleComplete(instruction.id);
      }
    }, [allowChecking, onToggleComplete, instruction.id]);

    return (
      <ListItem
        ref={ref}
        className={cn(
          'relative',
          instruction.completed && context === 'cooking' && 'opacity-60',
          className
        )}
        variant={allowChecking ? 'interactive' : 'default'}
        onSelect={allowChecking ? handleToggle : undefined}
        data-completed={instruction.completed}
        {...props}
      >
        {allowChecking && (
          <ListItemIcon
            size="sm"
            variant={instruction.completed ? 'success' : 'muted'}
            position="leading"
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded border-2 transition-colors',
                instruction.completed
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-muted-foreground'
              )}
            >
              {instruction.completed && <Check className="h-3 w-3" />}
            </div>
          </ListItemIcon>
        )}
        <ListItemContent>
          <ListItemTitle>{instruction.text}</ListItemTitle>
          {showDuration &&
            (instruction.duration ?? instruction.temperature) && (
              <ListItemDescription size="sm">
                {instruction.duration && `Duration: ${instruction.duration}`}
                {instruction.duration && instruction.temperature && ' • '}
                {instruction.temperature &&
                  `Temperature: ${instruction.temperature}`}
              </ListItemDescription>
            )}
        </ListItemContent>
      </ListItem>
    );
  }
);

InstructionListItem.displayName = 'InstructionListItem';

/**
 * NutritionListItem Component
 *
 * Specialized list item for nutrition information
 */
const NutritionListItem = React.forwardRef<
  HTMLLIElement,
  NutritionListItemProps
>(
  (
    { className, nutrition, showDailyValue = true, showUnit = true, ...props },
    ref
  ) => {
    return (
      <ListItem
        ref={ref}
        className={cn('grid grid-cols-[1fr_auto] gap-4', className)}
        {...props}
      >
        <ListItemContent>
          <ListItemTitle size="sm">{nutrition.label}</ListItemTitle>
        </ListItemContent>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            {nutrition.value}
            {showUnit && nutrition.unit && nutrition.unit}
          </span>
          {showDailyValue && nutrition.dailyValue && (
            <span className="text-muted-foreground">
              ({nutrition.dailyValue}% DV)
            </span>
          )}
        </div>
      </ListItem>
    );
  }
);

NutritionListItem.displayName = 'NutritionListItem';

// Export all components
export {
  List,
  ListItem,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemIcon,
  CheckboxListItem,
  RecipeList,
  IngredientListItem,
  InstructionListItem,
  NutritionListItem,
};

export type {
  ListProps,
  ListItemProps,
  ListItemContentProps,
  ListItemTitleProps,
  ListItemDescriptionProps,
  ListItemIconProps,
  CheckboxListItemProps,
  RecipeListProps,
  IngredientListItemProps,
  InstructionListItemProps,
  NutritionListItemProps,
};
