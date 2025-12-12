import { z } from 'zod';
import {
  recipeTitleSchema,
  recipeDescriptionSchema,
  recipeServingsSchema,
  recipePrepTimeSchema,
  recipeCookTimeSchema,
  recipeDifficultySchema,
  recipeTagSchema,
} from './recipe-schemas';
import { IngredientUnit } from '@/types/recipe-management/common';
import { CreateRecipeWizardStep } from '@/types/recipe/create-recipe-wizard';
import type { CreateRecipeFormData } from '@/types/recipe/create-recipe-wizard';

/**
 * Basic Info Step Schema
 * Validates: title, description
 */
export const basicInfoStepSchema = z.object({
  title: recipeTitleSchema,
  description: recipeDescriptionSchema,
});

/**
 * Timing Step Schema
 * Validates: servings, prepTime, cookTime, difficulty
 */
export const timingStepSchema = z.object({
  servings: recipeServingsSchema,
  prepTime: recipePrepTimeSchema,
  cookTime: recipeCookTimeSchema,
  difficulty: recipeDifficultySchema,
});

/**
 * Single ingredient schema for wizard (includes id for DnD)
 */
export const wizardIngredientSchema = z.object({
  id: z.string(),
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
  unit: z.string().min(1, 'Unit is required'),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

/**
 * Ingredients Step Schema
 * Validates: ingredients array (min 1, max 50)
 */
export const ingredientsStepSchema = z.object({
  ingredients: z
    .array(wizardIngredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(50, 'Recipe cannot have more than 50 ingredients'),
});

/**
 * Single instruction step schema for wizard (includes id for DnD)
 */
export const wizardInstructionSchema = z.object({
  id: z.string(),
  stepNumber: z.number().int().min(1),
  instruction: z
    .string()
    .min(1, 'Step instruction is required')
    .min(10, 'Step instruction must be at least 10 characters')
    .max(1000, 'Step instruction must not exceed 1000 characters')
    .trim(),
  duration: z
    .union([
      z
        .number()
        .int('Duration must be a whole number')
        .min(0, 'Duration cannot be negative')
        .max(1440, 'Duration must not exceed 1440 minutes (24 hours)'),
      z.undefined(),
    ])
    .optional(),
});

/**
 * Instructions Step Schema
 * Validates: steps array (min 1, max 100)
 */
export const instructionsStepSchema = z.object({
  steps: z
    .array(wizardInstructionSchema)
    .min(1, 'At least one instruction step is required')
    .max(100, 'Recipe cannot have more than 100 steps'),
});

/**
 * Tags schema (optional, used in review step)
 */
export const tagsSchema = z.object({
  tags: z
    .array(recipeTagSchema)
    .max(20, 'Recipe cannot have more than 20 tags')
    .default([]),
});

/**
 * Complete wizard form schema
 * Combines all step schemas for full form validation
 */
export const createRecipeWizardFormSchema = z.object({
  // Basic Info
  title: recipeTitleSchema,
  description: recipeDescriptionSchema,
  // Timing
  servings: recipeServingsSchema,
  prepTime: recipePrepTimeSchema,
  cookTime: recipeCookTimeSchema,
  difficulty: recipeDifficultySchema,
  // Ingredients
  ingredients: z
    .array(wizardIngredientSchema)
    .min(1, 'At least one ingredient is required')
    .max(50, 'Recipe cannot have more than 50 ingredients'),
  // Instructions
  steps: z
    .array(wizardInstructionSchema)
    .min(1, 'At least one instruction step is required')
    .max(100, 'Recipe cannot have more than 100 steps'),
  // Tags
  tags: z
    .array(recipeTagSchema)
    .max(20, 'Recipe cannot have more than 20 tags')
    .default([]),
});

/**
 * Step schema map for easy lookup
 */
export const stepSchemas = {
  [CreateRecipeWizardStep.BASIC_INFO]: basicInfoStepSchema,
  [CreateRecipeWizardStep.TIMING]: timingStepSchema,
  [CreateRecipeWizardStep.INGREDIENTS]: ingredientsStepSchema,
  [CreateRecipeWizardStep.INSTRUCTIONS]: instructionsStepSchema,
  [CreateRecipeWizardStep.REVIEW]: z.object({}), // Review step has no additional fields to validate
} as const;

/**
 * Validate a specific step's data
 * @param stepId - The step to validate
 * @param data - The form data to validate
 * @returns Validation result with success status and optional errors
 */
export function validateStep(
  stepId: CreateRecipeWizardStep,
  data: Partial<CreateRecipeFormData>
): { success: boolean; errors?: z.ZodError } {
  // eslint-disable-next-line security/detect-object-injection
  const schema = stepSchemas[stepId];

  if (!schema) {
    return { success: true };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true };
  }

  return { success: false, errors: result.error };
}

/**
 * Validate all steps up to and including the specified step
 * Used to check if user can skip to a step
 */
export function validateStepsUpTo(
  targetStep: CreateRecipeWizardStep,
  data: Partial<CreateRecipeFormData>
): { success: boolean; firstInvalidStep?: CreateRecipeWizardStep } {
  const stepOrder = [
    CreateRecipeWizardStep.BASIC_INFO,
    CreateRecipeWizardStep.TIMING,
    CreateRecipeWizardStep.INGREDIENTS,
    CreateRecipeWizardStep.INSTRUCTIONS,
    CreateRecipeWizardStep.REVIEW,
  ];

  const targetIndex = stepOrder.indexOf(targetStep);

  for (let i = 0; i <= targetIndex; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const stepId = stepOrder[i];
    if (stepId !== undefined) {
      const result = validateStep(stepId, data);
      if (!result.success) {
        return { success: false, firstInvalidStep: stepId };
      }
    }
  }

  return { success: true };
}

/**
 * Get validation error messages for a step
 */
export function getStepErrorMessages(
  stepId: CreateRecipeWizardStep,
  data: Partial<CreateRecipeFormData>
): string[] {
  const result = validateStep(stepId, data);

  if (result.success || !result.errors) {
    return [];
  }

  return result.errors.issues.map(issue => issue.message);
}

/**
 * Check if a step is complete (all required fields filled)
 */
export function isStepComplete(
  stepId: CreateRecipeWizardStep,
  data: Partial<CreateRecipeFormData>
): boolean {
  const result = validateStep(stepId, data);
  return result.success;
}

/**
 * Get the fields that belong to each step
 * Useful for partial form watching
 */
export const stepFields: Record<
  CreateRecipeWizardStep,
  (keyof CreateRecipeFormData)[]
> = {
  [CreateRecipeWizardStep.BASIC_INFO]: ['title', 'description'],
  [CreateRecipeWizardStep.TIMING]: [
    'servings',
    'prepTime',
    'cookTime',
    'difficulty',
  ],
  [CreateRecipeWizardStep.INGREDIENTS]: ['ingredients'],
  [CreateRecipeWizardStep.INSTRUCTIONS]: ['steps'],
  [CreateRecipeWizardStep.REVIEW]: ['tags'],
};

/**
 * Ingredient unit options for select dropdown
 */
export const ingredientUnitOptions = Object.values(IngredientUnit).map(
  unit => ({
    value: unit,
    label: formatUnitLabel(unit),
  })
);

/**
 * Format ingredient unit for display
 */
function formatUnitLabel(unit: IngredientUnit | string): string {
  const labels: Record<string, string> = {
    G: 'Grams (g)',
    KG: 'Kilograms (kg)',
    OZ: 'Ounces (oz)',
    LB: 'Pounds (lb)',
    ML: 'Milliliters (ml)',
    L: 'Liters (L)',
    CUP: 'Cups',
    TBSP: 'Tablespoons',
    TSP: 'Teaspoons',
    PIECE: 'Pieces',
    CLOVE: 'Cloves',
    SLICE: 'Slices',
    PINCH: 'Pinches',
    CAN: 'Cans',
    BOTTLE: 'Bottles',
    PACKET: 'Packets',
    UNIT: 'Units',
  };

  // eslint-disable-next-line security/detect-object-injection
  return labels[unit] ?? unit;
}

/**
 * Inferred types from schemas
 */
export type BasicInfoStepFormData = z.infer<typeof basicInfoStepSchema>;
export type TimingStepFormData = z.infer<typeof timingStepSchema>;
export type IngredientsStepFormData = z.infer<typeof ingredientsStepSchema>;
export type InstructionsStepFormData = z.infer<typeof instructionsStepSchema>;
export type WizardIngredientFormData = z.infer<typeof wizardIngredientSchema>;
export type WizardInstructionFormData = z.infer<typeof wizardInstructionSchema>;

/**
 * Full wizard form data type inferred from schema
 * This ensures the type matches exactly what Zod validates
 */
export type CreateRecipeWizardFormData = z.infer<
  typeof createRecipeWizardFormSchema
>;
