/**
 * Request schema for creating a recipe from a URL.
 */
export interface CreateRecipeRequest {
  /** The recipe URL to create. Should point to a valid recipe page. */
  recipeUrl: string;
}
