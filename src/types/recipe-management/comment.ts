/**
 * Recipe Comment DTOs and Request/Response types
 * Based on recipe-management-openapi.yaml specification
 */

/**
 * Recipe comment data transfer object
 * Represents a user comment on a recipe
 */
export interface RecipeCommentDto {
  /** Unique comment identifier */
  commentId: number;
  /** Recipe this comment belongs to */
  recipeId: number;
  /** User who wrote the comment (UUID) */
  userId: string;
  /** Comment text content (1-2000 characters) */
  commentText: string;
  /** Whether the comment is publicly visible */
  isPublic: boolean;
  /** When the comment was created */
  createdAt: string;
  /** When the comment was last updated */
  updatedAt?: string;
}

/**
 * Request payload for creating a new recipe comment
 */
export interface AddRecipeCommentRequest {
  /** Comment text content (1-2000 characters) */
  commentText: string;
  /** Whether the comment should be publicly visible (default: true) */
  isPublic?: boolean;
}

/**
 * Request payload for updating an existing recipe comment
 */
export interface EditRecipeCommentRequest {
  /** Updated comment text (1-2000 characters) */
  commentText: string;
}

/**
 * Response containing all comments for a recipe
 */
export interface RecipeCommentsResponse {
  /** Recipe identifier */
  recipeId: number;
  /** List of comments for the recipe */
  comments: RecipeCommentDto[];
}
