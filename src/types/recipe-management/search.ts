import { DifficultyLevel, IngredientMatchMode } from './common';
import { RecipeDto } from './recipe';

/**
 * @deprecated SearchSortBy is no longer used in the API
 */
export enum SearchSortBy {
  RATING_DESC = 'RATING_DESC',
  RATING_ASC = 'RATING_ASC',
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  TITLE_ASC = 'TITLE_ASC',
  TITLE_DESC = 'TITLE_DESC',
}

export interface SearchRecipesRequest {
  recipeNameQuery?: string;
  ingredients?: string[];
  ingredientMatchMode?: IngredientMatchMode;
  tags?: string[];
  difficulty?: DifficultyLevel;
  maxPreparationTime?: number;
  maxCookingTime?: number;
  minServings?: number;
  maxServings?: number;
}

export interface SearchRecipesResponse {
  content: RecipeDto[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
