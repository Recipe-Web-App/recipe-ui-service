export interface RecipeTagDto {
  tagId: number;
  name: string;
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
  name: string;
}

export interface RemoveTagRequest {
  tagName: string;
}
