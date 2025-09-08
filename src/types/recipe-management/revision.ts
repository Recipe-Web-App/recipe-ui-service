import { RevisionType, RevisionCategory } from './common';

export interface RecipeRevisionDto {
  revisionId: number;
  recipeId: number;
  userId: string;
  revisionCategory: RevisionCategory;
  revisionType: RevisionType;
  previousData?: string;
  newData?: string;
  changeComment?: string;
  createdAt: string;
}

export interface RevisionDto {
  revisionId: number;
  revisionType: RevisionType;
  category: RevisionCategory;
  changes?: Record<string, unknown>;
  createdBy: number;
  createdAt: string;
}

export interface RecipeRevisionsResponse {
  recipeId?: number;
  revisions?: RevisionDto[];
}

export interface StepRevisionsResponse {
  stepId?: number;
  revisions?: RevisionDto[];
}

export interface IngredientRevisionsResponse {
  ingredientId?: number;
  revisions?: RevisionDto[];
}
