import { DifficultyLevel } from './common';
import { RecipeDto } from './recipe';

export enum SearchSortBy {
  RATING_DESC = 'RATING_DESC',
  RATING_ASC = 'RATING_ASC',
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  TITLE_ASC = 'TITLE_ASC',
  TITLE_DESC = 'TITLE_DESC',
}

export interface SearchRecipesRequest {
  query?: string;
  ingredients?: string[];
  tags?: string[];
  difficulty?: DifficultyLevel[];
  maxPrepTime?: number;
  maxCookTime?: number;
  minRating?: number;
  sortBy?: SearchSortBy;
}

export interface SearchRecipesResponse {
  content: RecipeDto[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
