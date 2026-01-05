import { PaginationMeta } from './common';

/**
 * Represents a tag associated with a meal plan
 */
export interface MealPlanTagDto {
  tagId: string;
  name: string;
}

/**
 * Request DTO for adding or replacing tags on a meal plan
 */
export interface AddMealPlanTagsDto {
  tags: string[];
}

/**
 * API response for tag operations that return tag arrays
 */
export interface MealPlanTagsApiResponse {
  success: boolean;
  data: MealPlanTagDto[];
  message?: string;
}

/**
 * Paginated response for listing all available tags
 */
export interface PaginatedTagsResponse {
  success: boolean;
  data: MealPlanTagDto[];
  meta: PaginationMeta;
}
