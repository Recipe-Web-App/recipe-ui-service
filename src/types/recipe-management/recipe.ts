import { DifficultyLevel } from './common';
import { RecipeIngredientDto } from './ingredient';
import { RecipeStepDto } from './step';
import { RecipeTagDto } from './tag';
import { RecipeRevisionDto } from './revision';

export interface RecipeDto {
  recipeId: number;
  userId: string;
  title: string;
  description?: string;
  originUrl?: string;
  servings: number;
  preparationTime?: number;
  cookingTime?: number;
  difficulty?: DifficultyLevel;
  createdAt: string;
  updatedAt?: string;
  ingredients?: RecipeIngredientDto[];
  steps?: RecipeStepDto[];
  tags?: RecipeTagDto[];
  revisions?: RecipeRevisionDto[];
  favorites?: RecipeFavoriteDto[];
}

export interface RecipeFavoriteDto {
  recipeId: number;
  userId: string;
  favoritedAt: string;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: DifficultyLevel;
  ingredients: CreateRecipeIngredientRequest[];
  steps: CreateRecipeStepRequest[];
  tags?: string[];
}

export interface CreateRecipeIngredientRequest {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface CreateRecipeStepRequest {
  stepNumber: number;
  instruction: string;
  duration?: number;
}

export interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: DifficultyLevel;
}
