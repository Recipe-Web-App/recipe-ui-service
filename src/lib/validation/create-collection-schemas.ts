/**
 * Create Collection Form Validation Schemas
 *
 * Zod validation schemas for the Create Collection form.
 * Provides both full form validation and section-level validation.
 */

import { z } from 'zod';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import {
  CREATE_COLLECTION_LIMITS,
  CreateCollectionSection,
} from '@/types/collection/create-collection-form';
import type { CreateCollectionFormData } from '@/types/collection/create-collection-form';

/**
 * Collection name validation schema.
 * Required, 3-100 characters, trimmed.
 */
export const collectionNameSchema = z
  .string({ message: 'Collection name is required' })
  .min(1, 'Collection name is required')
  .min(
    CREATE_COLLECTION_LIMITS.NAME_MIN_LENGTH,
    `Collection name must be at least ${CREATE_COLLECTION_LIMITS.NAME_MIN_LENGTH} characters`
  )
  .max(
    CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH,
    `Collection name must not exceed ${CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH} characters`
  )
  .trim();

/**
 * Collection description validation schema.
 * Optional (can be empty), max 500 characters, trimmed.
 */
export const collectionDescriptionSchema = z
  .string()
  .max(
    CREATE_COLLECTION_LIMITS.DESCRIPTION_MAX_LENGTH,
    `Description must not exceed ${CREATE_COLLECTION_LIMITS.DESCRIPTION_MAX_LENGTH} characters`
  )
  .trim()
  .default('');

/**
 * Collection visibility validation schema.
 */
export const collectionVisibilitySchema = z.nativeEnum(CollectionVisibility, {
  message: 'Please select a visibility option',
});

/**
 * Collection collaboration mode validation schema.
 */
export const collectionCollaborationModeSchema = z.nativeEnum(
  CollaborationMode,
  {
    message: 'Please select a collaboration mode',
  }
);

/**
 * Single tag validation schema.
 */
export const collectionTagSchema = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(
    CREATE_COLLECTION_LIMITS.MAX_TAG_LENGTH,
    `Tag must not exceed ${CREATE_COLLECTION_LIMITS.MAX_TAG_LENGTH} characters`
  )
  .trim();

/**
 * Tags array validation schema.
 * Max 20 tags, no duplicates.
 */
export const collectionTagsSchema = z
  .array(collectionTagSchema)
  .max(
    CREATE_COLLECTION_LIMITS.MAX_TAGS,
    `Collection cannot have more than ${CREATE_COLLECTION_LIMITS.MAX_TAGS} tags`
  )
  .refine(
    tags => {
      const normalizedTags = tags.map(t => t.toLowerCase().trim());
      return new Set(normalizedTags).size === normalizedTags.length;
    },
    { message: 'Tags must be unique' }
  )
  .default([]);

/**
 * Single recipe in collection validation schema.
 */
export const collectionRecipeSchema = z.object({
  id: z.string().min(1, 'Recipe ID is required'),
  recipeId: z
    .number({ message: 'Recipe ID is required' })
    .int('Recipe ID must be an integer')
    .positive('Recipe ID must be a positive number'),
  recipeTitle: z.string().min(1, 'Recipe title is required'),
  recipeDescription: z.string().optional(),
  recipeImageUrl: z.string().optional(),
  displayOrder: z
    .number()
    .int('Display order must be an integer')
    .min(0, 'Display order must be non-negative'),
});

/**
 * Validates that recipe IDs are unique in the collection.
 */
function validateUniqueRecipeIds(
  recipes: z.infer<typeof collectionRecipeSchema>[],
  ctx: z.RefinementCtx
): void {
  const recipeIdIndices = new Map<number, number[]>();

  recipes.forEach((recipe, index) => {
    const indices = recipeIdIndices.get(recipe.recipeId) ?? [];
    indices.push(index);
    recipeIdIndices.set(recipe.recipeId, indices);
  });

  recipeIdIndices.forEach(indices => {
    if (indices.length > 1) {
      indices.forEach(index => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate recipe in collection',
          path: [index, 'recipeId'],
        });
      });
    }
  });
}

/**
 * Recipes array validation schema.
 * Min 1, max 50 recipes, no duplicates.
 */
export const collectionRecipesSchema = z
  .array(collectionRecipeSchema)
  .min(
    CREATE_COLLECTION_LIMITS.MIN_RECIPES,
    `At least ${CREATE_COLLECTION_LIMITS.MIN_RECIPES} recipe is required`
  )
  .max(
    CREATE_COLLECTION_LIMITS.MAX_RECIPES,
    `Collection cannot have more than ${CREATE_COLLECTION_LIMITS.MAX_RECIPES} recipes`
  )
  .superRefine(validateUniqueRecipeIds);

/**
 * Single collaborator validation schema.
 */
export const collaboratorSchema = z.object({
  id: z.string().min(1, 'Collaborator ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  username: z.string().min(1, 'Username is required'),
  displayName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

/**
 * Validates that user IDs are unique in the collaborators list.
 */
function validateUniqueCollaboratorIds(
  collaborators: z.infer<typeof collaboratorSchema>[],
  ctx: z.RefinementCtx
): void {
  const userIdIndices = new Map<string, number[]>();

  collaborators.forEach((collaborator, index) => {
    const indices = userIdIndices.get(collaborator.userId) ?? [];
    indices.push(index);
    userIdIndices.set(collaborator.userId, indices);
  });

  userIdIndices.forEach(indices => {
    if (indices.length > 1) {
      indices.forEach(index => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate collaborator',
          path: [index, 'userId'],
        });
      });
    }
  });
}

/**
 * Collaborators array validation schema.
 * Max 20 collaborators, no duplicates.
 */
export const collaboratorsSchema = z
  .array(collaboratorSchema)
  .max(
    CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS,
    `Collection cannot have more than ${CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS} collaborators`
  )
  .superRefine(validateUniqueCollaboratorIds)
  .default([]);

/**
 * Basic info section validation schema.
 * Used for section-level validation.
 */
export const basicInfoSectionSchema = z.object({
  name: collectionNameSchema,
  description: collectionDescriptionSchema,
  visibility: collectionVisibilitySchema,
  collaborationMode: collectionCollaborationModeSchema,
  tags: collectionTagsSchema,
});

/**
 * Recipes section validation schema.
 * Used for section-level validation.
 */
export const recipesSectionSchema = z.object({
  recipes: collectionRecipesSchema,
});

/**
 * Collaborators section validation schema.
 * Used for section-level validation.
 */
export const collaboratorsSectionSchema = z.object({
  collaborators: collaboratorsSchema,
});

/**
 * Complete create collection form schema.
 * Includes cross-field validation for collaborators requirement.
 */
export const createCollectionFormSchema = z
  .object({
    name: collectionNameSchema,
    description: collectionDescriptionSchema,
    visibility: collectionVisibilitySchema,
    collaborationMode: collectionCollaborationModeSchema,
    tags: collectionTagsSchema,
    recipes: collectionRecipesSchema,
    collaborators: collaboratorsSchema,
  })
  .refine(
    data => {
      // Collaborators are required only when SPECIFIC_USERS mode is selected
      if (data.collaborationMode === CollaborationMode.SPECIFIC_USERS) {
        return data.collaborators.length > 0;
      }
      return true;
    },
    {
      message:
        'At least one collaborator is required when using Specific Users mode',
      path: ['collaborators'],
    }
  );

/**
 * Type exports inferred from schemas.
 */
export type CreateCollectionFormSchema = z.infer<
  typeof createCollectionFormSchema
>;
export type BasicInfoSectionSchema = z.infer<typeof basicInfoSectionSchema>;
export type RecipesSectionSchema = z.infer<typeof recipesSectionSchema>;
export type CollaboratorsSectionSchema = z.infer<
  typeof collaboratorsSectionSchema
>;
export type CollectionRecipeSchema = z.infer<typeof collectionRecipeSchema>;
export type CollaboratorSchema = z.infer<typeof collaboratorSchema>;

/**
 * Map of section schemas for section-level validation.
 * Note: REVIEW section doesn't have its own schema as it's just a summary.
 */
export const sectionSchemas: Partial<
  Record<CreateCollectionSection, z.ZodType>
> = {
  [CreateCollectionSection.BASIC_INFO]: basicInfoSectionSchema,
  [CreateCollectionSection.RECIPES]: recipesSectionSchema,
  [CreateCollectionSection.COLLABORATORS]: collaboratorsSectionSchema,
};

/**
 * Fields belonging to each section.
 * Used for partial validation with React Hook Form.
 */
export const sectionFields: Record<
  CreateCollectionSection,
  (keyof CreateCollectionFormData)[]
> = {
  [CreateCollectionSection.BASIC_INFO]: [
    'name',
    'description',
    'visibility',
    'collaborationMode',
    'tags',
  ],
  [CreateCollectionSection.RECIPES]: ['recipes'],
  [CreateCollectionSection.COLLABORATORS]: ['collaborators'],
  [CreateCollectionSection.REVIEW]: [], // Review section doesn't have its own fields
};

/**
 * Validates a specific section of the form.
 *
 * @param sectionId - The section to validate
 * @param data - Partial form data to validate
 * @returns Validation result with success flag and optional errors
 */
export function validateSection(
  sectionId: CreateCollectionSection,
  data: Partial<CreateCollectionFormData>
): { success: boolean; errors?: z.ZodError } {
  // eslint-disable-next-line security/detect-object-injection -- sectionId is a typed enum
  const schema = sectionSchemas[sectionId];

  if (!schema) {
    return { success: true };
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true };
  }

  return { success: false, errors: result.error };
}

/**
 * Checks if a section is complete (all required fields valid).
 *
 * @param sectionId - The section to check
 * @param data - Partial form data to check
 * @returns Whether the section is complete
 */
export function isSectionComplete(
  sectionId: CreateCollectionSection,
  data: Partial<CreateCollectionFormData>
): boolean {
  return validateSection(sectionId, data).success;
}

/**
 * Validates the full form including cross-field validations.
 *
 * @param data - Full form data to validate
 * @returns Validation result with success flag and optional errors
 */
export function validateForm(data: CreateCollectionFormData): {
  success: boolean;
  errors?: z.ZodError;
} {
  const result = createCollectionFormSchema.safeParse(data);

  if (result.success) {
    return { success: true };
  }

  return { success: false, errors: result.error };
}
