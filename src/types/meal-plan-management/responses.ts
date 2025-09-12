import { PaginationMeta } from './common';
import {
  MealPlanResponseDto,
  MealPlanRecipeResponseDto,
  MealPlanStatistics,
} from './meal-plan';

export interface PaginatedMealPlansResponse {
  success: boolean;
  data: MealPlanResponseDto[];
  meta: PaginationMeta;
}

export interface MealPlanQueryResponse {
  success: boolean;
  viewMode: 'full' | 'day' | 'week' | 'month';
  data:
    | MealPlanResponseDto
    | DayViewResponse
    | WeekViewResponse
    | MonthViewResponse;
  statistics?: MealPlanStatistics;
}

export interface DayViewResponse {
  mealPlanId: string;
  mealPlanName: string;
  date: string;
  meals: {
    breakfast: MealPlanRecipeResponseDto[];
    lunch: MealPlanRecipeResponseDto[];
    dinner: MealPlanRecipeResponseDto[];
    snack: MealPlanRecipeResponseDto[];
    dessert: MealPlanRecipeResponseDto[];
  };
  totalMeals: number;
}

export interface WeekViewResponse {
  mealPlanId: string;
  mealPlanName: string;
  startDate: string;
  endDate: string;
  weekNumber: number;
  days: {
    date: string;
    dayOfWeek:
      | 'Monday'
      | 'Tuesday'
      | 'Wednesday'
      | 'Thursday'
      | 'Friday'
      | 'Saturday'
      | 'Sunday';
    meals: {
      breakfast: MealPlanRecipeResponseDto[];
      lunch: MealPlanRecipeResponseDto[];
      dinner: MealPlanRecipeResponseDto[];
      snack: MealPlanRecipeResponseDto[];
      dessert: MealPlanRecipeResponseDto[];
    };
    totalMeals: number;
  }[];
  totalMeals: number;
}

export interface MonthViewResponse {
  mealPlanId: string;
  mealPlanName: string;
  year: number;
  month: number;
  monthName: string;
  weeks: {
    weekNumber: number;
    startDate: string;
    endDate: string;
    days: {
      date: string;
      dayOfMonth: number;
      isCurrentMonth: boolean;
      mealCount: number;
      meals: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snack: number;
        dessert: number;
      };
    }[];
  }[];
  totalMeals: number;
}
