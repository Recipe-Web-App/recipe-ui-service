import { MealType } from './common';

export interface MealPlanResponseDto {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  recipes?: MealPlanRecipeResponseDto[];
  recipeCount?: number;
  durationDays?: number;
}

export interface MealPlanRecipeResponseDto {
  mealPlanRecipeId: string;
  mealPlanId: string;
  recipeId: string;
  mealDate: string;
  mealType: MealType;
  servings: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanStatistics {
  averageMealsPerDay: number;
  mostFrequentMealType: MealType;
  daysWithMeals: number;
  totalRecipes: number;
  mealTypeBreakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
    dessert: number;
  };
}
