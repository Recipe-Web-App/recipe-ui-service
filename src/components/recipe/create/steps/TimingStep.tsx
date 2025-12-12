'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { StepComponentProps } from '@/types/recipe/create-recipe-wizard';

/**
 * Difficulty level options for segmented control
 */
const DIFFICULTY_OPTIONS = [
  {
    id: DifficultyLevel.BEGINNER,
    value: DifficultyLevel.BEGINNER,
    label: 'Beginner',
  },
  { id: DifficultyLevel.EASY, value: DifficultyLevel.EASY, label: 'Easy' },
  {
    id: DifficultyLevel.MEDIUM,
    value: DifficultyLevel.MEDIUM,
    label: 'Medium',
  },
  { id: DifficultyLevel.HARD, value: DifficultyLevel.HARD, label: 'Hard' },
  {
    id: DifficultyLevel.EXPERT,
    value: DifficultyLevel.EXPERT,
    label: 'Expert',
  },
];

/**
 * Get hours component from total minutes
 */
function getHoursFromMinutes(totalMinutes: number | undefined): string {
  if (totalMinutes === undefined || totalMinutes === 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  return hours > 0 ? String(hours) : '';
}

/**
 * Get minutes remainder from total minutes
 */
function getMinutesRemainder(totalMinutes: number | undefined): string {
  if (totalMinutes === undefined) return '';
  const mins = totalMinutes % 60;
  // Show minutes if there are any, or if there are no hours but total is 0
  if (mins > 0) return String(mins);
  if (totalMinutes > 0 && totalMinutes % 60 === 0) return '';
  return '';
}

/**
 * Combine hours and minutes strings into total minutes
 */
function combineToMinutes(hours: string, minutes: string): number | undefined {
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  if (h === 0 && m === 0) return undefined;
  return h * 60 + m;
}

/**
 * Convert servings number to string for display
 */
function getServingsDisplay(servings: number | undefined): string {
  if (servings === undefined) return '';
  return String(servings);
}

/**
 * Parse servings string to number
 */
function parseServings(value: string): number | undefined {
  if (value === '') return undefined;
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}

/**
 * TimingStep Component
 *
 * Second step of the recipe creation wizard.
 * Captures servings, prep time, cook time, and difficulty level.
 */
export function TimingStep({ form, isActive }: StepComponentProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = form;

  if (!isActive) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Timing & Servings</CardTitle>
        <CardDescription>
          Set how many people your recipe serves and how long it takes to make.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Servings & Time Inputs */}
        <div className="grid gap-4 sm:grid-cols-5">
          {/* Servings */}
          <div className="sm:border-border space-y-2 sm:border-r sm:pr-4">
            <Controller
              name="servings"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  label="Servings"
                  placeholder="e.g., 4"
                  required
                  min={1}
                  max={100}
                  value={getServingsDisplay(field.value)}
                  onChange={e => {
                    field.onChange(parseServings(e.target.value));
                  }}
                  onBlur={field.onBlur}
                  errorText={errors.servings?.message}
                  helperText="Number of portions"
                  aria-label="Servings"
                />
              )}
            />
          </div>

          {/* Prep Time - spans 2 columns */}
          <div className="sm:border-border space-y-2 sm:col-span-2 sm:border-r sm:pr-4">
            <label className="text-sm leading-none font-medium">
              Prep Time <span className="text-destructive">*</span>
            </label>
            <Controller
              name="prepTime"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">hr</span>
                    }
                    min={0}
                    max={24}
                    value={getHoursFromMinutes(field.value)}
                    onChange={e => {
                      const hours = e.target.value;
                      const currentMins = getMinutesRemainder(field.value);
                      field.onChange(combineToMinutes(hours, currentMins));
                    }}
                    aria-label="Prep time hours"
                  />
                  <Input
                    type="number"
                    placeholder="0"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">min</span>
                    }
                    min={0}
                    max={59}
                    value={getMinutesRemainder(field.value)}
                    onChange={e => {
                      const minutes = e.target.value;
                      const currentHours = getHoursFromMinutes(field.value);
                      field.onChange(combineToMinutes(currentHours, minutes));
                    }}
                    aria-label="Prep time minutes"
                  />
                </div>
              )}
            />
            {errors.prepTime && (
              <p className="text-destructive text-sm">
                {errors.prepTime.message}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Time to prepare ingredients
            </p>
          </div>

          {/* Cook Time - spans 2 columns */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm leading-none font-medium">
              Cook Time <span className="text-destructive">*</span>
            </label>
            <Controller
              name="cookTime"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">hr</span>
                    }
                    min={0}
                    max={24}
                    value={getHoursFromMinutes(field.value)}
                    onChange={e => {
                      const hours = e.target.value;
                      const currentMins = getMinutesRemainder(field.value);
                      field.onChange(combineToMinutes(hours, currentMins));
                    }}
                    aria-label="Cook time hours"
                  />
                  <Input
                    type="number"
                    placeholder="0"
                    rightIcon={
                      <span className="text-muted-foreground text-sm">min</span>
                    }
                    min={0}
                    max={59}
                    value={getMinutesRemainder(field.value)}
                    onChange={e => {
                      const minutes = e.target.value;
                      const currentHours = getHoursFromMinutes(field.value);
                      field.onChange(combineToMinutes(currentHours, minutes));
                    }}
                    aria-label="Cook time minutes"
                  />
                </div>
              )}
            />
            {errors.cookTime && (
              <p className="text-destructive text-sm">
                {errors.cookTime.message}
              </p>
            )}
            <p className="text-muted-foreground text-sm">Active cooking time</p>
          </div>
        </div>

        {/* Total Time Display */}
        {(watch('prepTime') ?? watch('cookTime')) && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>Total Time:</strong>{' '}
              {formatTime((watch('prepTime') ?? 0) + (watch('cookTime') ?? 0))}
            </p>
          </div>
        )}

        {/* Difficulty Level */}
        <div className="space-y-3">
          <label className="text-sm leading-none font-medium">
            Difficulty Level
          </label>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="Difficulty level"
                className="border-border inline-flex rounded-md border"
              >
                {DIFFICULTY_OPTIONS.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      index === 0 && 'rounded-l-md',
                      index === DIFFICULTY_OPTIONS.length - 1 && 'rounded-r-md',
                      index !== DIFFICULTY_OPTIONS.length - 1 &&
                        'border-border border-r',
                      field.value === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.difficulty && (
            <p className="text-destructive text-sm">
              {errors.difficulty.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Format minutes to a readable time string
 */
function formatTime(minutes: number): string {
  if (minutes === 0) return '0 minutes';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${hours} hour${hours === 1 ? '' : 's'} ${mins} minute${mins === 1 ? '' : 's'}`;
}

TimingStep.displayName = 'TimingStep';
