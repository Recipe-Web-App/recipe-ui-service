import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput, FormSelect, FormTextarea, FormErrors } from './FormField';
import {
  useCreateRecipeForm,
  useEditRecipeForm,
  useUpdateRecipeForm,
} from '@/hooks/forms/useRecipeForm';
import type {
  RecipeFormData,
  EditRecipeFormData,
  UpdateRecipeFormData,
} from '@/lib/validation/recipe-schemas';
import {
  DifficultyLevel,
  IngredientUnit,
} from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';

/**
 * Union type for form data - handles create, edit, and update scenarios
 */
type UnifiedFormData =
  | RecipeFormData
  | EditRecipeFormData
  | UpdateRecipeFormData;

/**
 * Options for difficulty levels with human-readable labels
 */
const DIFFICULTY_OPTIONS = [
  { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
  { value: DifficultyLevel.EASY, label: 'Easy' },
  { value: DifficultyLevel.MEDIUM, label: 'Medium' },
  { value: DifficultyLevel.HARD, label: 'Hard' },
  { value: DifficultyLevel.EXPERT, label: 'Expert' },
];

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
 * Props for RecipeForm component
 */
export interface RecipeFormProps {
  mode: 'create' | 'edit' | 'update';
  recipeId?: number;
  initialData?: RecipeDto;
  onSuccess?: (data: RecipeDto) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  className?: string;
  showCard?: boolean;
  title?: string;
}

/**
 * RecipeForm component for creating, editing, and updating recipes
 */
export function RecipeForm({
  mode,
  recipeId,
  initialData,
  onSuccess,
  onError,
  onCancel,
  className,
  showCard = true,
  title,
}: RecipeFormProps) {
  // Always call hooks in the same order
  const createFormHook = useCreateRecipeForm({
    onSuccess,
    onError,
  });

  const editFormHook = useEditRecipeForm(
    recipeId ?? 0,
    initialData ?? ({} as RecipeDto),
    { onSuccess, onError }
  );

  const updateFormHook = useUpdateRecipeForm(
    recipeId ?? 0,
    initialData ?? ({} as RecipeDto),
    { onSuccess, onError }
  );

  // Select appropriate hook based on mode
  const formState =
    mode === 'edit'
      ? editFormHook
      : mode === 'update'
        ? updateFormHook
        : createFormHook;

  const {
    form,
    handleSubmit,
    resetForm,
    isSubmitting,
    isValid,
    hasChanges,
    addIngredient,
    removeIngredient,
    addStep,
    removeStep,
    addTag,
    removeTag,
  } = formState;

  // Default titles
  const defaultTitle =
    mode === 'create'
      ? 'Create Recipe'
      : mode === 'edit'
        ? 'Edit Recipe'
        : 'Update Recipe';
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

  // Watch all form values
  const formValues = form.watch();

  // Extract ingredients, steps, and tags for dynamic rendering (only for create/edit modes)
  const ingredients =
    mode === 'create' || (mode === 'edit' && 'ingredients' in formValues)
      ? ((formValues as RecipeFormData | EditRecipeFormData).ingredients ?? [])
      : [];

  const steps =
    mode === 'create' || (mode === 'edit' && 'steps' in formValues)
      ? ((formValues as RecipeFormData | EditRecipeFormData).steps ?? [])
      : [];

  const tags =
    mode === 'create' || (mode === 'edit' && 'tags' in formValues)
      ? ((formValues as RecipeFormData | EditRecipeFormData).tags ?? [])
      : [];

  // Tag input state
  const [newTag, setNewTag] = React.useState('');

  // Handle adding a new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && addTag) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form-level errors */}
      <FormErrors form={form as UseFormReturn<UnifiedFormData>} />

      {/* Basic Recipe Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Basic Information</h3>

        {/* Recipe Title */}
        <FormInput
          form={form as UseFormReturn<UnifiedFormData>}
          name="title"
          label="Recipe Title"
          placeholder="e.g., Classic Chocolate Chip Cookies"
          required
          helperText="Give your recipe a descriptive and appetizing name"
        />

        {/* Recipe Description */}
        <FormTextarea
          form={form as UseFormReturn<UnifiedFormData>}
          name="description"
          label="Description"
          type="description"
          maxLength={2000}
          showCharacterCount
          helperText="Describe what makes this recipe special"
        />

        {/* Servings, Prep Time, Cook Time Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            form={form as UseFormReturn<UnifiedFormData>}
            name="servings"
            label="Servings"
            type="number"
            placeholder="4"
            required
            helperText="Number of people this serves"
          />

          <FormInput
            form={form as UseFormReturn<UnifiedFormData>}
            name="prepTime"
            label="Prep Time (minutes)"
            type="number"
            placeholder="15"
            helperText="Time to prepare ingredients"
          />

          <FormInput
            form={form as UseFormReturn<UnifiedFormData>}
            name="cookTime"
            label="Cook Time (minutes)"
            type="number"
            placeholder="30"
            helperText="Time to cook the recipe"
          />
        </div>

        {/* Difficulty Level */}
        <FormSelect
          form={form as UseFormReturn<UnifiedFormData>}
          name="difficulty"
          label="Difficulty Level"
          placeholder="Select difficulty"
          options={DIFFICULTY_OPTIONS}
          helperText="How challenging is this recipe to make?"
        />
      </div>

      {/* Ingredients Section - Only for create and edit modes */}
      {(mode === 'create' || mode === 'edit') && ingredients && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Ingredients</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              disabled={isSubmitting}
            >
              Add Ingredient
            </Button>
          </div>

          {ingredients.map((_, index) => (
            <div
              key={index}
              className="relative space-y-4 rounded-lg border p-4"
            >
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient?.(index)}
                  disabled={isSubmitting}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              )}

              <FormInput
                form={form as UseFormReturn<UnifiedFormData>}
                name={`ingredients.${index}.name`}
                label="Ingredient Name"
                placeholder="e.g., All-purpose flour"
                required
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  form={form as UseFormReturn<UnifiedFormData>}
                  name={`ingredients.${index}.quantity`}
                  label="Quantity"
                  type="number"
                  placeholder="1"
                  required
                />

                <FormSelect
                  form={form as UseFormReturn<UnifiedFormData>}
                  name={`ingredients.${index}.unit`}
                  label="Unit"
                  placeholder="Select unit"
                  options={INGREDIENT_UNIT_OPTIONS}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Steps Section - Only for create and edit modes */}
      {(mode === 'create' || mode === 'edit') && steps && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Instructions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
              disabled={isSubmitting}
            >
              Add Step
            </Button>
          </div>

          {steps.map((_, index) => (
            <div
              key={index}
              className="relative space-y-4 rounded-lg border p-4"
            >
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep?.(index)}
                  disabled={isSubmitting}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  form={form as UseFormReturn<UnifiedFormData>}
                  name={`steps.${index}.stepNumber`}
                  label="Step Number"
                  type="number"
                  disabled
                />

                <FormInput
                  form={form as UseFormReturn<UnifiedFormData>}
                  name={`steps.${index}.duration`}
                  label="Duration (seconds, optional)"
                  type="number"
                  placeholder="300"
                />
              </div>

              <FormTextarea
                form={form as UseFormReturn<UnifiedFormData>}
                name={`steps.${index}.instruction`}
                label="Instruction"
                type="instructions"
                required
                maxLength={1000}
                showCharacterCount
                helperText="Provide clear, detailed instructions for this step"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags Section - Only for create and edit modes */}
      {(mode === 'create' || mode === 'edit') && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tags</h3>

          {/* Add Tag Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a tag (e.g., vegetarian, quick)"
                value={newTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTag(e.target.value)
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!newTag.trim() || isSubmitting}
            >
              Add Tag
            </Button>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag?.(index)}
                    disabled={isSubmitting}
                    className="h-4 w-4 p-0 hover:bg-gray-200"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-6 sm:flex-row">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : mode === 'edit'
                ? 'Updating...'
                : 'Saving...'
            : mode === 'create'
              ? 'Create Recipe'
              : mode === 'edit'
                ? 'Update Recipe'
                : 'Save Changes'}
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
      <Card className={cn('w-full max-w-4xl', className)}>
        <CardHeader>
          <CardTitle>{formTitle}</CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('w-full max-w-4xl', className)}>
      {title && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{formTitle}</h2>
      )}
      {formContent}
    </div>
  );
}

/**
 * Convenience component for creating recipes
 */
export type CreateRecipeFormProps = Omit<
  RecipeFormProps,
  'mode' | 'recipeId' | 'initialData'
>;

export function CreateRecipeForm(props: CreateRecipeFormProps) {
  return <RecipeForm {...props} mode="create" />;
}

/**
 * Convenience component for editing recipes (full editing)
 */
export interface EditRecipeFormProps extends Omit<
  RecipeFormProps,
  'mode' | 'recipeId' | 'initialData'
> {
  recipeId: number;
  initialData: RecipeDto;
}

export function EditRecipeForm({
  recipeId,
  initialData,
  ...props
}: EditRecipeFormProps) {
  return (
    <RecipeForm
      {...props}
      mode="edit"
      recipeId={recipeId}
      initialData={initialData}
    />
  );
}

/**
 * Convenience component for updating recipes (basic fields only)
 */
export interface UpdateRecipeFormProps extends Omit<
  RecipeFormProps,
  'mode' | 'recipeId' | 'initialData'
> {
  recipeId: number;
  initialData: RecipeDto;
}

export function UpdateRecipeForm({
  recipeId,
  initialData,
  ...props
}: UpdateRecipeFormProps) {
  return (
    <RecipeForm
      {...props}
      mode="update"
      recipeId={recipeId}
      initialData={initialData}
    />
  );
}
