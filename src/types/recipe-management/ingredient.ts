import { IngredientUnit } from './common';

export interface RecipeIngredientDto {
  recipeId?: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: IngredientUnit;
  isOptional?: boolean;
  comments?: IngredientCommentDto[];
}

export interface IngredientCommentDto {
  commentId: number;
  recipeId: number;
  userId: string;
  commentText: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RecipeIngredientsResponse {
  recipeId: number;
  ingredients: (RecipeIngredientDto & {
    comments: IngredientCommentDto[];
  })[];
}

export interface ShoppingListResponse {
  recipeId: number;
  recipeTitle: string;
  items: ShoppingListItemDto[];
  generatedAt: string;
}

export interface ShoppingListItemDto {
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: string;
  notes?: string;
}

export interface AddIngredientCommentRequest {
  comment: string;
  userId: number;
}

export interface EditIngredientCommentRequest {
  commentId: number;
  comment: string;
  userId: number;
}

export interface DeleteIngredientCommentRequest {
  commentId: number;
  userId: number;
}

export interface IngredientCommentResponse {
  comment?: IngredientCommentDto;
  status?: string;
}
