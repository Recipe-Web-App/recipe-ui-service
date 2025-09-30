import { z } from 'zod';
import { IngredientUnit } from '@/types/recipe-management/common';

/**
 * Schema for ingredient units - based on existing IngredientUnit enum
 */
export const ingredientUnitSchema = z.nativeEnum(IngredientUnit, {
  message: 'Please select a valid unit',
});

/**
 * Schema for ingredient quantity validation
 */
export const ingredientQuantitySchema = z
  .number({
    message: 'Quantity must be a number',
  })
  .positive('Quantity must be greater than 0')
  .max(999999, 'Quantity cannot exceed 999,999');

/**
 * Schema for ingredient name validation
 */
export const ingredientNameSchema = z
  .string({
    message: 'Ingredient name is required',
  })
  .min(1, 'Ingredient name cannot be empty')
  .max(255, 'Ingredient name cannot exceed 255 characters')
  .trim()
  .refine(name => name.length > 0, {
    message: 'Ingredient name cannot be only whitespace',
  });

/**
 * Complete ingredient form schema - based on RecipeIngredientDto
 */
export const ingredientFormSchema = z.object({
  ingredientName: ingredientNameSchema,
  quantity: ingredientQuantitySchema,
  unit: ingredientUnitSchema,
  isOptional: z.boolean().default(false),
});

/**
 * Schema for editing existing ingredient (includes ID)
 */
export const editIngredientFormSchema = z.object({
  ingredientName: ingredientNameSchema,
  quantity: ingredientQuantitySchema,
  unit: ingredientUnitSchema,
  isOptional: z.boolean().default(false),
  ingredientId: z
    .number({
      message: 'Ingredient ID is required for editing',
    })
    .positive('Ingredient ID must be positive'),
  recipeId: z
    .number({
      message: 'Recipe ID is required',
    })
    .positive('Recipe ID must be positive')
    .optional(), // Optional since it might be provided by context
});

/**
 * Type inference for form schemas
 */
export type IngredientFormData = z.infer<typeof ingredientFormSchema>;
export type EditIngredientFormData = z.infer<typeof editIngredientFormSchema>;

/**
 * Helper function to convert form data to API format
 */
export function convertToRecipeIngredientDto(
  formData: IngredientFormData,
  recipeId?: number,
  ingredientId?: number
) {
  return {
    recipeId,
    ingredientId: ingredientId ?? 0, // Will be assigned by backend for new ingredients
    ingredientName: formData.ingredientName,
    quantity: formData.quantity,
    unit: formData.unit,
    isOptional: formData.isOptional,
  };
}

/**
 * Helper function to convert API data to form format
 */
export function convertFromRecipeIngredientDto(apiData: {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  isOptional?: boolean;
  recipeId?: number;
}): EditIngredientFormData {
  return {
    ingredientId: apiData.ingredientId,
    ingredientName: apiData.ingredientName,
    quantity: apiData.quantity,
    unit: apiData.unit,
    isOptional: apiData.isOptional ?? false,
    recipeId: apiData.recipeId,
  };
}

/**
 * Validation options for different scenarios
 */
export const validationOptions = {
  // Standard validation for new ingredients
  create: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
  },
  // More lenient validation for editing
  edit: {
    mode: 'onBlur' as const,
    reValidateMode: 'onBlur' as const,
  },
  // Strict validation for submission
  submit: {
    mode: 'all' as const,
    reValidateMode: 'onChange' as const,
  },
} as const;
