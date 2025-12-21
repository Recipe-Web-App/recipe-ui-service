/**
 * Create Collection Form Types
 *
 * TypeScript interfaces and types for the Create Collection form,
 * including form data structures, section configuration, and default values.
 */

import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

/**
 * Recipe item data for display in the collection form.
 * Used for tracking selected recipes with drag-and-drop support.
 * Includes index signature for compatibility with SortableItemData.
 */
export interface CollectionRecipeFormData {
  /** Temporary ID for drag-and-drop tracking (UUID) */
  id: string;
  /** Actual recipe ID from the backend */
  recipeId: number;
  /** Recipe title for display */
  recipeTitle: string;
  /** Recipe description for display (truncated) */
  recipeDescription?: string;
  /** Recipe image URL for display */
  recipeImageUrl?: string;
  /** Position in the collection (0-indexed) */
  displayOrder: number;
  /** Index signature for SortableItemData compatibility */
  [key: string]: unknown;
}

/**
 * Collaborator data for display in the collection form.
 * Used for tracking selected collaborators.
 */
export interface CollaboratorFormData {
  /** Temporary ID for list management (UUID) */
  id: string;
  /** User ID from the backend */
  userId: string;
  /** Username for display */
  username: string;
  /** Display name (full name) for display */
  displayName?: string;
  /** Avatar URL for display */
  avatarUrl?: string;
}

/**
 * Complete form data structure for creating a collection.
 * This is the shape of data managed by React Hook Form.
 */
export interface CreateCollectionFormData {
  /** Collection name (required, 3-100 characters) */
  name: string;
  /** Collection description (optional, max 500 characters) */
  description: string;
  /** Visibility setting for the collection */
  visibility: CollectionVisibility;
  /** Collaboration mode setting */
  collaborationMode: CollaborationMode;
  /** Tags associated with the collection (max 20) */
  tags: string[];
  /** Recipes in the collection (min 1, max 50) */
  recipes: CollectionRecipeFormData[];
  /** Collaborators (required when collaborationMode is SPECIFIC_USERS, max 20) */
  collaborators: CollaboratorFormData[];
}

/**
 * Default values for the create collection form.
 * Used to initialize React Hook Form.
 */
export const CREATE_COLLECTION_DEFAULT_VALUES: CreateCollectionFormData = {
  name: '',
  description: '',
  visibility: CollectionVisibility.PRIVATE,
  collaborationMode: CollaborationMode.OWNER_ONLY,
  tags: [],
  recipes: [],
  collaborators: [],
};

/**
 * Form section identifiers for navigation and validation.
 */
export enum CreateCollectionSection {
  BASIC_INFO = 'basic-info',
  RECIPES = 'recipes',
  COLLABORATORS = 'collaborators',
  REVIEW = 'review',
}

/**
 * Configuration for a form section.
 * Used to render section navigation and headers.
 */
export interface CollectionSectionConfig {
  /** Unique section identifier */
  id: CreateCollectionSection;
  /** Display title for the section */
  title: string;
  /** Brief description of the section */
  description: string;
  /** Whether this section contains required fields */
  isRequired: boolean;
}

/**
 * Configuration for all form sections.
 */
export const COLLECTION_SECTIONS: CollectionSectionConfig[] = [
  {
    id: CreateCollectionSection.BASIC_INFO,
    title: 'Basic Information',
    description: 'Name, description, and visibility settings',
    isRequired: true,
  },
  {
    id: CreateCollectionSection.RECIPES,
    title: 'Add Recipes',
    description: 'Search and select recipes for your collection',
    isRequired: true,
  },
  {
    id: CreateCollectionSection.COLLABORATORS,
    title: 'Add Collaborators',
    description: 'Invite users to contribute to your collection',
    isRequired: false,
  },
  {
    id: CreateCollectionSection.REVIEW,
    title: 'Review',
    description: 'Preview your collection before creating',
    isRequired: false,
  },
];

/**
 * Validation limits for the create collection form.
 */
export const CREATE_COLLECTION_LIMITS = {
  /** Minimum name length */
  NAME_MIN_LENGTH: 3,
  /** Maximum name length */
  NAME_MAX_LENGTH: 100,
  /** Maximum description length */
  DESCRIPTION_MAX_LENGTH: 500,
  /** Maximum number of tags */
  MAX_TAGS: 20,
  /** Maximum tag length */
  MAX_TAG_LENGTH: 50,
  /** Minimum number of recipes */
  MIN_RECIPES: 1,
  /** Maximum number of recipes */
  MAX_RECIPES: 50,
  /** Maximum number of collaborators */
  MAX_COLLABORATORS: 20,
} as const;

/**
 * Options for visibility radio group.
 */
export const VISIBILITY_OPTIONS = [
  {
    value: CollectionVisibility.PRIVATE,
    label: 'Private',
    description: 'Only you can see this collection',
  },
  {
    value: CollectionVisibility.FRIENDS_ONLY,
    label: 'Friends Only',
    description: 'Only your friends can see this collection',
  },
  {
    value: CollectionVisibility.PUBLIC,
    label: 'Public',
    description: 'Anyone can see this collection',
  },
] as const;

/**
 * Options for collaboration mode radio group.
 */
export const COLLABORATION_MODE_OPTIONS = [
  {
    value: CollaborationMode.OWNER_ONLY,
    label: 'Owner Only',
    description: 'Only you can add or remove recipes',
  },
  {
    value: CollaborationMode.SPECIFIC_USERS,
    label: 'Specific Users',
    description: 'Invite specific users to collaborate',
  },
  {
    value: CollaborationMode.ALL_USERS,
    label: 'All Users',
    description: 'Anyone can add recipes to this collection',
  },
] as const;

/**
 * Input type for creating a recipe form data item.
 * Excludes auto-generated fields.
 */
export interface CreateCollectionRecipeInput {
  recipeId: number;
  recipeTitle: string;
  recipeDescription?: string;
  recipeImageUrl?: string;
}

/**
 * Helper function to create a new recipe form data item.
 * Generates a unique ID for drag-and-drop tracking.
 */
export function createCollectionRecipeFormData(
  recipe: CreateCollectionRecipeInput,
  displayOrder: number
): CollectionRecipeFormData {
  return {
    id: crypto.randomUUID(),
    recipeId: recipe.recipeId,
    recipeTitle: recipe.recipeTitle,
    recipeDescription: recipe.recipeDescription,
    recipeImageUrl: recipe.recipeImageUrl,
    displayOrder,
  };
}

/**
 * Helper function to create a new collaborator form data item.
 * Generates a unique ID for list management.
 */
export function createCollaboratorFormData(
  collaborator: Omit<CollaboratorFormData, 'id'>
): CollaboratorFormData {
  return {
    id: crypto.randomUUID(),
    ...collaborator,
  };
}

/**
 * Props for section components.
 * All section components receive the form instance and common callbacks.
 */
export interface SectionComponentProps {
  /** Whether this section is currently active/visible */
  isActive?: boolean;
}
