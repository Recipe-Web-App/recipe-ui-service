'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * IngredientItem Props
 */
export interface IngredientItemProps {
  /** Unique ingredient ID */
  ingredientId: number;
  /** Ingredient name */
  name: string;
  /** Quantity (already scaled) */
  quantity: string;
  /** Unit of measurement */
  unit: string;
  /** Whether the ingredient is optional */
  isOptional?: boolean;
  /** Whether the ingredient is checked/acquired */
  isChecked?: boolean;
  /** Callback when checkbox is toggled */
  onToggle?: (ingredientId: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * IngredientItem Component
 *
 * Displays a single ingredient with a checkbox to mark it as acquired.
 * Supports scaling and optional ingredient markers.
 */
export const IngredientItem = React.forwardRef<
  HTMLLIElement,
  IngredientItemProps
>(function IngredientItem(
  {
    ingredientId,
    name,
    quantity,
    unit,
    isOptional = false,
    isChecked = false,
    onToggle,
    className,
  },
  ref
) {
  const handleClick = React.useCallback(() => {
    onToggle?.(ingredientId);
  }, [ingredientId, onToggle]);

  return (
    <li ref={ref} className={className} data-testid="ingredient-item">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'hover:bg-muted/50 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
          isChecked && 'text-muted-foreground line-through'
        )}
        aria-pressed={isChecked}
        data-testid="ingredient-button"
      >
        <div
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
            isChecked
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-input'
          )}
          aria-hidden="true"
          data-testid="ingredient-checkbox"
        >
          {isChecked && <Check className="h-3 w-3" />}
        </div>
        <span data-testid="ingredient-text">
          <strong>{quantity}</strong> {unit} {name}
          {isOptional && (
            <span
              className="text-muted-foreground"
              data-testid="optional-marker"
            >
              {' '}
              (optional)
            </span>
          )}
        </span>
      </button>
    </li>
  );
});

IngredientItem.displayName = 'IngredientItem';
