import type {
  CollaborationMode,
  CollectionVisibility,
  PageInfo,
} from './common';

/**
 * Basic collection DTO with metadata and counts
 */
export interface CollectionDto {
  collectionId: number;
  userId: string;
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  collaborationMode: CollaborationMode;
  recipeCount: number;
  collaboratorCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detailed collection DTO including all recipes in display order
 */
export interface CollectionDetailsDto {
  collectionId: number;
  userId: string;
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  collaborationMode: CollaborationMode;
  recipeCount: number;
  collaboratorCount: number;
  createdAt: string;
  updatedAt: string;
  recipes: CollectionRecipeDto[];
}

/**
 * Recipe within a collection with display order and metadata
 */
export interface CollectionRecipeDto {
  recipeId: number;
  recipeTitle: string;
  recipeDescription?: string;
  displayOrder: number;
  addedBy: string;
  addedAt: string;
}

/**
 * Collection collaborator with permissions metadata
 */
export interface CollaboratorDto {
  userId: string;
  username: string;
  grantedBy: string;
  grantedAt: string;
}

/**
 * Paginated collection response
 */
export interface PageCollectionDto extends PageInfo {
  content: CollectionDto[];
}

/**
 * Request to create a new collection
 */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  collaborationMode: CollaborationMode;
}

/**
 * Request to update collection metadata
 */
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  visibility?: CollectionVisibility;
  collaborationMode?: CollaborationMode;
}

/**
 * Request to search collections with filters
 */
export interface SearchCollectionsRequest {
  query?: string;
  visibility?: CollectionVisibility[];
  collaborationMode?: CollaborationMode[];
  ownerUserId?: string;
  minRecipeCount?: number;
  maxRecipeCount?: number;
}

/**
 * Request to add a collaborator to a collection
 */
export interface AddCollaboratorRequest {
  userId: string;
}

/**
 * Request to update a single recipe's display order
 */
export interface UpdateRecipeOrderRequest {
  displayOrder: number;
}

/**
 * Request to batch reorder recipes in a collection
 */
export interface ReorderRecipesRequest {
  recipes: Array<{
    recipeId: number;
    displayOrder: number;
  }>;
}
