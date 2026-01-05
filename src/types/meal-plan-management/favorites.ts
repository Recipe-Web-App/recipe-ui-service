import { PaginationMeta } from './common';
import { MealPlanResponseDto } from './meal-plan';

/**
 * Represents a meal plan favorite entry
 */
export interface MealPlanFavoriteResponseDto {
  mealPlanId: string;
  userId: string;
  favoritedAt: string;
  mealPlan?: MealPlanResponseDto;
}

/**
 * Response for checking if a meal plan is favorited
 */
export interface MealPlanFavoriteCheckResponseDto {
  isFavorited: boolean;
  favoritedAt: string | null;
}

/**
 * Paginated response for listing favorite meal plans
 */
export interface PaginatedMealPlanFavoritesResponse {
  success: boolean;
  data: MealPlanFavoriteResponseDto[];
  meta: PaginationMeta;
}

/**
 * API response for adding a meal plan to favorites
 */
export interface MealPlanFavoriteApiResponse {
  success: boolean;
  data: MealPlanFavoriteResponseDto;
  message?: string;
}

/**
 * API response for checking favorite status
 */
export interface MealPlanFavoriteCheckApiResponse {
  success: boolean;
  data: MealPlanFavoriteCheckResponseDto;
}
