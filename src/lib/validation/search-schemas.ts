import { z } from 'zod';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { SearchRecipesRequest } from '@/types/recipe-management/search';
import { SearchSortBy } from '@/types/recipe-management/search';

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
 * Difficulty list validation schema
 */
export const difficultyListSchema = z
  .array(z.nativeEnum(DifficultyLevel))
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
 * Minimum rating validation schema
 */
export const minRatingSchema = z
  .number()
  .min(1, 'Rating must be at least 1 star')
  .max(5, 'Rating must not exceed 5 stars')
  .optional();

/**
 * Sort by validation schema
 */
export const sortBySchema = z.nativeEnum(SearchSortBy).optional();

/**
 * Search form validation schema
 */
export const searchFormSchema = z.object({
  query: searchQuerySchema,
  ingredients: ingredientsListSchema,
  tags: tagsListSchema,
  difficulty: difficultyListSchema,
  maxPrepTime: maxPrepTimeSchema,
  maxCookTime: maxCookTimeSchema,
  minRating: minRatingSchema,
  sortBy: sortBySchema,
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
    request.query = formData.query;
  }
  if (formData.ingredients && formData.ingredients.length > 0) {
    request.ingredients = formData.ingredients;
  }
  if (formData.tags && formData.tags.length > 0) {
    request.tags = formData.tags;
  }
  if (formData.difficulty && formData.difficulty.length > 0) {
    request.difficulty = formData.difficulty;
  }
  if (formData.maxPrepTime !== undefined) {
    request.maxPrepTime = formData.maxPrepTime;
  }
  if (formData.maxCookTime !== undefined) {
    request.maxCookTime = formData.maxCookTime;
  }
  if (formData.minRating !== undefined) {
    request.minRating = formData.minRating;
  }
  if (formData.sortBy) {
    request.sortBy = formData.sortBy;
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
    query: searchData.query ?? '',
    ingredients: searchData.ingredients ?? [],
    tags: searchData.tags ?? [],
    difficulty: searchData.difficulty ?? [],
    maxPrepTime: searchData.maxPrepTime,
    maxCookTime: searchData.maxCookTime,
    minRating: searchData.minRating,
    sortBy: searchData.sortBy,
  };
}

/**
 * Default values for search form
 */
export const searchFormDefaultValues: SearchFormData = {
  query: '',
  ingredients: [],
  tags: [],
  difficulty: [],
  maxPrepTime: undefined,
  maxCookTime: undefined,
  minRating: undefined,
  sortBy: undefined,
};

/**
 * Check if search form has any active filters
 */
export function hasActiveFilters(formData: SearchFormData): boolean {
  if (formData.query && formData.query.length >= 2) return true;
  if (formData.ingredients && formData.ingredients.length > 0) return true;
  if (formData.tags && formData.tags.length > 0) return true;
  if (formData.difficulty && formData.difficulty.length > 0) return true;
  if (formData.maxPrepTime !== undefined) return true;
  if (formData.maxCookTime !== undefined) return true;
  if (formData.minRating !== undefined) return true;
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
  if (formData.difficulty && formData.difficulty.length > 0) count++;
  if (formData.maxPrepTime !== undefined) count++;
  if (formData.maxCookTime !== undefined) count++;
  if (formData.minRating !== undefined) count++;

  return count;
}
