import { z } from 'zod';
import {
  DifficultyLevel,
  IngredientUnit,
} from '@/types/recipe-management/common';
import type {
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  CreateRecipeIngredientRequest,
  CreateRecipeStepRequest,
} from '@/types/recipe-management/recipe';

/**
 * Recipe title validation schema
 */
export const recipeTitleSchema = z
  .string()
  .min(1, 'Recipe title is required')
  .min(3, 'Recipe title must be at least 3 characters')
  .max(200, 'Recipe title must not exceed 200 characters')
  .trim();

/**
 * Recipe description validation schema
 */
export const recipeDescriptionSchema = z
  .string()
  .max(2000, 'Description must not exceed 2000 characters')
  .trim()
  .optional();

/**
 * Recipe servings validation schema
 */
export const recipeServingsSchema = z
  .number()
  .int('Servings must be a whole number')
  .min(1, 'Servings must be at least 1')
  .max(100, 'Servings must not exceed 100');

/**
 * Recipe preparation time validation schema (in minutes)
 */
export const recipePrepTimeSchema = z
  .number()
  .int('Preparation time must be a whole number')
  .min(0, 'Preparation time cannot be negative')
  .max(1440, 'Preparation time must not exceed 1440 minutes (24 hours)')
  .optional();

/**
 * Recipe cooking time validation schema (in minutes)
 */
export const recipeCookTimeSchema = z
  .number()
  .int('Cooking time must be a whole number')
  .min(0, 'Cooking time cannot be negative')
  .max(1440, 'Cooking time must not exceed 1440 minutes (24 hours)')
  .optional();

/**
 * Recipe difficulty validation schema
 */
export const recipeDifficultySchema = z.nativeEnum(DifficultyLevel).optional();

/**
 * Recipe ingredient validation schema for form inputs
 */
export const recipeIngredientSchema = z.object({
  name: z
    .string()
    .min(1, 'Ingredient name is required')
    .min(2, 'Ingredient name must be at least 2 characters')
    .max(100, 'Ingredient name must not exceed 100 characters')
    .trim(),
  quantity: z
    .number()
    .min(0.01, 'Quantity must be greater than 0')
    .max(10000, 'Quantity must not exceed 10,000'),
  unit: z.nativeEnum(IngredientUnit),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .optional(),
});

/**
 * Recipe step validation schema for form inputs
 */
export const recipeStepSchema = z.object({
  stepNumber: z
    .number()
    .int('Step number must be a whole number')
    .min(1, 'Step number must be at least 1'),
  instruction: z
    .string()
    .min(1, 'Step instruction is required')
    .min(10, 'Step instruction must be at least 10 characters')
    .max(1000, 'Step instruction must not exceed 1000 characters')
    .trim(),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(0, 'Duration cannot be negative')
    .max(1440, 'Duration must not exceed 1440 minutes (24 hours)')
    .optional(),
});

/**
 * Recipe tag validation schema for form inputs
 */
export const recipeTagSchema = z
  .string()
  .min(1, 'Tag name is required')
  .min(2, 'Tag must be at least 2 characters')
  .max(50, 'Tag must not exceed 50 characters')
  .trim()
  .regex(
    /^[a-zA-Z0-9\s-]+$/,
    'Tag can only contain letters, numbers, spaces, and hyphens'
  );

/**
 * Create recipe form validation schema
 */
export const createRecipeFormSchema = z.object({
  title: recipeTitleSchema,
  description: recipeDescriptionSchema,
  servings: recipeServingsSchema,
  prepTime: recipePrepTimeSchema,
  cookTime: recipeCookTimeSchema,
  difficulty: recipeDifficultySchema,
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(50, 'Recipe cannot have more than 50 ingredients'),
  steps: z
    .array(recipeStepSchema)
    .min(1, 'At least one step is required')
    .max(100, 'Recipe cannot have more than 100 steps'),
  tags: z
    .array(recipeTagSchema)
    .max(20, 'Recipe cannot have more than 20 tags')
    .optional()
    .default([]),
});

/**
 * Edit recipe form validation schema
 */
export const editRecipeFormSchema = z.object({
  recipeId: z.number().int().positive(),
  title: recipeTitleSchema,
  description: recipeDescriptionSchema,
  servings: recipeServingsSchema,
  prepTime: recipePrepTimeSchema,
  cookTime: recipeCookTimeSchema,
  difficulty: recipeDifficultySchema,
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(50, 'Recipe cannot have more than 50 ingredients'),
  steps: z
    .array(recipeStepSchema)
    .min(1, 'At least one step is required')
    .max(100, 'Recipe cannot have more than 100 steps'),
  tags: z
    .array(recipeTagSchema)
    .max(20, 'Recipe cannot have more than 20 tags')
    .optional()
    .default([]),
});

/**
 * Update recipe form validation schema (for partial updates)
 */
export const updateRecipeFormSchema = z.object({
  recipeId: z.number().int().positive(),
  title: recipeTitleSchema.optional(),
  description: recipeDescriptionSchema,
  servings: recipeServingsSchema.optional(),
  prepTime: recipePrepTimeSchema,
  cookTime: recipeCookTimeSchema,
  difficulty: recipeDifficultySchema,
});

/**
 * Inferred TypeScript types from schemas
 */
export type RecipeFormData = z.infer<typeof createRecipeFormSchema>;
export type EditRecipeFormData = z.infer<typeof editRecipeFormSchema>;
export type UpdateRecipeFormData = z.infer<typeof updateRecipeFormSchema>;
export type RecipeIngredientFormData = z.infer<typeof recipeIngredientSchema>;
export type RecipeStepFormData = z.infer<typeof recipeStepSchema>;

/**
 * Validation options for react-hook-form
 */
export const validationOptions = {
  create: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
  },
  edit: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
  },
  update: {
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
  },
} as const;

/**
 * Convert form data to CreateRecipeRequest
 */
export function convertToCreateRecipeRequest(
  formData: RecipeFormData
): CreateRecipeRequest {
  return {
    title: formData.title,
    description: formData.description,
    servings: formData.servings,
    prepTime: formData.prepTime,
    cookTime: formData.cookTime,
    difficulty: formData.difficulty,
    ingredients: formData.ingredients.map(
      (ingredient): CreateRecipeIngredientRequest => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes,
      })
    ),
    steps: formData.steps.map(
      (step): CreateRecipeStepRequest => ({
        stepNumber: step.stepNumber,
        instruction: step.instruction,
        duration: step.duration,
      })
    ),
    tags: formData.tags,
  };
}

/**
 * Convert form data to UpdateRecipeRequest
 */
export function convertToUpdateRecipeRequest(
  formData: UpdateRecipeFormData
): UpdateRecipeRequest {
  const updateData: UpdateRecipeRequest = {};

  if (formData.title !== undefined) {
    updateData.title = formData.title;
  }
  if (formData.description !== undefined) {
    updateData.description = formData.description;
  }
  if (formData.servings !== undefined) {
    updateData.servings = formData.servings;
  }
  if (formData.prepTime !== undefined) {
    updateData.prepTime = formData.prepTime;
  }
  if (formData.cookTime !== undefined) {
    updateData.cookTime = formData.cookTime;
  }
  if (formData.difficulty !== undefined) {
    updateData.difficulty = formData.difficulty;
  }

  return updateData;
}

/**
 * Convert RecipeDto to form data for editing
 */
export function convertFromRecipeDto(recipe: RecipeDto): EditRecipeFormData {
  return {
    recipeId: recipe.recipeId,
    title: recipe.title,
    description: recipe.description ?? '',
    servings: recipe.servings,
    prepTime: recipe.preparationTime,
    cookTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    ingredients:
      recipe.ingredients?.map(ingredient => ({
        name: ingredient.ingredientName,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: undefined, // Note: RecipeIngredientDto doesn't have notes field
      })) ?? [],
    steps:
      recipe.steps?.map(step => ({
        stepNumber: step.stepNumber,
        instruction: step.instruction,
        duration: step.duration,
      })) ?? [],
    tags: recipe.tags?.map(tag => tag.name) ?? [],
  };
}

/**
 * Convert RecipeDto to form data for partial updates
 */
export function convertFromRecipeDtoToUpdate(
  recipe: RecipeDto
): UpdateRecipeFormData {
  return {
    recipeId: recipe.recipeId,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTime: recipe.preparationTime,
    cookTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
  };
}

/**
 * Default values for create form
 */
export const createRecipeDefaultValues: RecipeFormData = {
  title: '',
  description: '',
  servings: 4,
  prepTime: undefined,
  cookTime: undefined,
  difficulty: undefined,
  ingredients: [
    {
      name: '',
      quantity: 1,
      unit: IngredientUnit.UNIT,
      notes: '',
    },
  ],
  steps: [
    {
      stepNumber: 1,
      instruction: '',
      duration: undefined,
    },
  ],
  tags: [],
};
