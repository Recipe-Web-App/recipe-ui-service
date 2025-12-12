'use client';

import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ingredientUnitOptions } from '@/lib/validation/create-recipe-wizard-schemas';
import type { FieldErrors } from 'react-hook-form';
import {
  createEmptyIngredient,
  type CreateRecipeFormData,
  type IngredientFormData,
  type StepComponentProps,
} from '@/types/recipe/create-recipe-wizard';

/**
 * Type for individual ingredient field errors
 */
interface IngredientFieldError {
  name?: { message?: string };
  quantity?: { message?: string };
  unit?: { message?: string };
  notes?: { message?: string };
}

/**
 * Safely get ingredient error message at a specific index
 * Uses Array.prototype.at() to avoid object injection warnings
 */
function getIngredientError(
  errors: FieldErrors<CreateRecipeFormData>,
  index: number,
  field: 'name' | 'quantity' | 'unit' | 'notes'
): string | undefined {
  const ingredientErrors = errors.ingredients;
  if (!ingredientErrors || !Array.isArray(ingredientErrors)) return undefined;
  const ingredientError = ingredientErrors.at(index) as
    | IngredientFieldError
    | undefined;
  if (!ingredientError) return undefined;
  switch (field) {
    case 'name':
      return ingredientError.name?.message;
    case 'quantity':
      return ingredientError.quantity?.message;
    case 'unit':
      return ingredientError.unit?.message;
    case 'notes':
      return ingredientError.notes?.message;
    default:
      return undefined;
  }
}

/**
 * IngredientsStep Component
 *
 * Third step of the recipe creation wizard.
 * Manages a dynamic, sortable list of ingredients.
 */
export function IngredientsStep({ form, isActive }: StepComponentProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const ingredients = watch('ingredients');

  if (!isActive) return null;

  const handleAddIngredient = () => {
    append(createEmptyIngredient());
  };

  const handleRemoveIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleReorder = (reorderedItems: IngredientFormData[]) => {
    // Find the new order and apply it
    const currentIds = fields.map(f => f.id);
    const newIds = reorderedItems.map(item => item.id);

    // Calculate moves needed
    newIds.forEach((id, newIndex) => {
      const currentIndex = currentIds.indexOf(id);
      if (currentIndex !== newIndex && currentIndex !== -1) {
        move(currentIndex, newIndex);
        // Update currentIds to reflect the move
        currentIds.splice(currentIndex, 1);
        currentIds.splice(newIndex, 0, id);
      }
    });

    // Update the form values directly
    setValue('ingredients', reorderedItems, { shouldValidate: true });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Ingredients</CardTitle>
        <CardDescription>
          Add all the ingredients needed for your recipe. Drag to reorder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {/* Ingredients List */}
        <SortableList
          items={ingredients}
          onReorder={handleReorder}
          keyExtractor={item => item.id}
          emptyMessage="Add your first ingredient"
          aria-label="Recipe ingredients list"
          renderItem={(item, index) => (
            <SortableItem
              id={item.id}
              key={item.id}
              showDragHandle
              variant="default"
              size="md"
            >
              <SortableItemContent
                layout="row"
                alignment="start"
                className="flex-1 gap-2"
              >
                {/* Ingredient Name */}
                <div className="min-w-[120px] flex-1">
                  <Input
                    {...register(`ingredients.${index}.name` as const)}
                    placeholder="Ingredient name"
                    size="sm"
                    errorText={getIngredientError(errors, index, 'name')}
                    aria-label={`Ingredient ${index + 1} name`}
                  />
                </div>

                {/* Quantity */}
                <div className="w-20">
                  <Controller
                    name={`ingredients.${index}.quantity` as const}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Qty"
                        size="sm"
                        min={0.01}
                        step={0.25}
                        value={field.value ?? ''}
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? '' : value);
                        }}
                        errorText={getIngredientError(
                          errors,
                          index,
                          'quantity'
                        )}
                        aria-label={`Ingredient ${index + 1} quantity`}
                      />
                    )}
                  />
                </div>

                {/* Unit */}
                <div className="w-32">
                  <Controller
                    name={`ingredients.${index}.unit` as const}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          size="sm"
                          error={!!getIngredientError(errors, index, 'unit')}
                          aria-label={`Ingredient ${index + 1} unit`}
                        >
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredientUnitOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Notes (optional, hidden on small screens) */}
                <div className="hidden min-w-[100px] flex-1 sm:block">
                  <Input
                    {...register(`ingredients.${index}.notes` as const)}
                    placeholder="Notes (optional)"
                    size="sm"
                    aria-label={`Ingredient ${index + 1} notes`}
                  />
                </div>
              </SortableItemContent>

              <SortableItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={fields.length <= 1}
                  aria-label={`Remove ingredient ${index + 1}`}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </SortableItemActions>
            </SortableItem>
          )}
        />

        {/* Ingredient-level error */}
        {errors.ingredients?.message && (
          <p className="text-destructive text-sm">
            {errors.ingredients.message}
          </p>
        )}

        {/* Add Ingredient Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddIngredient}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>

        {/* Helper text */}
        <p className="text-muted-foreground text-sm">
          Tip: Be specific with quantities and include notes for any special
          preparation (e.g., &quot;finely chopped&quot; or &quot;room
          temperature&quot;).
        </p>
      </CardContent>
    </Card>
  );
}

IngredientsStep.displayName = 'IngredientsStep';
