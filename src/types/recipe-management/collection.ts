import type {
  CollaborationMode,
  CollectionVisibility,
  PageInfo,
} from './common';

/**
 * Tag associated with a collection
 */
export interface CollectionTagDto {
  tagId: number;
  name: string;
}

/**
 * Response containing collection tags
 */
export interface CollectionTagResponse {
  collectionId: number;
  tags: CollectionTagDto[];
}

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
  /** Tags associated with this collection */
  tags?: CollectionTagDto[];
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
  /** Collaborators for this collection */
  collaborators?: CollaboratorDto[];
  /** Tags associated with this collection */
  tags?: CollectionTagDto[];
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
  collectionId?: number;
  userId: string;
  username: string;
  grantedBy: string;
  grantedByUsername?: string;
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
 *
 * Supports batch operations during creation:
 * - recipeIds: Add recipes to the collection in a single request
 * - collaboratorIds: Add collaborators (only applicable when collaborationMode is SPECIFIC_USERS)
 * - tags: Associate tags with the collection (tags will be created if they don't exist)
 */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
  visibility: CollectionVisibility;
  collaborationMode: CollaborationMode;
  /** Optional array of recipe IDs to add during creation (auto-ordered by position) */
  recipeIds?: number[];
  /** Optional array of user IDs to add as collaborators (only for SPECIFIC_USERS mode) */
  collaboratorIds?: string[];
  /** Optional array of tag names to associate with the collection during creation */
  tags?: string[];
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
