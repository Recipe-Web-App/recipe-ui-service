import { z } from 'zod';
import {
  DifficultyLevel,
  IngredientMatchMode,
} from '@/types/recipe-management/common';
import type { SearchRecipesRequest } from '@/types/recipe-management/search';

/**
 * Search query validation schema
 */
export const searchQuerySchema = z
  .string()
  .min(2, 'Search query must be at least 2 characters')
  .max(200, 'Search query must not exceed 200 characters')
  .trim()
  .optional();

/**
 * Ingredients list validation schema
 */
export const ingredientsListSchema = z
  .array(
    z
      .string()
      .min(1, 'Ingredient name is required')
      .max(100, 'Ingredient name must not exceed 100 characters')
      .trim()
  )
  .max(20, 'Cannot search with more than 20 ingredients')
  .optional();

/**
 * Tags list validation schema
 */
export const tagsListSchema = z
  .array(
    z
      .string()
      .min(1, 'Tag is required')
      .max(50, 'Tag must not exceed 50 characters')
      .trim()
  )
  .max(10, 'Cannot search with more than 10 tags')
  .optional();

/**
 * Difficulty validation schema (single value, not array)
 */
export const difficultySchema = z.nativeEnum(DifficultyLevel).optional();

/**
 * Ingredient match mode validation schema
 */
export const ingredientMatchModeSchema = z
  .nativeEnum(IngredientMatchMode)
  .optional();

/**
 * Servings validation schema
 */
export const servingsSchema = z
  .number()
  .int('Servings must be a whole number')
  .min(1, 'Servings must be at least 1')
  .max(100, 'Servings must not exceed 100')
  .optional();

/**
 * Maximum prep time validation schema
 */
export const maxPrepTimeSchema = z
  .number()
  .int('Prep time must be a whole number')
  .min(1, 'Prep time must be at least 1 minute')
  .max(1440, 'Prep time must not exceed 1440 minutes (24 hours)')
  .optional();

/**
 * Maximum cook time validation schema
 */
export const maxCookTimeSchema = z
  .number()
  .int('Cook time must be a whole number')
  .min(1, 'Cook time must be at least 1 minute')
  .max(1440, 'Cook time must not exceed 1440 minutes (24 hours)')
  .optional();

/**
 * Search form validation schema
 */
export const searchFormSchema = z.object({
  query: searchQuerySchema,
  ingredients: ingredientsListSchema,
  ingredientMatchMode: ingredientMatchModeSchema,
  tags: tagsListSchema,
  difficulty: difficultySchema,
  maxPrepTime: maxPrepTimeSchema,
  maxCookTime: maxCookTimeSchema,
  minServings: servingsSchema,
  maxServings: servingsSchema,
});

/**
 * Inferred TypeScript type from schema
 */
export type SearchFormData = z.infer<typeof searchFormSchema>;

/**
 * Validation options for react-hook-form
 */
export const validationOptions = {
  mode: 'onChange' as const,
  reValidateMode: 'onChange' as const,
  criteriaMode: 'all' as const,
  shouldFocusError: true,
} as const;

/**
 * Convert form data to SearchRecipesRequest
 */
export function convertToSearchRecipesRequest(
  formData: SearchFormData
): SearchRecipesRequest {
  const request: SearchRecipesRequest = {};

  if (formData.query) {
    request.recipeNameQuery = formData.query;
  }
  if (formData.ingredients && formData.ingredients.length > 0) {
    request.ingredients = formData.ingredients;
  }
  if (formData.ingredientMatchMode) {
    request.ingredientMatchMode = formData.ingredientMatchMode;
  }
  if (formData.tags && formData.tags.length > 0) {
    request.tags = formData.tags;
  }
  if (formData.difficulty) {
    request.difficulty = formData.difficulty;
  }
  if (formData.maxPrepTime !== undefined) {
    request.maxPreparationTime = formData.maxPrepTime;
  }
  if (formData.maxCookTime !== undefined) {
    request.maxCookingTime = formData.maxCookTime;
  }
  if (formData.minServings !== undefined) {
    request.minServings = formData.minServings;
  }
  if (formData.maxServings !== undefined) {
    request.maxServings = formData.maxServings;
  }

  return request;
}

/**
 * Convert SearchRecipesRequest to form data
 */
export function convertFromSearchRecipesRequest(
  searchData: SearchRecipesRequest
): SearchFormData {
  return {
    query: searchData.recipeNameQuery ?? '',
    ingredients: searchData.ingredients ?? [],
    ingredientMatchMode: searchData.ingredientMatchMode,
    tags: searchData.tags ?? [],
    difficulty: searchData.difficulty,
    maxPrepTime: searchData.maxPreparationTime,
    maxCookTime: searchData.maxCookingTime,
    minServings: searchData.minServings,
    maxServings: searchData.maxServings,
  };
}

/**
 * Default values for search form
 */
export const searchFormDefaultValues: SearchFormData = {
  query: '',
  ingredients: [],
  ingredientMatchMode: undefined,
  tags: [],
  difficulty: undefined,
  maxPrepTime: undefined,
  maxCookTime: undefined,
  minServings: undefined,
  maxServings: undefined,
};

/**
 * Check if search form has any active filters
 */
export function hasActiveFilters(formData: SearchFormData): boolean {
  if (formData.query && formData.query.length >= 2) return true;
  if (formData.ingredients && formData.ingredients.length > 0) return true;
  if (formData.tags && formData.tags.length > 0) return true;
  if (formData.difficulty !== undefined) return true;
  if (formData.maxPrepTime !== undefined) return true;
  if (formData.maxCookTime !== undefined) return true;
  if (formData.minServings !== undefined) return true;
  if (formData.maxServings !== undefined) return true;
  return false;
}

/**
 * Count active filters
 */
export function countActiveFilters(formData: SearchFormData): number {
  let count = 0;

  if (formData.query && formData.query.length >= 2) count++;
  if (formData.ingredients && formData.ingredients.length > 0) count++;
  if (formData.tags && formData.tags.length > 0) count++;
  if (formData.difficulty !== undefined) count++;
  if (formData.maxPrepTime !== undefined) count++;
  if (formData.maxCookTime !== undefined) count++;
  if (formData.minServings !== undefined) count++;
  if (formData.maxServings !== undefined) count++;

  return count;
}
