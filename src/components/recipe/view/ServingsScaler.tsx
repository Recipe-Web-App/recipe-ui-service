'use client';

import * as React from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * ServingsScaler Props
 */
export interface ServingsScalerProps {
  /** Current scaled servings value */
  value: number;
  /** Callback when servings value changes */
  onChange: (newValue: number) => void;
  /** Minimum allowed servings (default: 1) */
  min?: number;
  /** Maximum allowed servings (default: 100) */
  max?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ServingsScaler Component
 *
 * Allows users to adjust the number of servings for a recipe,
 * which triggers ingredient quantity scaling.
 */
export const ServingsScaler = React.forwardRef<
  HTMLDivElement,
  ServingsScalerProps
>(function ServingsScaler(
  { value, onChange, min = 1, max = 100, className },
  ref
) {
  const handleDecrease = React.useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleIncrease = React.useCallback(() => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 rounded-lg border p-3', className)}
      data-testid="servings-scaler"
    >
      <Users className="text-muted-foreground h-5 w-5" aria-hidden="true" />
      <span className="text-sm" id="servings-label">
        Servings
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrease}
          disabled={value <= min}
          aria-label="Decrease servings"
          data-testid="decrease-button"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span
          className="w-8 text-center font-medium"
          aria-live="polite"
          aria-labelledby="servings-label"
          data-testid="servings-value"
        >
          {value}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrease}
          disabled={value >= max}
          aria-label="Increase servings"
          data-testid="increase-button"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
});

ServingsScaler.displayName = 'ServingsScaler';
