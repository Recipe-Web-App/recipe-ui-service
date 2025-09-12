import { MealType } from './common';

export interface CreateMealPlanDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  userId?: string;
  recipes?: CreateMealPlanRecipeDto[];
}

export interface UpdateMealPlanDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateMealPlanRecipeDto {
  recipeId: string;
  day: number;
  mealType: MealType;
  servings?: number;
  notes?: string;
}
