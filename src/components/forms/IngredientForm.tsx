import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput, FormSelect, FormCheckbox, FormErrors } from './FormField';
import {
  useCreateIngredientForm,
  useEditIngredientForm,
} from '@/hooks/forms/useIngredientForm';
import type {
  IngredientFormData,
  EditIngredientFormData,
} from '@/lib/validation/ingredient-schemas';
import { IngredientUnit } from '@/types/recipe-management/common';
import type { RecipeIngredientDto } from '@/types/recipe-management';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';

/**
 * Union type for form data - handles both create and edit scenarios
 */
type UnifiedFormData = IngredientFormData | EditIngredientFormData;

/**
 * Options for ingredient units with human-readable labels
 */
const INGREDIENT_UNIT_OPTIONS = [
  { value: IngredientUnit.G, label: 'Grams (g)' },
  { value: IngredientUnit.KG, label: 'Kilograms (kg)' },
  { value: IngredientUnit.OZ, label: 'Ounces (oz)' },
  { value: IngredientUnit.LB, label: 'Pounds (lb)' },
  { value: IngredientUnit.ML, label: 'Milliliters (ml)' },
  { value: IngredientUnit.L, label: 'Liters (L)' },
  { value: IngredientUnit.CUP, label: 'Cups' },
  { value: IngredientUnit.TBSP, label: 'Tablespoons (tbsp)' },
  { value: IngredientUnit.TSP, label: 'Teaspoons (tsp)' },
  { value: IngredientUnit.PIECE, label: 'Pieces' },
  { value: IngredientUnit.CLOVE, label: 'Cloves' },
  { value: IngredientUnit.SLICE, label: 'Slices' },
  { value: IngredientUnit.PINCH, label: 'Pinches' },
  { value: IngredientUnit.CAN, label: 'Cans' },
  { value: IngredientUnit.BOTTLE, label: 'Bottles' },
  { value: IngredientUnit.PACKET, label: 'Packets' },
  { value: IngredientUnit.UNIT, label: 'Units' },
];

/**
 * Props for IngredientForm component
 */
export interface IngredientFormProps {
  mode: 'create' | 'edit';
  recipeId: number;
  initialData?: RecipeIngredientDto;
  onSuccess?: (data: RecipeIngredientDto) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  className?: string;
  showCard?: boolean;
  title?: string;
}

/**
 * IngredientForm component for creating and editing recipe ingredients
 */
export function IngredientForm({
  mode,
  recipeId,
  initialData,
  onSuccess,
  onError,
  onCancel,
  className,
  showCard = true,
  title,
}: IngredientFormProps) {
  // Always call hooks in the same order
  const createFormHook = useCreateIngredientForm(recipeId, {
    onSuccess,
    onError,
  });
  const editFormHook = useEditIngredientForm(
    recipeId,
    initialData ?? ({} as RecipeIngredientDto),
    { onSuccess, onError }
  );

  // Select appropriate hook based on mode and handle typing properly
  const formState = mode === 'create' ? createFormHook : editFormHook;
  const { form, handleSubmit, resetForm, isSubmitting, isValid, hasChanges } =
    formState;

  // Default titles
  const defaultTitle = mode === 'create' ? 'Add Ingredient' : 'Edit Ingredient';
  const formTitle = title ?? defaultTitle;

  // Handle cancel action
  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    resetForm();
    onCancel?.();
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form-level errors */}
      <FormErrors form={form as UseFormReturn<UnifiedFormData>} />

      {/* Ingredient Name */}
      <FormInput
        form={form as UseFormReturn<UnifiedFormData>}
        name="ingredientName"
        label="Ingredient Name"
        placeholder="e.g., Chicken breast, Tomatoes, Salt"
        required
        helperText="Enter the name of the ingredient"
      />

      {/* Quantity and Unit Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          form={form as UseFormReturn<UnifiedFormData>}
          name="quantity"
          label="Quantity"
          type="number"
          placeholder="1"
          required
          helperText="Enter the amount needed"
        />

        <FormSelect
          form={form as UseFormReturn<UnifiedFormData>}
          name="unit"
          label="Unit"
          placeholder="Select unit"
          options={INGREDIENT_UNIT_OPTIONS}
          required
          helperText="Choose the measurement unit"
        />
      </div>

      {/* Optional Ingredient */}
      <FormCheckbox
        form={form as UseFormReturn<UnifiedFormData>}
        name="isOptional"
        label="Optional ingredient"
        description="Check this if the ingredient is optional for the recipe"
      />

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Adding...'
              : 'Updating...'
            : mode === 'create'
              ? 'Add Ingredient'
              : 'Update Ingredient'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}

        {mode === 'create' && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            disabled={isSubmitting || !(hasChanges ?? false)}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );

  // Render with or without card wrapper
  if (showCard) {
    return (
      <Card className={cn('w-full max-w-2xl', className)}>
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{formTitle}</h2>
      )}
      {formContent}
    </div>
  );
}

/**
 * Convenience component for creating ingredients
 */
export type CreateIngredientFormProps = Omit<
  IngredientFormProps,
  'mode' | 'initialData'
>;

export function CreateIngredientForm(props: CreateIngredientFormProps) {
  return <IngredientForm {...props} mode="create" />;
}

/**
 * Convenience component for editing ingredients
 */
export interface EditIngredientFormProps
  extends Omit<IngredientFormProps, 'mode'> {
  initialData: RecipeIngredientDto;
}

export function EditIngredientForm(props: EditIngredientFormProps) {
  return <IngredientForm {...props} mode="edit" />;
}
