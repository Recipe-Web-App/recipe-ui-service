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
  ingredientId?: number;
  ingredientName: string;
  totalQuantity: number;
  unit: IngredientUnit;
  isOptional?: boolean;
  estimatedPrice?: number;
}

export interface AddIngredientCommentRequest {
  comment: string;
}

export interface EditIngredientCommentRequest {
  commentId: number;
  comment: string;
}

export interface DeleteIngredientCommentRequest {
  commentId: number;
}

export interface IngredientCommentResponse {
  comment?: IngredientCommentDto;
  status?: string;
}
