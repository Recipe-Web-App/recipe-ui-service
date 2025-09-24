import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  chipVariants,
  chipDeleteVariants,
  chipIconVariants,
  chipAvatarVariants,
} from '@/lib/ui/chip-variants';
import type {
  ChipProps,
  ChipGroupProps,
  ChipInputProps,
  RecipeChipProps,
} from '@/types/ui/chip.types';

/**
 * Chip Component
 *
 * An interactive tag component that extends badge functionality with:
 * - Delete/remove actions
 * - Selectable states for filtering
 * - Icon and avatar support
 * - Full keyboard navigation
 * - Smooth animations
 *
 * Perfect for managing recipe ingredients, dietary restrictions, and dynamic tags.
 *
 * @example
 * ```tsx
 * // Basic chip
 * <Chip>Ingredient</Chip>
 *
 * // Deletable chip
 * <Chip onDelete={() => handleDelete()}>Tomato</Chip>
 *
 * // Selectable chip
 * <Chip
 *   selected={isSelected}
 *   onClick={() => toggleSelection()}
 * >
 *   Vegetarian
 * </Chip>
 *
 * // Chip with icon
 * <Chip icon={<Clock />} onDelete={() => {}}>
 *   30 min
 * </Chip>
 * ```
 */
const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      color,
      children,
      onClick,
      onDelete,
      selected,
      disabled,
      icon,
      avatar,
      deleteIcon,
      deleteLabel = 'Remove',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isClickable = Boolean(onClick) && !disabled;
    const isDeletable = Boolean(onDelete) && !disabled;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && onClick) {
        onClick(event);
      }
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (!disabled && onDelete) {
        onDelete(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }

      if (
        isDeletable &&
        (event.key === 'Delete' || event.key === 'Backspace')
      ) {
        event.preventDefault();
        onDelete?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    const chipContent = (
      <>
        {avatar && (
          <span className={cn(chipAvatarVariants({ size }))}>{avatar}</span>
        )}
        {icon && !avatar && (
          <span className={cn(chipIconVariants({ size }))}>{icon}</span>
        )}
        <span className="truncate">{children}</span>
        {isDeletable && (
          <button
            type="button"
            onClick={handleDelete}
            className={cn(chipDeleteVariants({ size }))}
            aria-label={deleteLabel}
            disabled={disabled}
            tabIndex={-1}
          >
            {deleteIcon ?? <X className="h-full w-full" />}
          </button>
        )}
      </>
    );

    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          chipVariants({
            variant,
            size,
            color,
            clickable: isClickable,
            selected,
            className,
          })
        )}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable || isDeletable ? handleKeyDown : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable || isDeletable ? 0 : undefined}
        aria-pressed={isClickable && selected ? selected : undefined}
        aria-disabled={disabled}
        data-selected={selected}
        data-disabled={disabled}
        {...props}
      >
        {chipContent}
      </Component>
    );
  }
);

Chip.displayName = 'Chip';

/**
 * ChipGroup Component
 *
 * Container for organizing multiple chips with consistent spacing.
 *
 * @example
 * ```tsx
 * <ChipGroup maxDisplay={5}>
 *   <Chip>Tag 1</Chip>
 *   <Chip>Tag 2</Chip>
 *   <Chip>Tag 3</Chip>
 * </ChipGroup>
 * ```
 */
const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ children, maxDisplay, spacing = 'normal', className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const displayedChildren = maxDisplay
      ? childrenArray.slice(0, maxDisplay)
      : childrenArray;
    const hiddenCount =
      maxDisplay && maxDisplay > 0
        ? Math.max(0, childrenArray.length - maxDisplay)
        : 0;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center',
          spacing === 'tight'
            ? 'gap-1'
            : spacing === 'loose'
              ? 'gap-3'
              : 'gap-2',
          className
        )}
        {...props}
      >
        {displayedChildren}
        {hiddenCount > 0 && (
          <Chip variant="outlined" size="sm" className="opacity-70">
            +{hiddenCount} more
          </Chip>
        )}
      </div>
    );
  }
);

ChipGroup.displayName = 'ChipGroup';

/**
 * ChipInput Component
 *
 * Interactive input for adding and managing chips dynamically.
 *
 * @example
 * ```tsx
 * <ChipInput
 *   value={ingredients}
 *   onChange={setIngredients}
 *   placeholder="Add ingredient..."
 *   maxChips={10}
 * />
 * ```
 */
const ChipInput = React.forwardRef<HTMLDivElement, ChipInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Add item...',
      maxChips,
      disabled,
      validate,
      suggestions,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleAddChip = (text: string) => {
      const trimmedText = text.trim();

      if (!trimmedText) return;

      if (maxChips && value.length >= maxChips) {
        setError(`Maximum ${maxChips} items allowed`);
        return;
      }

      if (value.includes(trimmedText)) {
        setError('Item already exists');
        return;
      }

      if (validate) {
        const validationResult = validate(trimmedText);
        if (typeof validationResult === 'string') {
          setError(validationResult);
          return;
        }
        if (!validationResult) {
          setError('Invalid input');
          return;
        }
      }

      onChange([...value, trimmedText]);
      setInputValue('');
      setError(null);
    };

    const handleRemoveChip = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAddChip(inputValue);
      }

      if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
        handleRemoveChip(value.length - 1);
      }
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div
          className={cn(
            'border-input bg-background flex min-h-[2.5rem] flex-wrap items-center gap-2 rounded-md border px-3 py-2',
            'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => inputRef.current?.focus()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.focus();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {value.map((chip, index) => (
            <Chip
              key={`${chip}-${index}`}
              size="sm"
              variant="outlined"
              onDelete={() => handleRemoveChip(index)}
              disabled={disabled}
            >
              {chip}
            </Chip>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setError(null);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled ?? (maxChips ? value.length >= maxChips : false)}
            className={cn(
              'placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent outline-none',
              'disabled:cursor-not-allowed'
            )}
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {suggestions && suggestions.length > 0 && inputValue && (
          <div className="border-input bg-popover rounded-md border p-1">
            {suggestions
              .filter(
                s =>
                  s.toLowerCase().includes(inputValue.toLowerCase()) &&
                  !value.includes(s)
              )
              .slice(0, 5)
              .map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddChip(suggestion)}
                  className="hover:bg-accent hover:text-accent-foreground w-full rounded px-2 py-1 text-left text-sm"
                  disabled={disabled}
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  }
);

ChipInput.displayName = 'ChipInput';

/**
 * RecipeChip Component
 *
 * Context-aware chip with automatic styling based on recipe use case.
 *
 * @example
 * ```tsx
 * <RecipeChip context="ingredient" onDelete={handleDelete}>
 *   Tomato
 * </RecipeChip>
 *
 * <RecipeChip context="dietary" selected showIcon>
 *   Vegetarian
 * </RecipeChip>
 * ```
 */
const RecipeChip = React.forwardRef<HTMLDivElement, RecipeChipProps>(
  ({ context, children, ...props }, ref) => {
    const getContextConfig = (ctx: string) => {
      switch (ctx) {
        case 'ingredient':
          return { variant: 'filled' as const, color: 'default' as const };
        case 'dietary':
          return { variant: 'outlined' as const, color: 'success' as const };
        case 'category':
          return { variant: 'filled' as const, color: 'info' as const };
        case 'filter':
          return { variant: 'outlined' as const, color: 'primary' as const };
        case 'step':
          return { variant: 'filled' as const, color: 'secondary' as const };
        case 'quantity':
          return { variant: 'filled' as const, color: 'warning' as const };
        default:
          return { variant: 'outlined' as const, color: 'default' as const };
      }
    };

    const config = getContextConfig(context);

    return (
      <Chip ref={ref} variant={config.variant} color={config.color} {...props}>
        {children}
      </Chip>
    );
  }
);

RecipeChip.displayName = 'RecipeChip';

export { Chip, ChipGroup, ChipInput, RecipeChip };
