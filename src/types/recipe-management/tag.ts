export interface RecipeTagDto {
  tagId: number;
  name: string;
  category: string;
  description?: string;
  usageCount?: number;
}

export interface TagResponse {
  recipeId?: number;
  tags?: RecipeTagDto[];
  tag?: RecipeTagDto;
  addedAt?: string;
  removedAt?: string;
  removedTag?: RecipeTagDto;
}

export interface AddTagRequest {
  tagName: string;
  category?: string;
}

export interface RemoveTagRequest {
  tagName: string;
}
