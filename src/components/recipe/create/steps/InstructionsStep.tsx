'use client';

import * as React from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Controller, useFieldArray, type FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  SortableList,
  SortableItem,
  SortableItemContent,
  SortableItemActions,
} from '@/components/ui/sortable-list';
import {
  createEmptyInstruction,
  type CreateRecipeFormData,
  type InstructionFormData,
  type StepComponentProps,
} from '@/types/recipe/create-recipe-wizard';

/**
 * Type for individual instruction field errors
 */
interface InstructionFieldError {
  instruction?: { message?: string };
  duration?: { message?: string };
}

/**
 * Safely get instruction error message at a specific index
 * Uses Array.prototype.at() to avoid object injection warnings
 */
function getInstructionError(
  errors: FieldErrors<CreateRecipeFormData>,
  index: number,
  field: 'instruction' | 'duration'
): string | undefined {
  const stepErrors = errors.steps;
  if (!stepErrors || !Array.isArray(stepErrors)) return undefined;
  const stepError = stepErrors.at(index) as InstructionFieldError | undefined;
  if (!stepError) return undefined;
  switch (field) {
    case 'instruction':
      return stepError.instruction?.message;
    case 'duration':
      return stepError.duration?.message;
    default:
      return undefined;
  }
}

/**
 * InstructionsStep Component
 *
 * Fourth step of the recipe creation wizard.
 * Manages a dynamic, sortable list of cooking instructions.
 */
export function InstructionsStep({ form, isActive }: StepComponentProps) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const steps = watch('steps');

  if (!isActive) return null;

  const handleAddStep = () => {
    append(createEmptyInstruction(fields.length + 1));
  };

  const handleRemoveStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Renumber remaining steps
      const updatedSteps = steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          stepNumber: i + 1,
        }));
      setValue('steps', updatedSteps, { shouldValidate: true });
    }
  };

  const handleReorder = (reorderedItems: InstructionFormData[]) => {
    // Update step numbers based on new order
    const updatedSteps = reorderedItems.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setValue('steps', updatedSteps, { shouldValidate: true });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Instructions</CardTitle>
        <CardDescription>
          Add step-by-step instructions for preparing your recipe. Drag to
          reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {/* Instructions List */}
        <SortableList
          items={steps}
          onReorder={handleReorder}
          keyExtractor={item => item.id}
          emptyMessage="Add your first instruction"
          aria-label="Recipe instructions list"
          renderItem={(item, index) => (
            <SortableItem
              id={item.id}
              key={item.id}
              showDragHandle
              variant="default"
              size="md"
            >
              <SortableItemContent
                layout="column"
                alignment="start"
                className="flex-1 gap-3"
              >
                {/* Step Header */}
                <div className="flex w-full items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">
                    Step {index + 1}
                  </Badge>

                  {/* Duration (optional) */}
                  <div className="ml-auto flex items-center gap-1">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <Controller
                      name={`steps.${index}.duration` as const}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="min"
                          size="sm"
                          className="w-16"
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
                          aria-label={`Step ${index + 1} duration in minutes`}
                        />
                      )}
                    />
                    <span className="text-muted-foreground text-xs">min</span>
                  </div>
                </div>

                {/* Instruction Text */}
                <Controller
                  name={`steps.${index}.instruction` as const}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder={`Describe step ${index + 1} in detail...`}
                      rows={3}
                      autoResize
                      showCharacterCount
                      maxLength={1000}
                      errorMessage={getInstructionError(
                        errors,
                        index,
                        'instruction'
                      )}
                      aria-label={`Step ${index + 1} instruction`}
                      className="w-full"
                    />
                  )}
                />
              </SortableItemContent>

              <SortableItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStep(index)}
                  disabled={fields.length <= 1}
                  aria-label={`Remove step ${index + 1}`}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </SortableItemActions>
            </SortableItem>
          )}
        />

        {/* Step-level error */}
        {errors.steps?.message && (
          <p className="text-destructive text-sm">{errors.steps.message}</p>
        )}

        {/* Add Step Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddStep}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>

        {/* Helper text */}
        <p className="text-muted-foreground text-sm">
          Tip: Write clear, concise instructions. Include temperatures, times,
          and visual cues (e.g., &quot;until golden brown&quot;).
        </p>
      </CardContent>
    </Card>
  );
}

InstructionsStep.displayName = 'InstructionsStep';
