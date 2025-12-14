'use client';

import * as React from 'react';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * InstructionStep Props
 */
export interface InstructionStepProps {
  /** Step number */
  stepNumber: number;
  /** Step instruction text */
  instruction: string;
  /** Timer duration in seconds (optional) */
  timerSeconds?: number | null;
  /** Whether this step is completed */
  isCompleted?: boolean;
  /** Callback when step completion is toggled */
  onToggle?: (stepNumber: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format timer seconds into human-readable string
 */
function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  }
  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }
  return `${minutes} min ${remainingSeconds} sec`;
}

/**
 * InstructionStep Component
 *
 * Displays a single instruction step with a completion checkbox
 * and optional timer indicator.
 */
export const InstructionStep = React.forwardRef<
  HTMLLIElement,
  InstructionStepProps
>(function InstructionStep(
  {
    stepNumber,
    instruction,
    timerSeconds,
    isCompleted = false,
    onToggle,
    className,
  },
  ref
) {
  const handleToggle = React.useCallback(() => {
    onToggle?.(stepNumber);
  }, [stepNumber, onToggle]);

  return (
    <li
      ref={ref}
      className={cn(
        'flex gap-4 rounded-lg border p-4 transition-colors',
        isCompleted && 'bg-muted/50',
        className
      )}
      data-testid="instruction-step"
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors',
          isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary'
        )}
        aria-label={
          isCompleted
            ? `Mark step ${stepNumber} as incomplete`
            : `Mark step ${stepNumber} as complete`
        }
        aria-pressed={isCompleted}
        data-testid="step-toggle"
      >
        {isCompleted ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          stepNumber
        )}
      </button>

      <div className="flex-1">
        <p
          className={cn(isCompleted && 'text-muted-foreground line-through')}
          data-testid="step-instruction"
        >
          {instruction}
        </p>

        {timerSeconds && timerSeconds > 0 && (
          <div
            className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm"
            data-testid="step-timer"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        )}
      </div>
    </li>
  );
});

InstructionStep.displayName = 'InstructionStep';
