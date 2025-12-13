'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { StepComponentProps } from '@/types/recipe/create-recipe-wizard';

/**
 * BasicInfoStep Component
 *
 * First step of the recipe creation wizard.
 * Captures the recipe title and description.
 */
export function BasicInfoStep({ form, isActive }: StepComponentProps) {
  const {
    register,
    formState: { errors },
  } = form;

  if (!isActive) return null;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>
          Give your recipe a name and describe what makes it special.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Recipe Title */}
        <div className="space-y-2">
          <Input
            id="title"
            label="Recipe Title"
            placeholder="e.g., Grandma's Famous Apple Pie"
            required
            {...register('title')}
            errorText={errors.title?.message}
            helperText="A descriptive title helps others find your recipe"
          />
        </div>

        {/* Recipe Description */}
        <div className="space-y-2">
          <Textarea
            id="description"
            label="Description"
            placeholder="Tell us about this recipe - what inspired it, what makes it unique, or any tips for success..."
            required
            {...register('description')}
            errorMessage={errors.description?.message}
            maxLength={2000}
            rows={4}
            autoResize
            helperText="Share the story behind your recipe"
          />
        </div>
      </CardContent>
    </Card>
  );
}

BasicInfoStep.displayName = 'BasicInfoStep';
