'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio';
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
 * Difficulty level options for radio group
 */
const DIFFICULTY_OPTIONS = [
  {
    id: DifficultyLevel.BEGINNER,
    value: DifficultyLevel.BEGINNER,
    label: 'Beginner',
    description: 'Perfect for first-time cooks',
  },
  {
    id: DifficultyLevel.EASY,
    value: DifficultyLevel.EASY,
    label: 'Easy',
    description: 'Simple recipes with few steps',
  },
  {
    id: DifficultyLevel.MEDIUM,
    value: DifficultyLevel.MEDIUM,
    label: 'Medium',
    description: 'Some cooking experience helpful',
  },
  {
    id: DifficultyLevel.HARD,
    value: DifficultyLevel.HARD,
    label: 'Hard',
    description: 'Advanced techniques required',
  },
  {
    id: DifficultyLevel.EXPERT,
    value: DifficultyLevel.EXPERT,
    label: 'Expert',
    description: 'For professional chefs',
  },
];

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
    setValue,
  } = form;

  const servings = watch('servings') ?? 4;

  if (!isActive) return null;

  const handleServingsChange = (delta: number) => {
    const newValue = Math.max(1, Math.min(100, servings + delta));
    setValue('servings', newValue, { shouldValidate: true });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Timing & Servings</CardTitle>
        <CardDescription>
          Set how many people your recipe serves and how long it takes to make.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Servings */}
        <div className="space-y-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Servings <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleServingsChange(-1)}
              disabled={servings <= 1}
              aria-label="Decrease servings"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Controller
              name="servings"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={100}
                  className="w-20 text-center"
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value)) {
                      field.onChange(Math.max(1, Math.min(100, value)));
                    }
                  }}
                  aria-label="Number of servings"
                />
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleServingsChange(1)}
              disabled={servings >= 100}
              aria-label="Increase servings"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground text-sm">servings</span>
          </div>
          {errors.servings && (
            <p className="text-destructive text-sm">
              {errors.servings.message}
            </p>
          )}
        </div>

        {/* Time Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Prep Time */}
          <div className="space-y-2">
            <Controller
              name="prepTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Prep Time"
                  placeholder="e.g., 15"
                  rightIcon={
                    <span className="text-muted-foreground text-sm">min</span>
                  }
                  min={0}
                  max={1440}
                  value={field.value ?? ''}
                  onChange={e => {
                    const value =
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                  errorText={errors.prepTime?.message}
                  helperText="Time to prepare ingredients"
                />
              )}
            />
          </div>

          {/* Cook Time */}
          <div className="space-y-2">
            <Controller
              name="cookTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Cook Time"
                  placeholder="e.g., 30"
                  rightIcon={
                    <span className="text-muted-foreground text-sm">min</span>
                  }
                  min={0}
                  max={1440}
                  value={field.value ?? ''}
                  onChange={e => {
                    const value =
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value, 10);
                    field.onChange(value);
                  }}
                  errorText={errors.cookTime?.message}
                  helperText="Active cooking time"
                />
              )}
            />
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
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                options={DIFFICULTY_OPTIONS}
                orientation="vertical"
                size="sm"
                error={errors.difficulty?.message}
              />
            )}
          />
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
